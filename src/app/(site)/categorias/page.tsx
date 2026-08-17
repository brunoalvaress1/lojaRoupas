import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CategoriesGrid } from "@/components/catalog/CategoriesGrid";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Navegue pelas categorias da coleção.",
};

export default function CategoriasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Categorias" }]} />
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">Categorias</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        {categories.length} coleções organizadas para você encontrar sua próxima peça favorita.
      </p>

      <CategoriesGrid />
    </div>
  );
}
