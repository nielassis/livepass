import { Buyer, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AuthUserPayload } from '../../types/auth';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { normalizePagination } from '../../utils/normalizePagination';
import { BuyerListQuery } from './buyers.types';
import { PageResult } from '../../types/pagination';

export async function getAllBuyers(
  context: AuthUserPayload,
  query: BuyerListQuery,
): Promise<PageResult<Buyer>> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = query.name ? cleanString(query.name) : undefined;
  const email = query.email ? cleanString(query.email) : undefined;

  const where: Prisma.BuyerWhereInput = {
    organizationId,
    name: name ? { contains: name, mode: 'insensitive' } : undefined,
    email: email ? { contains: email, mode: 'insensitive' } : undefined,
  };

  const total = await prisma.buyer.count({ where });

  const data = await prisma.buyer.findMany({
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

export async function getBuyerById(
  buyerId: string,
  context: AuthUserPayload,
): Promise<Buyer> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(buyerId);

  if (!id) {
    throw new AppError('Comprador não encontrado', 404);
  }

  const buyer = await prisma.buyer.findFirst({
    where: { id, organizationId },
  });

  if (!buyer) {
    throw new AppError('Comprador não encontrado', 404);
  }

  return buyer;
}

export async function getBuyerByEmail(email: string): Promise<Buyer | null> {
  const cleanEmail = cleanString(email);
  if (!cleanEmail) return null;

  return prisma.buyer.findUnique({
    where: { email: cleanEmail },
  });
}

export async function createBuyer(
  organizationId: string,
  name: string,
  email: string,
  documentType: 'CPF' | 'CNPJ',
  documentNumber: string,
  address: string,
): Promise<Buyer> {
  const cleanName = cleanString(name);
  const cleanEmail = cleanString(email);
  const cleanDocumentNumber = cleanString(documentNumber);
  const cleanAddress = cleanString(address);

  if (!cleanName || !cleanEmail || !cleanDocumentNumber || !cleanAddress) {
    throw new AppError('Dados do comprador inválidos', 400);
  }

  return prisma.buyer.create({
    data: {
      organizationId,
      name: cleanName,
      email: cleanEmail,
      documentType,
      documentNumber: cleanDocumentNumber,
      address: cleanAddress,
    },
  });
}