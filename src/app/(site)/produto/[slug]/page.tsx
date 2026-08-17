import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0].url],
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.reference,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.promoPrice ?? product.price,
      availability: product.variants.some((v) => v.available)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          ...(category
            ? [
                {
                  label: category.name,
                  href: `/colecao?categoria=${category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />
      <div className="mt-6">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
