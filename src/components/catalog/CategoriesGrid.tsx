"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Category } from "@/types";

const TALL_SLUGS = ["vestidos", "conjuntos"];

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {categories.map((category, i) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
          className={
            TALL_SLUGS.includes(category.slug)
              ? "col-span-1 row-span-2 aspect-[3/5] sm:aspect-[3/4.6]"
              : "aspect-[4/5]"
          }
        >
          <Link
            href={`/colecao?categoria=${category.slug}`}
            className="group relative block h-full w-full overflow-hidden bg-muted"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover object-top transition-[transform,filter] duration-700 ease-out group-hover:scale-110 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent transition-opacity duration-500 group-hover:from-black/75" />

            <span className="absolute left-4 top-4 font-display text-xs text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              <span className="font-display text-lg text-white sm:text-xl">
                {category.name}
              </span>
              <span className="text-white transition-all duration-300 [@media(hover:hover)]:translate-x-2 [@media(hover:hover)]:opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
