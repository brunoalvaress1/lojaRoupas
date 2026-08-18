import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, ShieldCheck, HeartHandshake, Sparkles, MessageCircle, Quote } from "lucide-react";
import { getStoreSettings } from "@/lib/queries/settings";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WhatsAppCTASection } from "@/components/home/WhatsAppCTASection";
import { SectionFade } from "@/components/shared/SectionFade";

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
    description: "Peças selecionadas com carinho e critério em cada detalhe.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento humanizado",
    description: "Amamos atender você de perto, do provador ao WhatsApp.",
  },
  {
    icon: Sparkles,
    title: "Moda que inspira",
    description: "Curadoria pensada para todos os momentos da sua rotina.",
  },
];

const GALLERY = [
  { src: "/dentroloja1.jpeg", offset: false, zoom: false },
  { src: "/dentroloja3.jpeg", offset: true, zoom: true },
];

function BrandBadge() {
  return (
    <div className="animate-float relative hidden h-24 w-24 text-white/90 sm:block">
      <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="badge-circle-path" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="7.6" letterSpacing="3" fill="currentColor">
          <textPath href="#badge-circle-path" className="uppercase">
            Moda autoral • São Carlos •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg">FF</span>
      </div>
    </div>
  );
}

export default async function SobrePage() {
  const storeSettings = await getStoreSettings();

  return (
    <div>
      <section className="relative flex h-[62vh] min-h-[460px] items-end overflow-hidden bg-black text-white">
        <Parallax strength={50} className="absolute inset-0 h-[120%] w-full">
          <Image
            src="/foraDaLoja.jpeg"
            alt={`Fachada da loja ${storeSettings.name}`}
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover"
            style={{ objectPosition: "50% 32%" }}
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50" />

        <div className="absolute right-6 top-8 z-10 sm:right-12 sm:top-12">
          <BrandBadge />
        </div>

        <Reveal className="relative z-10 px-6 pb-14 sm:px-12 sm:pb-20">
          <p className="text-xs uppercase tracking-widest-xs text-white/70">
            Sobre a {storeSettings.name}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">
            Mais que moda, uma experiência.
          </h1>
        </Reveal>
      </section>
      <SectionFade />

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 md:grid-cols-2 md:gap-16">
        <Reveal direction="left" className="relative aspect-square w-full overflow-hidden">
          <Parallax strength={40} className="absolute inset-0 -top-[10%] h-[130%] w-full">
            <Image
              src="/dentroloja2.jpeg"
              alt={`Interior da loja ${storeSettings.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="scale-110 object-cover object-top"
            />
          </Parallax>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="max-w-md">
          <Quote className="mb-4 h-8 w-8 text-foreground/20" strokeWidth={1.2} />
          <p className="mb-3 text-xs uppercase tracking-widest-xs text-muted-foreground">
            Nossa história
          </p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Vista sua essência, do jeito que só a {storeSettings.name} entrega.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A {storeSettings.name} nasceu com o propósito de realçar a beleza e a
            autenticidade de cada mulher através da moda. Selecionamos peças com
            qualidade e atenção aos detalhes para que você viva cada momento com
            confiança e estilo — sempre com um atendimento próximo, pensado para
            você.
          </p>
        </Reveal>
      </section>

      <SectionFade variant="toDark" />
      <section className="relative overflow-hidden bg-accent py-20 text-center text-accent-foreground sm:py-28">
        <div className="animate-float absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent-foreground/5 blur-2xl" />
        <div
          className="animate-float absolute -right-6 top-1/3 h-28 w-28 rounded-full bg-accent-foreground/5 blur-2xl"
          style={{ animationDelay: "1.5s" }}
        />
        <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
          <Quote className="mx-auto mb-6 h-8 w-8 text-accent-foreground/40" strokeWidth={1.2} />
          <p className="font-display text-2xl italic leading-relaxed sm:text-3xl">
            Cada peça é escolhida a dedo, pensando em quem vai vestir — porque
            moda de verdade é aquela que te faz sentir em casa.
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest-xs text-accent-foreground/60">
            Equipe {storeSettings.name}
          </p>
        </Reveal>
      </section>
      <SectionFade />

      <section className="border-y border-border bg-muted/60 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <SectionHeading
            eyebrow="Por que a gente"
            title="Nossos diferenciais"
            align="center"
            className="mb-14"
          />
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {DIFERENCIAIS.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.1}
                className="flex flex-col items-center gap-3 px-6 py-10 text-center first:pt-0 sm:py-0"
              >
                <item.icon className="h-7 w-7" strokeWidth={1.2} />
                <p className="font-display text-lg">{item.title}</p>
                <p className="max-w-[220px] text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Nosso espaço"
          title="Um ambiente pensado para você"
          subtitle="Conheça um pouco do dia a dia da nossa loja física em São Carlos."
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {GALLERY.map((item, i) => (
            <Reveal
              key={item.src}
              delay={i * 0.1}
              className={`group relative h-[320px] overflow-hidden bg-muted sm:h-[420px] ${
                item.offset ? "sm:mt-12" : ""
              }`}
            >
              <Image
                src={item.src}
                alt={`Ambiente da loja ${storeSettings.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`origin-top object-cover object-top transition-transform duration-700 ease-out ${
                  item.zoom
                    ? "scale-150 group-hover:scale-[1.6]"
                    : "group-hover:scale-110"
                }`}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 sm:pb-24">
        <Reveal className="grid grid-cols-1 gap-10 border border-border p-8 sm:grid-cols-3 sm:p-14">
          <div className="flex flex-col items-start gap-3">
            <MapPin className="h-5 w-5" strokeWidth={1.3} />
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Localização
            </p>
            <p className="text-sm leading-relaxed">{storeSettings.address}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Clock className="h-5 w-5" strokeWidth={1.3} />
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Horário de atendimento
            </p>
            <p className="text-sm leading-relaxed">{storeSettings.hours}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <InstagramIcon className="h-5 w-5" />
            <p className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Redes sociais
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <InstagramIcon className="h-4 w-4" />
                {storeSettings.instagram}
              </a>
              <a
                href={buildSimpleWhatsAppUrl(storeSettings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <SectionFade variant="toDark" />
      <WhatsAppCTASection />
      <SectionFade />
    </div>
  );
}
