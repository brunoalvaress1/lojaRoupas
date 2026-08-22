"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Category } from "@/types";

/**
 * Scopes the shared background/foreground/border tokens to black-on-white
 * for this section, so it flows out of the black hero instead of flashing
 * to the page's default light background.
 */
const DARK_SCOPE_STYLE = {
  "--background": "#000000",
  "--foreground": "#ffffff",
  "--muted-foreground": "rgba(255,255,255,0.55)",
  "--border": "rgba(255,255,255,0.12)",
} as React.CSSProperties;

/** True on devices with a real pointer (mouse); false on touch-only devices. */
function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(hover: hover)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const handler = (e: MediaQueryListEvent) => setHoverCapable(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return hoverCapable;
}

export function CategoriesSection() {
  const { categories } = useAppData();

  return (
    <section style={DARK_SCOPE_STYLE} className="bg-background py-16 text-foreground sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Categorias"
          subtitle="Encontre exatamente o que você procura."
          action={{ label: "Ver todas", href: "/categorias" }}
          className="mb-8 sm:mb-10"
        />
      </div>

      <div className="border-y border-border">
        {categories.map((category, i) => (
          <CategoryRow key={category.id} category={category} index={i + 1} delay={i * 0.05} />
        ))}
      </div>
    </section>
  );
}

function CategoryRow({
  category,
  index,
  delay,
}: {
  category: Category;
  index: number;
  delay: number;
}) {
  const hoverCapable = useHoverCapable();
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={() => {
        if (!hoverCapable) setRevealed(true);
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className="border-b border-border last:border-b-0"
    >
      <Link
        href={`/colecao?categoria=${category.slug}`}
        data-revealed={revealed ? "" : undefined}
        className="group relative flex items-center justify-between overflow-hidden px-6 py-6 sm:px-8 sm:py-9"
      >
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="100vw"
            className="object-cover opacity-15 transition-[opacity,transform,filter] duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 group-data-[revealed]:opacity-100 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40 transition-opacity duration-500 group-hover:opacity-0 group-data-[revealed]:opacity-0 sm:via-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-data-[revealed]:opacity-100" />

        <span className="relative z-10 flex items-baseline gap-4">
          <span className="font-display text-xs text-muted-foreground/70 transition-colors duration-500 group-hover:text-white/60 group-data-[revealed]:text-white/60">
            {String(index).padStart(2, "0")}
          </span>
          <span className="font-display text-3xl transition-colors duration-500 group-hover:text-white group-data-[revealed]:text-white sm:text-5xl">
            {category.name}
          </span>
        </span>
        <span className="relative z-10 translate-x-2 text-xl text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white group-data-[revealed]:translate-x-0 group-data-[revealed]:opacity-100 group-data-[revealed]:text-white">
          →
        </span>
      </Link>
    </motion.div>
  );
}
