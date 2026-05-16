import { Ticket } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type FilterTicketQuery = {
  eventId?: string;
  buyerId?: string;
};

export type FindTicketParam = {
  ticketId: string;
};

export type TicketPage = PageResult<Ticket>;
export type TicketListQuery = FilterTicketQuery & PaginationMetadata;