"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { deleteProduct, toggleProductActive } from "@/lib/actions/products";
import { getProductStock } from "@/lib/product-helpers";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

export function ProductsAdminList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q)
    );
  }, [products, query]);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir o produto "${name}"? Essa ação não pode ser desfeita.`)) return;
    setPendingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setPendingId(null);
    });
  }

  function handleToggleActive(id: string, active: boolean) {
    setPendingId(id);
    startTransition(async () => {
      await toggleProductActive(id, active);
      setPendingId(null);
    });
  }

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou referência"
            className="w-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center justify-center gap-1.5 bg-accent px-4 py-2 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Novo produto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest-xs text-muted-foreground">
              <th className="px-5 py-3 font-normal">Produto</th>
              <th className="px-5 py-3 font-normal">Categoria</th>
              <th className="px-5 py-3 font-normal">Preço</th>
              <th className="px-5 py-3 font-normal">Estoque</th>
              <th className="px-5 py-3 font-normal">Ativo</th>
              <th className="px-5 py-3 font-normal">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const category = categories.find((c) => c.slug === product.categorySlug);
              const inStock = getProductStock(product);
              const busy = isPending && pendingId === product.id;
              return (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-muted">
                        {product.images[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p>{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{category?.name ?? "—"}</td>
                  <td className="px-5 py-3">{formatPrice(product.promoPrice ?? product.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px]",
                        inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {inStock ? "Disponível" : "Esgotado"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleActive(product.id, !product.active)}
                      disabled={busy}
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors",
                        product.active ? "bg-accent" : "bg-muted-foreground/30"
                      )}
                      aria-label={product.active ? "Desativar produto" : "Ativar produto"}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                          product.active ? "translate-x-4" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        aria-label="Editar"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={busy}
                        aria-label="Excluir"
                        className={cn(
                          "text-muted-foreground transition-colors hover:text-red-600",
                          busy && "opacity-50"
                        )}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
