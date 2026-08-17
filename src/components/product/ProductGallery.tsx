"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted">
        <ImageOff className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((image, i) => (
          <button
            key={image.url + i}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-14 shrink-0 overflow-hidden border sm:h-20 sm:w-16",
              active === i ? "border-foreground" : "border-transparent"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden bg-muted">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="animate-fade-in object-cover"
        />
      </div>
    </div>
  );
}
