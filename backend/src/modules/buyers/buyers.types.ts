import { Buyer } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type FilterBuyerQuery = {
  name?: string;
  email?: string;
};

export type FindBuyerParam = {
  buyerId: string;
};

export type BuyerPage = PageResult<Buyer>;
export type BuyerListQuery = FilterBuyerQuery & PaginationMetadata;