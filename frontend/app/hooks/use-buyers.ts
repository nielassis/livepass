import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export interface Buyer {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyersResponse {
  data: Buyer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchBuyers = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<BuyersResponse>("/buyers", {
        params: { page, limit: 10 },
      });
      setBuyers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Erro ao carregar compradores");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  return { buyers, isLoading, error, pagination, refetch: fetchBuyers };
}