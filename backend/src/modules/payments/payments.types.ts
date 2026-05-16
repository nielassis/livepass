import { Payment, PaymentStatus } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type CreatePaymentLinkDTO = {
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerDocumentType: 'CPF' | 'CNPJ';
  buyerDocumentNumber: string;
  buyerAddress: string;
};

export type PaymentLinkResponse = {
  paymentLink: string;
  preferenceId: string;
};

export type FilterPaymentQuery = {
  status?: PaymentStatus;
};

export type PaymentPage = PageResult<Payment>;
export type PaymentListQuery = FilterPaymentQuery & PaginationMetadata;