"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, type CategoryFormState } from "@/lib/actions/categories";
import type { Category } from "@/types";

const initialState: CategoryFormState = {};

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(category?.image ?? null);

  return (
    <form action={formAction} className="max-w-xl border border-border bg-background p-6">
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
            Nome
          </span>
          <input
            name="name"
            defaultValue={category?.name}
            required
            className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
            Slug (opcional — gerado a partir do nome)
          </span>
          <input
            name="slug"
            defaultValue={category?.slug}
            placeholder="ex: vestidos"
            className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
            Ordem de exibição
          </span>
          <input
            type="number"
            name="order"
            defaultValue={category?.order ?? 0}
            className="w-32 border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
            Imagem
          </span>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="text-sm"
          />
          {preview && (
            <div className="relative mt-2 h-32 w-32 overflow-hidden rounded bg-muted">
              <Image src={preview} alt="Pré-visualização" fill className="object-cover" />
            </div>
          )}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={category?.active ?? true}
            className="h-4 w-4"
          />
          Categoria ativa (visível na loja)
        </label>

        {state.error && <p className="text-xs text-red-600">{state.error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Salvando..." : category ? "Salvar alterações" : "Criar categoria"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categorias")}
            className="text-xs uppercase tracking-widest-xs text-muted-foreground underline underline-offset-4"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
