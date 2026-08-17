"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import type { Category, Product } from "@/types";
import {
  FiltersPanel,
  DEFAULT_FILTERS,
  type CatalogFilters,
} from "./FiltersPanel";

const SORT_OPTIONS = [
  { id: "relevantes", label: "Mais relevantes" },
  { id: "recentes", label: "Mais recentes" },
  { id: "menor-preco", label: "Menor preço" },
  { id: "maior-preco", label: "Maior preço" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

export function CatalogView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") ?? "todas";
  const busca = searchParams.get("busca")?.toLowerCase() ?? "";
  const novidades = searchParams.get("novidades") === "1";

  const [filters, setFilters] = useState<CatalogFilters>({
    ...DEFAULT_FILTERS,
    categoria: categoriaInicial,
  });
  const [sort, setSort] = useState<SortId>("relevantes");
  const [mobilePanel, setMobilePanel] = useState<"filtros" | "ordenar" | null>(
    null
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.active);

    if (novidades) list = list.filter((p) => p.isNew);
    if (filters.categoria !== "todas") {
      list = list.filter((p) => p.categorySlug === filters.categoria);
    }
    if (filters.tamanhos.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) => {
          if (!v.available) return false;
          const label = p.sizes.find((s) => s.id === v.sizeId)?.label;
          return label ? filters.tamanhos.includes(label) : false;
        })
      );
    }
    if (filters.cores.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => filters.cores.includes(c.name))
      );
    }
    list = list.filter(
      (p) => (p.promoPrice ?? p.price) <= filters.precoMax
    );
    if (busca) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(busca) ||
          p.reference.toLowerCase().includes(busca)
      );
    }

    const sorted = [...list];
    switch (sort) {
      case "recentes":
        sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "menor-preco":
        sorted.sort(
          (a, b) => (a.promoPrice ?? a.price) - (b.promoPrice ?? b.price)
        );
        break;
      case "maior-preco":
        sorted.sort(
          (a, b) => (b.promoPrice ?? b.price) - (a.promoPrice ?? a.price)
        );
        break;
      default:
        sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return sorted;
  }, [filters, sort, busca, novidades, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-3xl sm:text-4xl">
          {novidades ? "Novidades" : "Coleção"}
        </h1>
        <span className="text-xs text-muted-foreground">
          {filtered.length} produto{filtered.length !== 1 && "s"}
        </span>
      </div>

      {/* mobile controls */}
      <div className="mb-6 flex gap-3 border-y border-border py-3 md:hidden">
        <button
          onClick={() => setMobilePanel("filtros")}
          className="flex flex-1 items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          Filtros
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => setMobilePanel("ordenar")}
          className="flex-1 text-center text-xs font-medium uppercase tracking-widest-xs"
        >
          Ordenar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            categories={categories}
            products={products}
          />
        </aside>

        <div>
          <div className="mb-6 hidden justify-end md:flex">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="appearance-none border border-border bg-background py-2 pl-3 pr-8 text-xs uppercase tracking-widest-xs outline-none transition-colors hover:border-foreground"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          ) : (
            <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      {mobilePanel && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobilePanel(null)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-widest-xs">
                {mobilePanel === "filtros" ? "Filtros" : "Ordenar por"}
              </p>
              <button onClick={() => setMobilePanel(null)} aria-label="Fechar">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {mobilePanel === "filtros" ? (
              <FiltersPanel
            filters={filters}
            onChange={setFilters}
            categories={categories}
            products={products}
          />
            ) : (
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSort(o.id);
                      setMobilePanel(null);
                    }}
                    className={`py-3 text-left text-sm ${
                      sort === o.id ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {mobilePanel === "filtros" && (
              <button
                onClick={() => setMobilePanel(null)}
                className="mt-8 w-full bg-accent py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
              >
                Ver {filtered.length} resultados
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
