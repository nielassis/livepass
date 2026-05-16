"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Badge } from "@/app/components/ui/badge";
import { CalendarDays, MoreHorizontal, Plus, Search } from "lucide-react";
import { useEvents, Event } from "@/app/hooks/use-events";
import { toast } from "sonner";

export default function EventsPage() {
  const { events, createEvent, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
  });

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.name || !newEvent.date || !newEvent.capacity) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    createEvent({
      name: newEvent.name,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time || "20:00",
      location: newEvent.location,
      price: Number(newEvent.price) * 100 || 0,
      capacity: Number(newEvent.capacity),
      status: "draft",
    });

    toast.success("Evento criado com sucesso!");
    setIsCreateDialogOpen(false);
    setNewEvent({
      name: "",
      date: "",
      time: "",
      location: "",
      price: "",
      capacity: "",
      description: "",
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast.success("Evento excluído");
  };

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-accent text-accent-foreground">Ativo</Badge>
        );
      case "draft":
        return <Badge variant="secondary">Rascunho</Badge>;
      case "finished":
        return <Badge variant="outline">Finalizado</Badge>;
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Eventos</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie os eventos da sua organização
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
              <DialogDescription>
                Preencha as informações do seu evento
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-name">Nome do evento *</Label>
                <Input
                  id="event-name"
                  placeholder="Ex: Festival de Música"
                  className="bg-input"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Data *</Label>
                  <Input
                    id="event-date"
                    type="date"
                    className="bg-input"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time">Horário</Label>
                  <Input
                    id="event-time"
                    type="time"
                    className="bg-input"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Local</Label>
                <Input
                  id="event-location"
                  placeholder="Endereço completo"
                  className="bg-input"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-price">Preço</Label>
                  <Input
                    id="event-price"
                    type="number"
                    placeholder="R$ 50,00"
                    className="bg-input"
                    value={newEvent.price}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-capacity">Capacidade *</Label>
                  <Input
                    id="event-capacity"
                    type="number"
                    placeholder="100"
                    className="bg-input"
                    value={newEvent.capacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, capacity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Descrição</Label>
                <Textarea
                  id="event-description"
                  placeholder="Descreva seu evento..."
                  className="min-h-24 bg-input"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Evento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input pl-9"
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Lista de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Evento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Ingressos</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="border-border">
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell className="max-w-40 truncate">
                      {event.location}
                    </TableCell>
                    <TableCell>
                      {event.sold}/{event.capacity}
                    </TableCell>
                    <TableCell>{formatPrice(event.price)}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                              <Link href={`/dashboard/events/${event.id}`}>Ver detalhes</Link>
                            </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Copiar link</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
