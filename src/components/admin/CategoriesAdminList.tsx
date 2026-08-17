"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoriesAdminList({ categories }: { categories: Category[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir a categoria "${name}"? Produtos ligados a ela ficarão sem categoria.`)) {
      return;
    }
    setPendingId(id);
    startTransition(async () => {
      await deleteCategory(id);
      setPendingId(null);
    });
  }

  return (
    <div className="border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-sm font-medium">{categories.length} categorias</p>
        <Link
          href="/admin/categorias/nova"
          className="flex items-center gap-1.5 bg-accent px-4 py-2 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Nova categoria
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest-xs text-muted-foreground">
              <th className="px-5 py-3 font-normal">Categoria</th>
              <th className="px-5 py-3 font-normal">Slug</th>
              <th className="px-5 py-3 font-normal">Ordem</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    {category.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{category.slug}</td>
                <td className="px-5 py-3 text-muted-foreground">{category.order}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px]",
                      category.active
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {category.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/categorias/${category.id}`}
                      aria-label="Editar"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={isPending && pendingId === category.id}
                      aria-label="Excluir"
                      className={cn(
                        "text-muted-foreground transition-colors hover:text-red-600",
                        isPending && pendingId === category.id && "opacity-50"
                      )}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
