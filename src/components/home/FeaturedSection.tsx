import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export function FeaturedSection() {
  const featured = products.filter((p) => p.isFeatured && p.active).slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Selecionados a dedo"
        title="Destaques"
        subtitle="As peças favoritas da nossa equipe nesta temporada."
        action={{ label: "Ver coleção", href: "/colecao" }}
        className="mb-10"
      />
      <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
