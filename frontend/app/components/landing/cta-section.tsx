import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-accent/10 px-6 py-16 sm:px-12 sm:py-20">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Crie sua conta gratuitamente e comece a vender ingressos em
              minutos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/login">
                  Criar Conta Grátis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
