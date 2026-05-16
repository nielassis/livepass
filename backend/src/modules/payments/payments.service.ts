import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AuthUserPayload } from '../../types/auth';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { normalizePagination } from '../../utils/normalizePagination';
import { CreatePaymentLinkDTO, PaymentListQuery } from './payments.types';
import { PageResult } from '../../types/pagination';
import { createBuyer } from '../buyers/buyers.service';

interface MercadoPagoPreference {
  id: string;
  init_point: string;
}

async function createMercadoPagoPreference(
  dto: CreatePaymentLinkDTO,
  amountCents: number,
  _organizationId: string,
): Promise<MercadoPagoPreference> {
  const response = await fetch(
    'https://api.mercadopago.com/checkout/preferences',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Ingresso LivePass',
            description: `Compra de ingresso - ${dto.buyerName}`,
            quantity: 1,
            unit_price: amountCents / 100,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: dto.buyerName,
          email: dto.buyerEmail,
          identification: {
            type: dto.buyerDocumentType,
            number: dto.buyerDocumentNumber,
          },
        },
        payment_methods: {
          default_payment_method_id: 'pix',
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 1,
        },
        notification_url: `${env.API_URL || env.CLIENT_URL || ''}/api/webhooks/mercadopago`,
        auto_return: 'all',
        back_urls: {
          success: `${env.CLIENT_URL}/payment/success`,
          pending: `${env.CLIENT_URL}/payment/pending`,
          failure: `${env.CLIENT_URL}/payment/failure`,
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new AppError(
      `Erro ao criar preferência do Mercado Pago: ${error.message || 'Erro desconhecido'}`,
      500,
    );
  }

  return response.json();
}

export async function createPaymentLink(dto: CreatePaymentLinkDTO): Promise<{
  paymentLink: string;
  preferenceId: string;
  transactionId: string;
}> {
  const eventId = cleanString(dto.eventId);
  if (!eventId) {
    throw new AppError('Evento não encontrado', 404);
  }

  const event = await prisma.events.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError('Evento não encontrado', 404);
  }

  if (event.isFree) {
    throw new AppError('Evento gratuito não requer pagamento', 400);
  }

  const buyerDocumentNumber = cleanString(dto.buyerDocumentNumber);
  const buyerEmail = cleanString(dto.buyerEmail);
  const buyerName = cleanString(dto.buyerName);

  if (!buyerDocumentNumber || !buyerEmail || !buyerName) {
    throw new AppError('Dados do comprador inválidos', 400);
  }

  const existingBuyer = await prisma.buyer.findUnique({
    where: { email: buyerEmail },
  });

  let buyer;
  if (existingBuyer) {
    buyer = existingBuyer;
  } else {
    buyer = await createBuyer(
      event.organizationId,
      buyerName,
      buyerEmail,
      dto.buyerDocumentType,
      buyerDocumentNumber,
      cleanString(dto.buyerAddress) || '',
    );
  }

  const ticket = await prisma.ticket.create({
    data: {
      organizationId: event.organizationId,
      eventId: event.id,
      buyerId: buyer.id,
    },
  });

  const preference = await createMercadoPagoPreference(dto, event.priceCents, event.organizationId);

  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  await prisma.payment.create({
    data: {
      organizationId: event.organizationId,
      ticketId: ticket.id,
      transactionId,
      amountCents: event.priceCents,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    paymentLink: preference.init_point,
    preferenceId: preference.id,
    transactionId,
  };
}

export async function getAllPayments(
  context: AuthUserPayload,
  query: PaymentListQuery,
): Promise<PageResult<Payment>> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const { page, limit } = normalizePagination(query.page, query.limit);

  const where: Prisma.PaymentWhereInput = {
    organizationId,
    status: query.status,
  };

  const total = await prisma.payment.count({ where });

  const data = await prisma.payment.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      ticket: {
        include: {
          event: true,
          buyer: true,
        },
      },
    },
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPaymentById(
  paymentId: string,
  context: AuthUserPayload,
): Promise<Payment> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(paymentId);

  if (!id) {
    throw new AppError('Pagamento não encontrado', 404);
  }

  const payment = await prisma.payment.findFirst({
    where: { id, organizationId },
    include: {
      ticket: {
        include: {
          event: true,
          buyer: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError('Pagamento não encontrado', 404);
  }

  return payment;
}

export async function updatePaymentStatus(
  transactionId: string,
  status: PaymentStatus,
): Promise<Payment> {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
  });

  if (!payment) {
    throw new AppError('Pagamento não encontrado', 404);
  }

  return prisma.payment.update({
    where: { transactionId },
    data: { status },
  });
}
