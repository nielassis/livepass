import { User, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { Permissions } from '../../lib/permissions';
import { AuthUserPayload } from '../../types/auth';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { normalizePagination } from '../../utils/normalizePagination';
import { CreateUserDTO, UpdateUserDTO, UserListQuery } from './users.types';
import { PageResult } from '../../types/pagination';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '../../utils/generateRandomPassword';

export async function createUser(
  dto: CreateUserDTO,
  context: AuthUserPayload,
): Promise<User> {
  Permissions.assertAdminPrivileges(context);

  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const name = cleanString(dto.name);
  const email = cleanString(dto.email);
  const documentNumber = cleanString(dto.documentNumber);
  const address = cleanString(dto.address);

  if (!name || !email || !documentNumber || !address) {
    throw new AppError('Todos os campos são obrigatórios', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email já está em uso', 400);
  }

  const randomPassword = generateRandomPassword(8);

  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const user = await prisma.user.create({
    data: {
      organizationId,
      name,
      email,
      password: hashedPassword,
      documentType: dto.documentType,
      role: dto.role,
      documentNumber,
      address,
    },
  });

  return user;
}

export async function getAllUsers(
  context: AuthUserPayload,
  query: UserListQuery,
): Promise<PageResult<User>> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = query.name ? cleanString(query.name) : undefined;

  const where: Prisma.UserWhereInput = {
    organizationId,
    name: name ? { contains: name, mode: 'insensitive' } : undefined,
    role: query.role as Prisma.EnumUserRoleFilter | undefined,
  };

  const total = await prisma.user.count({ where });

  const data = await prisma.user.findMany({
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

export async function getUserById(
  userId: string,
  context: AuthUserPayload,
): Promise<User> {
  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(userId);

  if (!id) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const user = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
}

export async function updateUser(
  userId: string,
  dto: UpdateUserDTO,
  context: AuthUserPayload,
): Promise<User> {
  Permissions.assertAdminPrivileges(context);

  const organizationId = cleanString(context.organizationId);
  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(userId);
  if (!id) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const existingUser = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!existingUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const data: Prisma.UserUpdateInput = {};

  if (dto.name !== undefined) {
    data.name = cleanString(dto.name);
  }
  if (dto.email !== undefined) {
    const email = cleanString(dto.email);
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        throw new AppError('Email já está em uso', 400);
      }
      data.email = email;
    }
  }

  if (dto.documentType !== undefined) {
    data.documentType = dto.documentType;
  }
  if (dto.documentNumber !== undefined) {
    data.documentNumber = cleanString(dto.documentNumber);
  }
  if (dto.address !== undefined) {
    data.address = cleanString(dto.address);
  }
  if (dto.role !== undefined) {
    data.role = dto.role;
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch {
    throw new AppError('Erro ao atualizar usuário', 500);
  }
}

export async function deleteUserById(
  userId: string,
  context: AuthUserPayload,
): Promise<{ success: boolean }> {
  Permissions.assertAdminPrivileges(context);

  const organizationId = cleanString(context.organizationId);

  if (!organizationId) {
    throw new AppError('Organização não encontrada', 404);
  }

  const id = cleanString(userId);

  if (!id) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const user = await prisma.user.findFirst({
    where: { id, organizationId },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    throw new AppError('Erro ao deletar usuário', 500);
  }
}
