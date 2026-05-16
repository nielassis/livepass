import { useState, useEffect, useCallback } from "react";

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  sold: number;
  status: "draft" | "active" | "finished";
  createdAt: string;
}

const STORAGE_KEY = "livepass_events";

const initialEvents: Event[] = [
  {
    id: "evt_1",
    name: "Festival de Verão 2026",
    description: "O maior festival de música do verão",
    date: "2026-06-15",
    time: "14:00",
    location: "Parque Ibirapuera, SP",
    price: 15000,
    capacity: 500,
    sold: 450,
    status: "active",
    createdAt: "2026-01-01",
  },
  {
    id: "evt_2",
    name: "Workshop de Marketing",
    description: "Workshop prático de marketing digital",
    date: "2026-06-22",
    time: "09:00",
    location: "Centro de Convenções, RJ",
    price: 5000,
    capacity: 100,
    sold: 85,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "evt_3",
    name: "Show de Rock",
    description: "Show ao vivo com bandas de rock",
    date: "2026-06-30",
    time: "20:00",
    location: "Arena Fonte Nova, BA",
    price: 8000,
    capacity: 800,
    sold: 320,
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "evt_4",
    name: "Palestra Tech",
    description: "Palestra sobre tendências tecnológicas",
    date: "2026-07-05",
    time: "19:00",
    location: "Auditório FIESP, SP",
    price: 3000,
    capacity: 200,
    sold: 120,
    status: "draft",
    createdAt: "2026-02-10",
  },
  {
    id: "evt_5",
    name: "Conferência de Negócios",
    description: "Conferência anual de negócios",
    date: "2026-03-10",
    time: "08:00",
    location: "Hotel Windsor, RJ",
    price: 20000,
    capacity: 300,
    sold: 300,
    status: "finished",
    createdAt: "2025-12-01",
  },
];

function loadEvents(): Event[] {
  if (typeof window === "undefined") return initialEvents;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialEvents;
    }
  }
  return initialEvents;
}

function saveEvents(events: Event[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEvents(loadEvents());
    setIsLoading(false);
  }, []);

  const refetch = useCallback(() => {
    setEvents(loadEvents());
  }, []);

  const createEvent = useCallback((eventData: Omit<Event, "id" | "sold" | "createdAt">) => {
    const newEvent: Event = {
      ...eventData,
      id: "evt_" + Date.now(),
      sold: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newEvent, ...events];
    saveEvents(updated);
    setEvents(updated);
    return newEvent;
  }, [events]);

  const updateEvent = useCallback((id: string, data: Partial<Event>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...data } : e));
    saveEvents(updated);
    setEvents(updated);
  }, [events]);

  const deleteEvent = useCallback((id: string) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
    setEvents(updated);
  }, [events]);

  return { events, isLoading, createEvent, updateEvent, deleteEvent, refetch };
}

export function usePayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialPayments = [
    { id: "PAY-001", buyer: "João Silva", event: "Festival de Verão 2026", amount: "R$ 150,00", method: "Cartão de Crédito", status: "approved", date: "10 Mai 2026, 14:32" },
    { id: "PAY-002", buyer: "Maria Santos", event: "Workshop de Marketing", amount: "R$ 50,00", method: "PIX", status: "approved", date: "12 Mai 2026, 12:15" },
    { id: "PAY-003", buyer: "Pedro Costa", event: "Show de Rock", amount: "R$ 80,00", method: "Boleto", status: "pending", date: "14 Mai 2026, 10:45" },
    { id: "PAY-004", buyer: "Ana Oliveira", event: "Festival de Verão 2026", amount: "R$ 300,00", method: "Cartão de Crédito", status: "approved", date: "15 Mai 2026, 18:20" },
    { id: "PAY-005", buyer: "Carlos Lima", event: "Palestra Tech", amount: "R$ 30,00", method: "PIX", status: "rejected", date: "16 Mai 2026, 09:00" },
  ];

  useEffect(() => {
    setPayments(initialPayments);
    setIsLoading(false);
  }, []);

  return { payments, isLoading };
}

export function useBuyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialBuyers = [
    { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1234", ticketCount: 3, totalSpent: "R$ 450,00", lastPurchase: "10 Mai 2026" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(21) 98888-5678", ticketCount: 2, totalSpent: "R$ 100,00", lastPurchase: "12 Mai 2026" },
    { id: 3, name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 97777-9012", ticketCount: 1, totalSpent: "R$ 40,00", lastPurchase: "14 Mai 2026" },
    { id: 4, name: "Ana Oliveira", email: "ana@email.com", phone: "(31) 96666-3456", ticketCount: 5, totalSpent: "R$ 750,00", lastPurchase: "15 Mai 2026" },
    { id: 5, name: "Carlos Lima", email: "carlos@email.com", phone: "(11) 95555-7890", ticketCount: 1, totalSpent: "R$ 30,00", lastPurchase: "16 Mai 2026" },
  ];

  useEffect(() => {
    setBuyers(initialBuyers);
    setIsLoading(false);
  }, []);

  return { buyers, isLoading };
}

export function useTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialTickets = [
    { id: "TKT-001", buyer: "João Silva", email: "joao@email.com", event: "Festival de Verão 2026", purchaseDate: "10 Mai 2026", status: "valid" },
    { id: "TKT-002", buyer: "Maria Santos", email: "maria@email.com", event: "Workshop de Marketing", purchaseDate: "12 Mai 2026", status: "valid" },
    { id: "TKT-003", buyer: "Pedro Costa", email: "pedro@email.com", event: "Show de Rock", purchaseDate: "14 Mai 2026", status: "used" },
    { id: "TKT-004", buyer: "Ana Oliveira", email: "ana@email.com", event: "Festival de Verão 2026", purchaseDate: "15 Mai 2026", status: "valid" },
    { id: "TKT-005", buyer: "Carlos Lima", email: "carlos@email.com", event: "Palestra Tech", purchaseDate: "16 Mai 2026", status: "cancelled" },
  ];

  useEffect(() => {
    setTickets(initialTickets);
    setIsLoading(false);
  }, []);

  return { tickets, isLoading };
}