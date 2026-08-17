"use client";

import { useActionState, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createProduct, updateProduct, type ProductFormState } from "@/lib/actions/products";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

const initialState: ProductFormState = {};

interface ColorRow {
  tempId: string;
  name: string;
  hex: string;
}
interface SizeRow {
  tempId: string;
  label: string;
}
interface VariantCell {
  colorTempId: string;
  sizeTempId: string;
  available: boolean;
  stock: number;
}
interface ExistingImage {
  url: string;
  alt: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [colors, setColors] = useState<ColorRow[]>(
    product?.colors.map((c) => ({ tempId: c.id, name: c.name, hex: c.hex })) ?? []
  );
  const [sizes, setSizes] = useState<SizeRow[]>(
    product?.sizes.map((s) => ({ tempId: s.id, label: s.label })) ?? []
  );
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    product?.images.filter((i) => i.url).map((i) => ({ url: i.url, alt: i.alt })) ?? []
  );
  const [newImages, setNewImages] = useState<{ id: string; file: File; preview: string }[]>([]);

  // Explicit edits to available/stock, keyed by "colorTempId:sizeTempId".
  // Combos without an entry here fall back to the defaults below — this
  // keeps the grid in sync with colors/sizes without an effect.
  const [variantOverrides, setVariantOverrides] = useState<Map<string, { available: boolean; stock: number }>>(
    () =>
      new Map(
        (product?.variants ?? []).map((v) => [
          `${v.colorId}:${v.sizeId}`,
          { available: v.available, stock: v.stock },
        ])
      )
  );

  const variants = useMemo<VariantCell[]>(() => {
    const cells: VariantCell[] = [];
    for (const color of colors) {
      for (const size of sizes) {
        const key = `${color.tempId}:${size.tempId}`;
        const override = variantOverrides.get(key);
        cells.push({
          colorTempId: color.tempId,
          sizeTempId: size.tempId,
          available: override?.available ?? true,
          stock: override?.stock ?? 10,
        });
      }
    }
    return cells;
  }, [colors, sizes, variantOverrides]);

  function updateVariant(colorTempId: string, sizeTempId: string, patch: Partial<{ available: boolean; stock: number }>) {
    const key = `${colorTempId}:${sizeTempId}`;
    setVariantOverrides((prev) => {
      const next = new Map(prev);
      const current = next.get(key) ?? { available: true, stock: 10 };
      next.set(key, { ...current, ...patch });
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("colorsJson", JSON.stringify(colors));
    fd.set("sizesJson", JSON.stringify(sizes));
    fd.set("variantsJson", JSON.stringify(variants));
    fd.set("existingImagesJson", JSON.stringify(existingImages));
    newImages.forEach(({ file }) => fd.append("newImages", file));
    startTransition(() => formAction(fd));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex max-w-3xl flex-col gap-8"
    >
      {/* basic info */}
      <section className="border border-border bg-background p-6">
        <p className="mb-5 text-sm font-medium">Informações básicas</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome" name="name" defaultValue={product?.name} required />
          <Field label="Referência" name="reference" defaultValue={product?.reference} required />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Categoria
            </span>
            <select
              name="categoryId"
              defaultValue={categories.find((c) => c.slug === product?.categorySlug)?.id ?? ""}
              className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Preço"
              name="price"
              type="number"
              step="0.01"
              defaultValue={product?.price}
              required
            />
            <Field
              label="Preço promocional"
              name="promoPrice"
              type="number"
              step="0.01"
              defaultValue={product?.promoPrice}
            />
          </div>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Descrição
            </span>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description}
              className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Composição
            </span>
            <input
              name="composition"
              defaultValue={product?.composition}
              className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <Checkbox label="Novidade" name="isNew" defaultChecked={product?.isNew} />
          <Checkbox label="Destaque" name="isFeatured" defaultChecked={product?.isFeatured} />
          <Checkbox
            label="Produto ativo"
            name="active"
            defaultChecked={product?.active ?? true}
          />
        </div>
      </section>

      {/* images */}
      <section className="border border-border bg-background p-6">
        <p className="mb-5 text-sm font-medium">Imagens</p>
        <div className="flex flex-wrap gap-3">
          {existingImages.map((img) => (
            <div key={img.url} className="relative h-24 w-20 overflow-hidden bg-muted">
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
              <button
                type="button"
                onClick={() =>
                  setExistingImages((prev) => prev.filter((i) => i.url !== img.url))
                }
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {newImages.map((img) => (
            <div key={img.id} className="relative h-24 w-20 overflow-hidden bg-muted">
              <Image src={img.preview} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setNewImages((prev) => prev.filter((i) => i.id !== img.id))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground hover:border-foreground">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px]">Adicionar</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setNewImages((prev) => [
                  ...prev,
                  ...files.map((file) => ({
                    id: uid(),
                    file,
                    preview: URL.createObjectURL(file),
                  })),
                ]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A primeira imagem é usada como capa do produto.
        </p>
      </section>

      {/* colors */}
      <section className="border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium">Cores</p>
          <button
            type="button"
            onClick={() => setColors((prev) => [...prev, { tempId: uid(), name: "", hex: "#000000" }])}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Adicionar cor
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {colors.map((color) => (
            <div key={color.tempId} className="flex items-center gap-3">
              <input
                type="color"
                value={color.hex}
                onChange={(e) =>
                  setColors((prev) =>
                    prev.map((c) => (c.tempId === color.tempId ? { ...c, hex: e.target.value } : c))
                  )
                }
                className="h-9 w-9 shrink-0 cursor-pointer border border-border"
              />
              <input
                value={color.name}
                onChange={(e) =>
                  setColors((prev) =>
                    prev.map((c) => (c.tempId === color.tempId ? { ...c, name: e.target.value } : c))
                  )
                }
                placeholder="Nome da cor (ex: Preto)"
                className="flex-1 border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-foreground"
              />
              <button
                type="button"
                onClick={() => setColors((prev) => prev.filter((c) => c.tempId !== color.tempId))}
                aria-label="Remover cor"
                className="text-muted-foreground hover:text-red-600"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
          {colors.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma cor cadastrada.</p>
          )}
        </div>
      </section>

      {/* sizes */}
      <section className="border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium">Tamanhos</p>
          <button
            type="button"
            onClick={() => setSizes((prev) => [...prev, { tempId: uid(), label: "" }])}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Adicionar tamanho
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <div key={size.tempId} className="flex items-center gap-1.5">
              <input
                value={size.label}
                onChange={(e) =>
                  setSizes((prev) =>
                    prev.map((s) => (s.tempId === size.tempId ? { ...s, label: e.target.value } : s))
                  )
                }
                placeholder="P"
                className="w-20 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
              <button
                type="button"
                onClick={() => setSizes((prev) => prev.filter((s) => s.tempId !== size.tempId))}
                aria-label="Remover tamanho"
                className="text-muted-foreground hover:text-red-600"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
          {sizes.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum tamanho cadastrado.</p>
          )}
        </div>
      </section>

      {/* variants */}
      {colors.length > 0 && sizes.length > 0 && (
        <section className="border border-border bg-background p-6">
          <p className="mb-1 text-sm font-medium">Disponibilidade por variação</p>
          <p className="mb-5 text-xs text-muted-foreground">
            Desmarque as combinações esgotadas e ajuste o estoque de cada uma.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs uppercase tracking-widest-xs text-muted-foreground">
                    Cor \ Tamanho
                  </th>
                  {sizes.map((size) => (
                    <th
                      key={size.tempId}
                      className="p-2 text-center text-xs uppercase tracking-widest-xs text-muted-foreground"
                    >
                      {size.label || "—"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color.tempId} className="border-t border-border">
                    <td className="p-2 text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name || "—"}
                      </span>
                    </td>
                    {sizes.map((size) => {
                      const variant = variants.find(
                        (v) => v.colorTempId === color.tempId && v.sizeTempId === size.tempId
                      );
                      return (
                        <td key={size.tempId} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="checkbox"
                              checked={variant?.available ?? true}
                              onChange={(e) =>
                                updateVariant(color.tempId, size.tempId, {
                                  available: e.target.checked,
                                })
                              }
                              className="h-4 w-4"
                            />
                            <input
                              type="number"
                              min={0}
                              value={variant?.stock ?? 0}
                              onChange={(e) =>
                                updateVariant(color.tempId, size.tempId, {
                                  stock: Number(e.target.value),
                                })
                              }
                              className={cn(
                                "w-14 border border-border bg-background px-1.5 py-1 text-center text-xs outline-none focus:border-foreground",
                                !variant?.available && "opacity-40"
                              )}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Salvando..." : product ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="text-xs uppercase tracking-widest-xs text-muted-foreground underline underline-offset-4"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={required}
        className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}
