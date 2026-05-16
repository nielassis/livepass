import { Card, CardContent } from "@/app/components/ui/card";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  QrCode,
  Shield,
  Users,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Gestão de Eventos",
    description:
      "Crie e gerencie eventos com facilidade. Configure datas, locais, lotes e muito mais.",
  },
  {
    icon: CreditCard,
    title: "Mercado Pago",
    description:
      "Pagamentos seguros e instantâneos com Checkout Bricks do Mercado Pago.",
  },
  {
    icon: QrCode,
    title: "Ingressos Digitais",
    description:
      "Ingressos com QR Code único para validação rápida na entrada do evento.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Completo",
    description:
      "Acompanhe vendas, receita e métricas em tempo real com relatórios detalhados.",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Convide colaboradores com diferentes níveis de permissão para sua organização.",
  },
  {
    icon: Shield,
    title: "Segurança",
    description:
      "Dados criptografados e conformidade com as melhores práticas de segurança.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="border-t border-border bg-secondary/30 py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Tudo que você precisa para seus eventos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uma plataforma completa com recursos profissionais para qualquer
            tipo de evento.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-card/50 transition-colors hover:bg-card"
            >
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
