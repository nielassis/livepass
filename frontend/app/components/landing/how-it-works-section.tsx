const steps = [
  {
    step: "01",
    title: "Crie seu evento",
    description: "Configure todos os detalhes do seu evento: nome, data, local, descrição e lotes de ingressos.",
  },
  {
    step: "02",
    title: "Compartilhe o link",
    description: "Divulgue o link de compra nas redes sociais e canais de comunicação do seu evento.",
  },
  {
    step: "03",
    title: "Receba pagamentos",
    description: "Compradores finalizam a compra com Mercado Pago e recebem o ingresso por e-mail automaticamente.",
  },
  {
    step: "04",
    title: "Valide na entrada",
    description: "Use o app ou dashboard para escanear QR Codes e validar ingressos na entrada do evento.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Em poucos passos você está pronto para vender ingressos.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-background text-xl font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="mt-6 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
