"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Separator } from "@/app/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Clock, Copy, Check, Share2, Ticket, Users, DollarSign } from "lucide-react";
import { useEvents } from "@/app/hooks/use-events";
import { toast } from "sonner";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { events } = useEvents();
  const [copied, setCopied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    document: "",
  });

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Evento não encontrado</p>
        <Button variant="link" onClick={() => router.push("/dashboard/events")}>
          Voltar para eventos
        </Button>
      </div>
    );
  }

  const eventUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.id}`;
  const availableTickets = event.capacity - event.sold;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Comprando ingresso para: ${event.name}`,
          url: eventUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pagamento simulado com sucesso! Ingresso enviado por email.");
    setShowCheckout(false);
    setCheckoutData({ name: "", email: "", document: "" });
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "draft":
        return <Badge variant="secondary">Rascunho</Badge>;
      case "finished":
        return <Badge variant="outline">Finalizado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground">Detalhes do evento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <Button onClick={() => setShowCheckout(!showCheckout)} className="gap-2">
            <Ticket className="h-4 w-4" />
            Comprar
          </Button>
        </div>
      </div>

      {showCheckout && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingresso</span>
                  <span className="font-medium">{event.name}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">{formatPrice(event.price)}</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">Nome completo</Label>
                  <Input
                    id="checkout-name"
                    placeholder="Seu nome"
                    value={checkoutData.name}
                    onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-document">CPF</Label>
                <Input
                  id="checkout-document"
                  placeholder="000.000.000-00"
                  value={checkoutData.document}
                  onChange={(e) => setCheckoutData({ ...checkoutData, document: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowCheckout(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Pagar com Mercado Pago
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Local</p>
                <p className="font-medium">{event.location || "A definir"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Preço</p>
                <p className="font-medium">{event.price === 0 ? "Grátis" : formatPrice(event.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {event.description || "Nenhuma descrição fornecida."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <Ticket className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{event.sold}</p>
              <p className="text-sm text-muted-foreground">Vendidos</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <Users className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{availableTickets}</p>
              <p className="text-sm text-muted-foreground">Disponíveis</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <DollarSign className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{formatPrice(event.sold * event.price)}</p>
              <p className="text-sm text-muted-foreground">Receita</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Link Público</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              readOnly
              value={eventUrl}
              className="bg-muted"
            />
            <Button variant="secondary" onClick={handleCopyLink} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Compartilhe este link para que clientes possam comprar ingressos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}