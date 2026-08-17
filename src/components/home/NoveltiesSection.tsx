import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import type { Product } from "@/types";

export function NoveltiesSection({ products }: { products: Product[] }) {
  const novelties = products.filter((p) => p.isNew && p.active).slice(0, 8);

  if (novelties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Recém-chegados"
        title="Novidades"
        subtitle="Peças selecionadas que acabaram de chegar na loja."
        action={{ label: "Ver tudo", href: "/colecao?novidades=1" }}
        className="mb-10"
      />
      <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {novelties.map((product, i) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} priority={i < 2} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
