import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ViewAllCard } from "@/components/shared/ViewAllCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import type { Product } from "@/types";

export function NoveltiesSection({ products }: { products: Product[] }) {
  const novelties = products.filter((p) => p.isNew && p.active).slice(0, 6);

  if (novelties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl py-16 sm:py-24">
      <SectionHeading
        eyebrow="Recém-chegados"
        title="Novidades"
        subtitle="Peças selecionadas que acabaram de chegar na loja. Deslize para ver mais."
        action={{ label: "Ver tudo", href: "/colecao?novidades=1" }}
        className="mb-10 px-6 sm:px-8"
      />
      <StaggerGroup className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:gap-6 sm:px-8">
        {novelties.map((product, i) => (
          <StaggerItem
            key={product.id}
            className="w-[58vw] shrink-0 snap-start sm:w-[260px]"
          >
            <ProductCard product={product} priority={i < 2} />
          </StaggerItem>
        ))}
        <StaggerItem className="w-[58vw] shrink-0 snap-start sm:w-[260px]">
          <ViewAllCard href="/colecao?novidades=1" label="Ver tudo" />
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
