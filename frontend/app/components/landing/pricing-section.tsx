import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Para pequenos eventos e produtores iniciantes.",
    price: "Grátis",
    priceDetail: "até 100 ingressos/mês",
    features: [
      "Até 3 eventos ativos",
      "100 ingressos/mês",
      "Checkout Mercado Pago",
      "Suporte por e-mail",
    ],
    cta: "Começar Grátis",
    featured: false,
  },
  {
    name: "Pro",
    description: "Para produtores que precisam de mais recursos.",
    price: "R$ 99",
    priceDetail: "/mês",
    features: [
      "Eventos ilimitados",
      "5.000 ingressos/mês",
      "Checkout Mercado Pago",
      "Relatórios avançados",
      "Gestão de equipe",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    description: "Para grandes produtoras e festivais.",
    price: "Sob consulta",
    priceDetail: "",
    features: [
      "Volume ilimitado",
      "API personalizada",
      "White-label disponível",
      "Gerente de conta dedicado",
      "SLA garantido",
      "Integrações customizadas",
    ],
    cta: "Falar com Vendas",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section
      id="precos"
      className="border-t border-border bg-secondary/30 py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Planos para todos os tamanhos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Escolha o plano ideal para o seu negócio. Sem taxas escondidas.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.featured
                  ? "border-accent bg-card shadow-lg shadow-accent/10"
                  : "border-border bg-card/50"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Mais Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="ml-1 text-muted-foreground">
                      {plan.priceDetail}
                    </span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  variant={plan.featured ? "default" : "secondary"}
                  asChild
                >
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
