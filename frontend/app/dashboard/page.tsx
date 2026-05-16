import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Eventos Ativos",
    value: "12",
    change: "+2 este mês",
    icon: CalendarDays,
  },
  {
    title: "Ingressos Vendidos",
    value: "1.234",
    change: "+18% vs último mês",
    icon: Ticket,
  },
  {
    title: "Receita Total",
    value: "R$ 45.890",
    change: "+12% vs último mês",
    icon: DollarSign,
  },
  {
    title: "Compradores",
    value: "892",
    change: "+156 este mês",
    icon: Users,
  },
];

const recentEvents = [
  {
    id: 1,
    name: "Festival de Verão 2026",
    date: "15 Jun 2026",
    sold: 450,
    total: 500,
    revenue: "R$ 22.500",
  },
  {
    id: 2,
    name: "Workshop de Marketing",
    date: "22 Jun 2026",
    sold: 85,
    total: 100,
    revenue: "R$ 4.250",
  },
  {
    id: 3,
    name: "Show de Rock",
    date: "30 Jun 2026",
    sold: 320,
    total: 800,
    revenue: "R$ 12.800",
  },
  {
    id: 4,
    name: "Palestra Tech",
    date: "05 Jul 2026",
    sold: 120,
    total: 200,
    revenue: "R$ 3.600",
  },
];

const recentPayments = [
  {
    id: 1,
    buyer: "João Silva",
    event: "Festival de Verão 2026",
    amount: "R$ 150,00",
    status: "paid",
    date: "Hoje, 14:32",
  },
  {
    id: 2,
    buyer: "Maria Santos",
    event: "Workshop de Marketing",
    amount: "R$ 50,00",
    status: "paid",
    date: "Hoje, 12:15",
  },
  {
    id: 3,
    buyer: "Pedro Costa",
    event: "Show de Rock",
    amount: "R$ 80,00",
    status: "pending",
    date: "Hoje, 10:45",
  },
  {
    id: 4,
    buyer: "Ana Oliveira",
    event: "Festival de Verão 2026",
    amount: "R$ 300,00",
    status: "paid",
    date: "Ontem, 18:20",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral da sua organização
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Events & Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{event.revenue}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.sold}/{event.total} vendidos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pagamentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{payment.buyer}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.event}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{payment.amount}</p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-accent/20 text-accent"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {payment.status === "paid" ? "Pago" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
