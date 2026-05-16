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
import { Search, Users } from "lucide-react";
import { useBuyers } from "@/app/hooks/use-events";

export default function BuyersPage() {
  const { buyers } = useBuyers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Compradores</h1>
        <p className="mt-1 text-muted-foreground">
          Visualize todos os compradores dos seus eventos
        </p>
      </div>

      <Card className="border-border bg-secondary/30">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Os compradores são registrados automaticamente quando iniciam o
            processo de pagamento no Mercado Pago. Você não pode criar
            compradores manualmente.
          </p>
        </CardContent>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input pl-9"
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Compradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ingressos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Última Compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id} className="border-border">
                    <TableCell className="font-medium">{buyer.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {buyer.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {buyer.phone}
                    </TableCell>
                    <TableCell>{buyer.ticketCount}</TableCell>
                    <TableCell className="font-medium">
                      {buyer.totalSpent}
                    </TableCell>
                    <TableCell>{buyer.lastPurchase}</TableCell>
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