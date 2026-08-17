import type { Metadata } from "next";
import { FavoritesView } from "@/components/product/FavoritesView";
import { getProducts } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "Favoritos",
};

export default async function FavoritosPage() {
  const products = await getProducts();
  return <FavoritesView products={products} />;
}
