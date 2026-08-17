import type { Metadata } from "next";
import { RefreshCw, ClipboardCheck, MessageCircle, PackageCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Conheça nossa política de trocas e devoluções.",
};

const ITEMS = [
  {
    icon: RefreshCw,
    title: "Troca fácil",
    description:
      "Você tem até 7 dias corridos após o recebimento para solicitar a troca.",
  },
  {
    icon: ClipboardCheck,
    title: "Condições",
    description:
      "A peça deve estar sem uso, com etiqueta e na embalagem original.",
  },
  {
    icon: MessageCircle,
    title: "Como funciona",
    description:
      "Entre em contato pelo WhatsApp informando seu pedido e o motivo da troca.",
  },
  {
    icon: PackageCheck,
    title: "Devolução",
    description:
      "Devolução de valor em até 5 dias úteis após o recebimento da peça.",
  },
];

export default function TrocasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Trocas e Devoluções" }]}
      />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl">
        Trocas e Devoluções
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex gap-4">
            <item.icon className="h-6 w-6 shrink-0 text-foreground" strokeWidth={1.3} />
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <a
        href={buildSimpleWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 inline-flex items-center gap-2 bg-accent px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
        Solicitar troca pelo WhatsApp
      </a>
    </div>
  );
}
