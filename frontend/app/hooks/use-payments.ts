import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export interface Payment {
  id: string;
  organizationId: string;
  ticketId: string;
  transactionId: string;
  amountCents: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  ticket?: {
    event: {
      name: string;
    };
    buyer: {
      name: string;
      email: string;
    };
  };
}

export interface PaymentsResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPayments = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<PaymentsResponse>("/payments", {
        params: { page, limit: 10 },
      });
      setPayments(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Erro ao carregar pagamentos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, pagination, refetch: fetchPayments };
}