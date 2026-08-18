"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useAppData } from "@/context/AppDataContext";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Category } from "@/types";

export function CategoriesSection() {
  const { categories } = useAppData();

  return (
    <section className="bg-muted/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Categorias"
          subtitle="Encontre exatamente o que você procura."
          action={{ label: "Ver todas", href: "/categorias" }}
          className="mb-10"
        />

        <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 no-scrollbar sm:mx-0 sm:gap-4 sm:px-0">
          {categories.map((category, i) => (
            <CategoryTile
              key={category.id}
              category={category}
              index={i + 1}
              className="w-[38vw] shrink-0 snap-start sm:w-[200px] lg:w-[220px]"
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  category,
  index,
  className,
  delay,
}: {
  category: Category;
  index: number;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={`aspect-[3/4] ${className}`}
    >
      <Link
        href={`/colecao?categoria=${category.slug}`}
        className="group relative block h-full w-full overflow-hidden bg-surface"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 40vw, 20vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/75" />

        <span className="absolute left-4 top-4 font-display text-xs text-white/70">
          {String(index).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between overflow-hidden">
          <span className="font-display text-lg text-white sm:text-xl">
            {category.name}
          </span>
          <span className="translate-x-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
