import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export interface Ticket {
  id: string;
  organizationId: string;
  eventId: string;
  buyerId: string;
  createdAt: string;
  updatedAt: string;
  event?: {
    name: string;
    date: string;
  };
  buyer?: {
    name: string;
    email: string;
  };
  payments?: Array<{
    status: string;
    amountCents: number;
  }>;
}

export interface TicketsResponse {
  data: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTickets = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<TicketsResponse>("/tickets", {
        params: { page, limit: 10 },
      });
      setTickets(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Erro ao carregar ingressos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading, error, pagination, refetch: fetchTickets };
}