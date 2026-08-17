import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Coleção",
  description: "Explore toda a coleção de peças disponíveis.",
};

export default function ColecaoPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
