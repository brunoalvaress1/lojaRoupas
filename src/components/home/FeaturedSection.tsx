import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Price } from "@/components/shared/Price";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/types";

export function FeaturedSection({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.isFeatured && p.active).slice(0, 3);

  if (featured.length === 0) return null;

  const [spotlight, ...rest] = featured;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Selecionados a dedo"
        title="Destaques"
        subtitle="As peças favoritas da nossa equipe nesta temporada."
        action={{ label: "Ver coleção", href: "/colecao" }}
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr] sm:gap-6">
        <SpotlightCard product={spotlight} />

        {rest.length > 0 && (
          <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-6">
            {rest.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}

function SpotlightCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Reveal
      direction="left"
      className="group relative h-[420px] overflow-hidden bg-muted sm:h-full"
    >
      <Link href={`/produto/${product.slug}`} className="block h-full w-full">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <span className="absolute left-5 top-5 text-xs uppercase tracking-widest-xs text-white/70">
          Destaque da semana
        </span>

        <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
          <h3 className="font-display text-2xl text-white sm:text-3xl">
            {product.name}
          </h3>
          <Price
            price={product.price}
            promoPrice={product.promoPrice}
            size="lg"
            className="mt-2 text-white [&_span:last-child]:text-white/60"
          />
        </div>
      </Link>
    </Reveal>
  );
}
