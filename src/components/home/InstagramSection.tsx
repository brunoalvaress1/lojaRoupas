"use client";

import Image from "next/image";
import { useAppData } from "@/context/AppDataContext";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import type { Product } from "@/types";

export function InstagramSection({ products }: { products: Product[] }) {
  const { settings } = useAppData();
  const images = products.slice(0, 6).map((p) => p.images[0]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
        <InstagramIcon className="h-5 w-5" />
        <h2 className="font-display text-3xl sm:text-4xl">
          Siga a {settings.name}
        </h2>
        <a
          href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          {settings.instagram}
        </a>
      </Reveal>

      <StaggerGroup className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {images.map((image, i) => (
          <StaggerItem key={i}>
            <a
              href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                <InstagramIcon className="h-5 w-5 text-white" />
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
