"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { CreditCard, Search } from "lucide-react";
import { usePayments } from "@/app/hooks/use-events";

export default function PaymentsPage() {
  const { payments } = usePayments();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(
    (payment) =>
      payment.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.event.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-accent text-accent-foreground">Aprovado</Badge>;
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
            Pendente
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Pagamentos</h1>
        <p className="mt-1 text-muted-foreground">
          Acompanhe todos os pagamentos processados pelo Mercado Pago
        </p>
      </div>

      <Card className="border-border bg-secondary/30">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Os pagamentos são gerenciados automaticamente pelo Mercado Pago
            através de webhooks. Quando um pagamento é aprovado, o ingresso é
            gerado e enviado ao comprador.
          </p>
        </CardContent>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, ID ou evento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input pl-9"
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Lista de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-border">
                    <TableCell className="font-mono text-sm">
                      {payment.id}
                    </TableCell>
                    <TableCell className="font-medium">{payment.buyer}</TableCell>
                    <TableCell>{payment.event}</TableCell>
                    <TableCell className="font-medium">
                      {payment.amount}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.method}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}