import Link from "next/link";
import { Logo } from "@/app/components/logo";

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#precos" },
    { label: "API", href: "#" },
  ],
  empresa: [
    { label: "Sobre", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
  ],
  legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Plataforma completa para gestão de eventos e venda de ingressos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Produto</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Empresa</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} LivePass. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
