import type { Metadata } from "next";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import { storeSettings } from "@/data/store-settings";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${storeSettings.name} pelo WhatsApp ou visite nossa loja.`,
};

export default function ContatoPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    storeSettings.address
  )}&output=embed`;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Contato" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl">Fale conosco</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <a
            href={buildSimpleWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-border p-5 transition-colors hover:border-foreground"
          >
            <MessageCircle className="h-6 w-6" strokeWidth={1.3} />
            <div>
              <p className="text-sm font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                Fale diretamente com nossa equipe
              </p>
            </div>
          </a>

          <a
            href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-border p-5 transition-colors hover:border-foreground"
          >
            <InstagramIcon className="h-6 w-6" />
            <div>
              <p className="text-sm font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">{storeSettings.instagram}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 border border-border p-5">
            <MapPin className="h-6 w-6" strokeWidth={1.3} />
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">{storeSettings.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-border p-5">
            <Clock className="h-6 w-6" strokeWidth={1.3} />
            <div>
              <p className="text-sm font-medium">Horário</p>
              <p className="text-sm text-muted-foreground">{storeSettings.hours}</p>
            </div>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden border border-border">
          <iframe
            title="Localização da loja"
            src={mapSrc}
            className="h-full w-full"
            style={{ border: 0, minHeight: 320 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
