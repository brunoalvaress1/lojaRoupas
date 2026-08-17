"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { categories } from "@/data/categories";

const TALL_SLUGS = ["vestidos", "conjuntos"];

export function CategoriesGrid() {
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
              : "aspect-[3/4]"
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
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent transition-opacity duration-500 group-hover:from-black/75" />

            <span className="absolute left-4 top-4 font-display text-xs text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              <span className="font-display text-lg text-white sm:text-xl">
                {category.name}
              </span>
              <span className="translate-x-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
