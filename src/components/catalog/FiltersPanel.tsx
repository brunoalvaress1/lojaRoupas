"use client";

import { categories } from "@/data/categories";
import { SIZES, getAllColors } from "@/data/products";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export interface CatalogFilters {
  categoria: string;
  tamanhos: string[];
  cores: string[];
  precoMax: number;
}

const PRICE_CEIL = 320;

export function FiltersPanel({
  filters,
  onChange,
}: {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}) {
  const colors = getAllColors();

  function toggleSize(sizeId: string) {
    const has = filters.tamanhos.includes(sizeId);
    onChange({
      ...filters,
      tamanhos: has
        ? filters.tamanhos.filter((s) => s !== sizeId)
        : [...filters.tamanhos, sizeId],
    });
  }

  function toggleColor(colorId: string) {
    const has = filters.cores.includes(colorId);
    onChange({
      ...filters,
      cores: has
        ? filters.cores.filter((c) => c !== colorId)
        : [...filters.cores, colorId],
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
          Categoria
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onChange({ ...filters, categoria: "todas" })}
            className={cn(
              "text-left text-sm",
              filters.categoria === "todas"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ ...filters, categoria: c.slug })}
              className={cn(
                "text-left text-sm",
                filters.categoria === c.slug
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
          Tamanho
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => toggleSize(size.id)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center border px-2 text-xs",
                filters.tamanhos.includes(size.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
          Cor
        </p>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => toggleColor(color.id)}
              aria-label={color.name}
              title={color.name}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform",
                filters.cores.includes(color.id)
                  ? "scale-110 border-foreground"
                  : "border-transparent"
              )}
              style={{ backgroundColor: color.hex, boxShadow: "0 0 0 1px var(--border) inset" }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
          <span>Preço</span>
          <span>R$0 - {formatPrice(filters.precoMax)}</span>
        </p>
        <input
          type="range"
          min={50}
          max={PRICE_CEIL}
          step={10}
          value={filters.precoMax}
          onChange={(e) =>
            onChange({ ...filters, precoMax: Number(e.target.value) })
          }
          className="w-full accent-foreground"
        />
      </div>

      <button
        onClick={() =>
          onChange({
            categoria: "todas",
            tamanhos: [],
            cores: [],
            precoMax: PRICE_CEIL,
          })
        }
        className="text-left text-xs uppercase tracking-widest-xs text-muted-foreground underline underline-offset-4"
      >
        Limpar filtros
      </button>
    </div>
  );
}

export const DEFAULT_FILTERS: CatalogFilters = {
  categoria: "todas",
  tamanhos: [],
  cores: [],
  precoMax: PRICE_CEIL,
};
