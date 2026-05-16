import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">
              Integrado com Mercado Pago
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Gestão completa de{" "}
            <span className="text-accent">eventos e ingressos</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Plataforma profissional para criar, gerenciar e vender ingressos
            para seus eventos. Pagamentos seguros com Mercado Pago e controle
            total em um só lugar.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/login">
                Começar Gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#como-funciona">Ver Como Funciona</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold sm:text-4xl">10k+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Eventos Criados
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold sm:text-4xl">500k+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingressos Vendidos
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold sm:text-4xl">99.9%</p>
              <p className="mt-1 text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
