"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { useEvents } from "@/app/hooks/use-events";
import { toast } from "sonner";
import { Logo } from "@/app/components/logo";

export default function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { events } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    document: "",
  });

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Evento não encontrado</p>
            <Button variant="link" onClick={() => router.push("/login")}>
              Voltar para login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableTickets = event.capacity - event.sold;
  const isSoldOut = availableTickets <= 0;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Pagamento realizado com sucesso! Você receberá o ingresso por email.");
    setCheckoutData({ name: "", email: "", document: "" });
    setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center border-b border-border px-4">
        <Logo />
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <Badge variant={event.status === "active" ? "default" : "secondary"} className="mb-2">
                {event.status === "active" ? "Evento Confirmado" : "Em breve"}
              </Badge>
              <h1 className="text-3xl font-bold">{event.name}</h1>
            </div>

            <Card className="border-border">
              <CardContent className="space-y-4 pt-6">
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
              </CardContent>
            </Card>

            {event.description && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sobre o evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-8 border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ingressos</span>
                  <Badge variant="outline">{availableTickets} disponíveis</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSoldOut ? (
                  <div className="py-8 text-center">
                    <p className="text-lg font-medium">Esgotado</p>
                    <p className="text-sm text-muted-foreground">
                      Não há mais ingressos disponíveis para este evento.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">1 Ingresso</span>
                        <span className="text-xl font-bold">
                          {event.price === 0 ? "Grátis" : formatPrice(event.price)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={checkoutData.name}
                        onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={checkoutData.email}
                        onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="document">CPF</Label>
                      <Input
                        id="document"
                        placeholder="000.000.000-00"
                        value={checkoutData.document}
                        onChange={(e) => setCheckoutData({ ...checkoutData, document: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        event.price === 0 ? "Reservar Ingresso" : "Comprar Ingresso"
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Pagamento seguro via Mercado Pago
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}