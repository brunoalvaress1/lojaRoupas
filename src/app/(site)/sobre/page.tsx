import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, HeartHandshake, Sparkles, MessageCircle } from "lucide-react";
import { getStoreSettings } from "@/lib/queries/settings";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  return {
    title: "Sobre a Loja",
    description: `Conheça a história e os diferenciais da ${storeSettings.name}.`,
  };
}

const DIFERENCIAIS = [
  {
    icon: ShieldCheck,
    title: "Qualidade garantida",
    description: "Peças selecionadas com carinho e critério.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento humanizado",
    description: "Amamos atender você em cada detalhe.",
  },
  {
    icon: Sparkles,
    title: "Moda que inspira",
    description: "Estilo para todos os momentos.",
  },
];

export default async function SobrePage() {
  const storeSettings = await getStoreSettings();

  return (
    <div>
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-black text-white">
        <Image
          src="/foraDaLoja.jpeg"
          alt={`Fachada da loja ${storeSettings.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <div className="relative z-10 px-6 pb-14 sm:px-12">
          <p className="text-xs uppercase tracking-widest-xs text-white/70">
            Sobre a {storeSettings.name}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Mais que moda, uma experiência.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8 sm:py-24">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          A {storeSettings.name} nasceu com o propósito de realçar a beleza e a
          autenticidade de cada mulher através da moda. Selecionamos peças com
          qualidade e atenção aos detalhes para que você viva cada momento com
          confiança e estilo.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 sm:pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {DIFERENCIAIS.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3 text-center">
              <item.icon className="h-7 w-7" strokeWidth={1.3} />
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-6 pb-16 sm:px-8 sm:pb-24 md:grid-cols-4">
        {[
          "/dentroloja1.jpeg",
          "/dentroloja2.jpeg",
          "/dentroloja3.jpeg",
          "/foraDaLoja.jpeg",
        ].map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={src}
              alt={`Ambiente da loja ${storeSettings.name}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>

      <section className="bg-muted/60 px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Localização
            </p>
            <p className="mt-2 text-sm">{storeSettings.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Horário de atendimento
            </p>
            <p className="mt-2 text-sm">{storeSettings.hours}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Redes sociais
            </p>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <a
                href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <InstagramIcon className="h-4 w-4" />
                {storeSettings.instagram}
              </a>
              <a
                href={buildSimpleWhatsAppUrl(storeSettings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
