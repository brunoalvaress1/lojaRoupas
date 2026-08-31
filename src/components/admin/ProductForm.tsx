"use client";

import { useActionState, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createProduct, updateProduct, type ProductFormState } from "@/lib/actions/products";
import { mapWithConcurrency, uploadToStorage } from "@/lib/upload-client";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

const initialState: ProductFormState = {};

interface ExistingImage {
  url: string;
  alt: string;
}
interface NewImage {
  id: string;
  file: File;
  preview: string;
}
interface ColorRow {
  tempId: string;
  name: string;
  hex: string;
  existingImages: ExistingImage[];
  newImages: NewImage[];
}
interface SizeRow {
  tempId: string;
  label: string;
}
interface VariantCell {
  colorTempId: string | null;
  sizeTempId: string;
  available: boolean;
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [colors, setColors] = useState<ColorRow[]>(
    product?.colors.map((c) => ({
      tempId: c.id,
      name: c.name,
      hex: c.hex,
      existingImages: product.images
        .filter((i) => i.colorId === c.id)
        .map((i) => ({ url: i.url, alt: i.alt })),
      newImages: [],
    })) ?? []
  );
  const [sizes, setSizes] = useState<SizeRow[]>(
    product?.sizes.map((s) => ({ tempId: s.id, label: s.label })) ?? []
  );
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    product?.images.filter((i) => i.url && !i.colorId).map((i) => ({ url: i.url, alt: i.alt })) ?? []
  );
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  // Explicit "esgotado" edits, keyed by "colorTempId:sizeTempId". Combos
  // without an entry here fall back to available=true — this keeps the
  // grid in sync with colors/sizes without an effect.
  const [variantOverrides, setVariantOverrides] = useState<Map<string, boolean>>(
    () => new Map((product?.variants ?? []).map((v) => [`${v.colorId ?? "null"}:${v.sizeId}`, v.available]))
  );

  const variants = useMemo<VariantCell[]>(() => {
    const cells: VariantCell[] = [];
    if (colors.length === 0) {
      for (const size of sizes) {
        cells.push({
          colorTempId: null,
          sizeTempId: size.tempId,
          available: variantOverrides.get(`null:${size.tempId}`) ?? true,
        });
      }
      return cells;
    }
    for (const color of colors) {
      for (const size of sizes) {
        const key = `${color.tempId}:${size.tempId}`;
        cells.push({
          colorTempId: color.tempId,
          sizeTempId: size.tempId,
          available: variantOverrides.get(key) ?? true,
        });
      }
    }
    return cells;
  }, [colors, sizes, variantOverrides]);

  function toggleVariantAvailable(colorTempId: string | null, sizeTempId: string) {
    const key = `${colorTempId}:${sizeTempId}`;
    setVariantOverrides((prev) => {
      const next = new Map(prev);
      const current = variants.find((v) => v.colorTempId === colorTempId && v.sizeTempId === sizeTempId);
      next.set(key, !(current?.available ?? true));
      return next;
    });
  }

  function addColorImages(colorTempId: string, files: File[]) {
    setColors((prev) =>
      prev.map((c) =>
        c.tempId === colorTempId
          ? {
              ...c,
              newImages: [
                ...c.newImages,
                ...files.map((file) => ({ id: uid(), file, preview: URL.createObjectURL(file) })),
              ],
            }
          : c
      )
    );
  }

  function removeColorExistingImage(colorTempId: string, url: string) {
    setColors((prev) =>
      prev.map((c) =>
        c.tempId === colorTempId
          ? { ...c, existingImages: c.existingImages.filter((i) => i.url !== url) }
          : c
      )
    );
  }

  function removeColorNewImage(colorTempId: string, imageId: string) {
    setColors((prev) =>
      prev.map((c) =>
        c.tempId === colorTempId
          ? { ...c, newImages: c.newImages.filter((i) => i.id !== imageId) }
          : c
      )
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setUploadError(null);

    const alreadyUploaded = [
      ...existingImages.map((img) => ({ ...img, colorTempId: null as string | null })),
      ...colors.flatMap((c) => c.existingImages.map((img) => ({ ...img, colorTempId: c.tempId }))),
    ];
    const pending = [
      ...newImages.map((n) => ({ file: n.file, colorTempId: null as string | null })),
      ...colors.flatMap((c) => c.newImages.map((n) => ({ file: n.file, colorTempId: c.tempId }))),
    ];

    let uploaded: { url: string; alt: string; colorTempId: string | null }[] = [];
    if (pending.length > 0) {
      // Uploading every photo at once is what makes saving unreliable when a
      // product has many colors/photos — a weak connection can't sustain that
      // many simultaneous transfers, and it looks frozen with no feedback.
      // A small pool + a visible counter fixes both.
      setUploadProgress({ done: 0, total: pending.length });
      setUploading(true);
      try {
        uploaded = await mapWithConcurrency(pending, 3, async ({ file, colorTempId }) => {
          const url = await uploadToStorage("product-images", "products", file);
          setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
          return { url, alt: "", colorTempId };
        });
      } catch {
        setUploading(false);
        setUploadError(
          "Não foi possível enviar uma ou mais fotos. Verifique sua conexão e tente novamente — as fotos já enviadas não precisam ser adicionadas de novo."
        );
        return;
      }
      setUploading(false);
    }

    const fd = new FormData(formEl);
    fd.set("colorsJson", JSON.stringify(colors.map(({ tempId, name, hex }) => ({ tempId, name, hex }))));
    fd.set("sizesJson", JSON.stringify(sizes));
    fd.set("variantsJson", JSON.stringify(variants));
    fd.set("imagesJson", JSON.stringify([...alreadyUploaded, ...uploaded]));

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
        <p className="mb-1 text-sm font-medium">
          {colors.length > 0 ? "Fotos gerais" : "Imagens"}
        </p>
        <p className="mb-5 text-xs text-muted-foreground">
          {colors.length > 0
            ? "Coloque aqui só a foto de capa, a foto do efeito ao passar o mouse e, se quiser, mais um ângulo — o resto (a peça em cada cor) vai na seção \"Cores\" abaixo, dentro de cada cor."
            : "A 1ª foto é a capa do produto; a 2ª é a que aparece ao passar o mouse."}
        </p>
        <ImagePicker
          existing={existingImages}
          onRemoveExisting={(url) => setExistingImages((prev) => prev.filter((i) => i.url !== url))}
          newImages={newImages}
          onAddFiles={(files) =>
            setNewImages((prev) => [
              ...prev,
              ...files.map((file) => ({ id: uid(), file, preview: URL.createObjectURL(file) })),
            ])
          }
          onRemoveNew={(id) => setNewImages((prev) => prev.filter((i) => i.id !== id))}
          slotLabels={["Capa", "Hover"]}
        />
      </section>

      {/* colors */}
      <section className="border border-border bg-background p-6">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-medium">Cores</p>
          <button
            type="button"
            onClick={() =>
              setColors((prev) => [
                ...prev,
                { tempId: uid(), name: "", hex: "#000000", existingImages: [], newImages: [] },
              ])
            }
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Adicionar cor
          </button>
        </div>
        {colors.length > 0 && (
          <p className="mb-5 text-xs text-muted-foreground">
            Cada cor pode ter suas próprias fotos — ao clicar na cor, o cliente vê só as fotos daquela cor.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {colors.map((color) => (
            <div key={color.tempId} className="flex flex-col gap-4 border border-border p-4">
              <div className="flex items-center gap-3">
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

              <div>
                <p className="mb-2 text-xs uppercase tracking-widest-xs text-muted-foreground">
                  Fotos desta cor (opcional)
                </p>
                <ImagePicker
                  compact
                  existing={color.existingImages}
                  onRemoveExisting={(url) => removeColorExistingImage(color.tempId, url)}
                  newImages={color.newImages}
                  onAddFiles={(files) => addColorImages(color.tempId, files)}
                  onRemoveNew={(id) => removeColorNewImage(color.tempId, id)}
                />
              </div>
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
      {sizes.length > 0 && (
        <section className="border border-border bg-background p-6">
          <p className="mb-1 text-sm font-medium">Disponibilidade</p>
          <p className="mb-5 text-xs text-muted-foreground">
            {colors.length > 0
              ? "Clique para marcar uma combinação de cor e tamanho como esgotada."
              : "Clique para marcar um tamanho como esgotado."}
          </p>
          {colors.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variant = variants.find((v) => v.sizeTempId === size.tempId);
                const available = variant?.available ?? true;
                return (
                  <button
                    key={size.tempId}
                    type="button"
                    onClick={() => toggleVariantAvailable(null, size.tempId)}
                    className={cn(
                      "border px-4 py-2 text-xs uppercase tracking-widest-xs transition-colors",
                      available
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground line-through"
                    )}
                  >
                    {size.label || "—"} · {available ? "Disponível" : "Esgotado"}
                  </button>
                );
              })}
            </div>
          ) : (
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
                        const available = variant?.available ?? true;
                        return (
                          <td key={size.tempId} className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => toggleVariantAvailable(color.tempId, size.tempId)}
                              className={cn(
                                "w-24 border px-2 py-1.5 text-[11px] uppercase tracking-widest-xs transition-colors",
                                available
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border text-muted-foreground line-through"
                              )}
                            >
                              {available ? "Disponível" : "Esgotado"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {uploading
            ? `Enviando fotos... (${uploadProgress.done}/${uploadProgress.total})`
            : pending
              ? "Salvando..."
              : product
                ? "Salvar alterações"
                : "Criar produto"}
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

function ImagePicker({
  existing,
  onRemoveExisting,
  newImages,
  onAddFiles,
  onRemoveNew,
  compact = false,
  slotLabels,
}: {
  existing: ExistingImage[];
  onRemoveExisting: (url: string) => void;
  newImages: NewImage[];
  onAddFiles: (files: File[]) => void;
  onRemoveNew: (id: string) => void;
  compact?: boolean;
  /** Optional caption per photo position (0-indexed, existing photos first, then new ones). */
  slotLabels?: string[];
}) {
  const thumbSize = compact ? "h-16 w-14" : "h-24 w-20";
  return (
    <div className="flex flex-wrap gap-3">
      {existing.map((img, i) => {
        const label = slotLabels?.[i];
        return (
          <div key={img.url} className="flex flex-col items-center gap-1">
            <div className={cn("relative overflow-hidden bg-muted", thumbSize)}>
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExisting(img.url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
          </div>
        );
      })}
      {newImages.map((img, i) => {
        const label = slotLabels?.[existing.length + i];
        return (
          <div key={img.id} className="flex flex-col items-center gap-1">
            <div className={cn("relative overflow-hidden bg-muted", thumbSize)}>
              <Image src={img.preview} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveNew(img.id)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
          </div>
        );
      })}
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground hover:border-foreground",
          thumbSize
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        <span className="text-[10px]">Adicionar</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            onAddFiles(files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
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
