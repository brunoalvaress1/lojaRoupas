import type { Metadata } from "next";
import { FavoritesView } from "@/components/product/FavoritesView";
import { getPublicProducts } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "Favoritos",
};

export default async function FavoritosPage() {
  const products = await getPublicProducts();
  return <FavoritesView products={products} />;
}
