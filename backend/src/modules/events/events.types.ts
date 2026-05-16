import { Events } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type CreateEventDTO = {
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  priceCents: number;
  isFree?: boolean;
};

export type FilterEventQuery = {
  name?: string;
  date?: string;
  isFree?: boolean;
};

export type FindEventParam = {
  eventId: string;
};

export type EventPage = PageResult<Events>;
export type EventListQuery = FilterEventQuery & PaginationMetadata;
