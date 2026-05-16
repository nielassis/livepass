import { User } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type CreateUserDTO = {
  name: string;
  email: string;
  documentType: 'CPF' | 'CNPJ';
  documentNumber: string;
  address: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'COLLABORATOR';
};

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type FilterUserQuery = {
  role?: string;
  name?: string;
};

export type FindUserParam = {
  userId: string;
};

export type UserPage = PageResult<User>;
export type UserListQuery = FilterUserQuery & PaginationMetadata;
