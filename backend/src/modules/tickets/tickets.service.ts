import { Ticket, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AuthUserPayload } from '../../types/auth';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { normalizePagination } from '../../utils/normalizePagination';
import { TicketListQuery } from './tickets.types';
import { PageResult } from '../../types/pagination';

export async function getAllTickets(
  context: AuthUserPayload,
  query: TicketListQuery,
): Promise<PageResult<Ticket>> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const { page, limit } = normalizePagination(query.page, query.limit);

  const eventId = query.eventId ? cleanString(query.eventId) : undefined;
  const buyerId = query.buyerId ? cleanString(query.buyerId) : undefined;

  const where: Prisma.TicketWhereInput = {
    organizationId,
    eventId,
    buyerId,
  };

  const total = await prisma.ticket.count({ where });

  const data = await prisma.ticket.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      event: true,
      buyer: true,
      payments: true,
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

export async function getTicketById(
  ticketId: string,
  context: AuthUserPayload,
): Promise<Ticket> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(ticketId);

  if (!id) {
    throw new AppError('Ingresso não encontrado', 404);
  }

  const ticket = await prisma.ticket.findFirst({
    where: { id, organizationId },
    include: {
      event: true,
      buyer: true,
      payments: true,
    },
  });

  if (!ticket) {
    throw new AppError('Ingresso não encontrado', 404);
  }

  return ticket;
}

export async function createTicket(
  organizationId: string,
  eventId: string,
  buyerId: string,
): Promise<Ticket> {
  const cleanOrgId = cleanString(organizationId);
  const cleanEventId = cleanString(eventId);
  const cleanBuyerId = cleanString(buyerId);

  if (!cleanOrgId || !cleanEventId || !cleanBuyerId) {
    throw new AppError('Dados do ingresso inválidos', 400);
  }

  const event = await prisma.events.findUnique({
    where: { id: cleanEventId },
  });

  if (!event) {
    throw new AppError('Evento não encontrado', 404);
  }

  const buyer = await prisma.buyer.findUnique({
    where: { id: cleanBuyerId },
  });

  if (!buyer) {
    throw new AppError('Comprador não encontrado', 404);
  }

  return prisma.ticket.create({
    data: {
      organizationId: cleanOrgId,
      eventId: cleanEventId,
      buyerId: cleanBuyerId,
    },
    include: {
      event: true,
      buyer: true,
    },
  });
}