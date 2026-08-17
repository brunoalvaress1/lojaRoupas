import Image from "next/image";
import Link from "next/link";
import { storeSettings } from "@/data/store-settings";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export function StoreExperienceSection() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 md:grid-cols-2 md:gap-16">
      <Reveal direction="left" className="relative aspect-[4/5] w-full overflow-hidden">
        <Parallax strength={40} className="absolute inset-0 -top-[10%] h-[120%] w-full">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80&auto=format&fit=crop"
            alt={`Interior da loja ${storeSettings.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </Parallax>
      </Reveal>

      <Reveal direction="right" delay={0.1} className="max-w-md">
        <p className="mb-3 text-xs uppercase tracking-widest-xs text-muted-foreground">
          Nossa essência
        </p>
        <h2 className="font-display text-3xl sm:text-4xl">
          Mais que moda, uma experiência.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          A {storeSettings.name} nasceu com o propósito de realçar a beleza e a
          autenticidade de cada mulher através da moda. Selecionamos peças com
          qualidade e atenção aos detalhes para que você viva cada momento com
          confiança e estilo.
        </p>
        <Link
          href="/sobre"
          className="mt-8 inline-flex items-center border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-widest-xs transition-colors hover:bg-foreground hover:text-background"
        >
          Conheça nossa loja
        </Link>
      </Reveal>
    </section>
  );
}
