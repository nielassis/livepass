import { PaymentStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/error';

function mapMercadoPagoStatusToPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case 'approved':
      return PaymentStatus.PAID;
    case 'pending':
      return PaymentStatus.PENDING;
    case 'rejected':
      return PaymentStatus.CANCELED;
    case 'cancelled':
      return PaymentStatus.CANCELED;
    case 'refunded':
      return PaymentStatus.CANCELED;
    default:
      return PaymentStatus.PENDING;
  }
}

export async function handleMercadoPagoWebhook(topic: string, dataId: string) {
  if (topic !== 'payment') {
    console.log(`Topic ${topic} não é um pagamento, ignorando`);
    return;
  }

  const paymentDataResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${dataId}`,
    {
      headers: {
        Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    },
  );

  if (!paymentDataResponse.ok) {
    throw new AppError('Erro ao buscar dados do pagamento', 500);
  }

  const paymentData = await paymentDataResponse.json();

  const externalReference = paymentData.external_reference;
  if (!externalReference) {
    console.log('Payment sem external_reference, ignorando');
    return;
  }

  const status = mapMercadoPagoStatusToPaymentStatus(paymentData.status);

  const payment = await prisma.payment.findUnique({
    where: { transactionId: externalReference },
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
    console.log(
      `Payment não encontrado para transactionId: ${externalReference}`,
    );
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status },
  });

  if (status === PaymentStatus.PAID) {
    if (!payment.ticket) {
      console.log(`Ticket não encontrado para pagamento ${payment.id}`);
    } else {
      await prisma.ticket.create({
        data: {
          eventId: payment.ticket.eventId,
          buyerId: payment.ticket.buyerId,
          organizationId: payment.ticket.organizationId,
        },
      });
    }
  } else if (status === PaymentStatus.CANCELED) {
    console.log(`Pagamento ${payment.id} cancelado`);
  }

  return { success: true };
}
