import { Events, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { Permissions } from '../../lib/permissions';
import { AuthUserPayload } from '../../types/auth';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { parseDate } from '../../utils/parseDate';
import { CreateEventDTO, EventListQuery } from './events.types';
import { PageResult } from '../../types/pagination';
import { normalizePagination } from '../../utils/normalizePagination';

export async function createEvent(
  dto: CreateEventDTO,
  context: AuthUserPayload,
): Promise<Events> {
  Permissions.assertHighPrivileges(context);
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const name = cleanString(dto.name);
  const description = cleanString(dto.description);
  const date = parseDate(dto.date);
  const imageUrl = cleanString(dto.imageUrl);
  const priceCents = dto.priceCents;

  if (!name || !description || !date || !imageUrl || !priceCents) {
    throw new AppError('Todos os campos são obrigatórios', 400);
  }

  const event = await prisma.events.create({
    data: {
      organizationId,
      name,
      description,
      date,
      imageUrl,
      priceCents,
    },
  });

  return event;
}

export async function getAllEvents(
  context: AuthUserPayload,
  query: EventListQuery,
): Promise<PageResult<Events>> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = query.name ? cleanString(query.name) : undefined;
  const date = query.date ? parseDate(query.date) : undefined;
  const isFree = query.isFree ? true : undefined;

  const where: Prisma.EventsWhereInput = {
    organizationId,
    name: name ? { contains: name, mode: 'insensitive' } : undefined,
    date: date ? date : undefined,
    isFree: isFree,
  };

  const total = await prisma.events.count({ where });

  const data = await prisma.events.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
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

export async function getEventById(
  eventId: string,
  context: AuthUserPayload,
): Promise<Events> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(eventId);

  if (!id) {
    throw new AppError('Evento não encontrado', 404);
  }

  const event = await prisma.events.findUnique({
    where: { id, organizationId },
  });

  if (!event) {
    throw new AppError('Evento não encontrado', 404);
  }

  return event;
}

export async function updateEvent(
  eventId: string,
  dto: Partial<CreateEventDTO>,
  context: AuthUserPayload,
) {
  Permissions.assertHighPrivileges(context);

  const organizationId = cleanString(context.organizationId);
  if (!organizationId) throw new AppError('Organização não encontrada', 404);

  const id = cleanString(eventId);
  if (!id) throw new AppError('Evento não encontrado', 404);

  const event = await prisma.events.findFirst({
    where: { id, organizationId },
  });

  if (!event) throw new AppError('Evento não encontrado', 404);

  const data = {
    ...(dto.name !== undefined && { name: cleanString(dto.name) }),
    ...(dto.description !== undefined && {
      description: cleanString(dto.description),
    }),
    ...(dto.date !== undefined && { date: parseDate(dto.date) as string }),
    ...(dto.imageUrl !== undefined && { imageUrl: cleanString(dto.imageUrl) }),
    ...(dto.priceCents !== undefined && { priceCents: dto.priceCents }),
    ...(dto.isFree !== undefined && { isFree: dto.isFree }),
  };

  try {
    return await prisma.events.update({
      where: { id },
      data,
    });
  } catch {
    throw new AppError('Erro ao atualizar evento', 500);
  }
}

export async function deleteEventById(
  eventId: string,
  context: AuthUserPayload,
): Promise<{ success: boolean }> {
  Permissions.assertHighPrivileges(context);
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(eventId);

  if (!id) {
    throw new AppError('Evento não encontrado', 404);
  }

  const event = await prisma.events.findUnique({
    where: { id, organizationId },
  });

  if (!event) {
    throw new AppError('Evento não encontrado', 404);
  }

  try {
    await prisma.events.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    throw new AppError('Erro ao deletar evento', 500);
  }
}
