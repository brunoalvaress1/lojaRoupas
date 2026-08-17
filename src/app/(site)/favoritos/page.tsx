import type { Metadata } from "next";
import { FavoritesView } from "@/components/product/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
};

export default function FavoritosPage() {
  return <FavoritesView />;
}
