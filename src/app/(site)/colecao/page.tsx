import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getPublicProducts } from "@/lib/queries/products";
import { getPublicCategories } from "@/lib/queries/categories";

export const metadata: Metadata = {
  title: "Coleção",
  description: "Explore toda a coleção de peças disponíveis.",
};

export default async function ColecaoPage() {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);

  return (
    <Suspense>
      <CatalogView products={products} categories={categories} />
    </Suspense>
  );
}
