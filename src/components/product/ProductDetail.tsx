"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import type { Product, SizeGuideRow } from "@/types";
import { Price } from "@/components/shared/Price";
import { FavoriteButton } from "./FavoriteButton";
import { SizeGuideModal } from "./SizeGuideModal";
import { ProductGallery } from "./ProductGallery";
import { isVariantAvailable } from "@/lib/product-helpers";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  sizeGuideRows,
}: {
  product: Product;
  sizeGuideRows: SizeGuideRow[];
}) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const availableSizeIds = useMemo(
    () =>
      new Set(
        product.variants
          .filter((v) => v.colorId === colorId && v.available)
          .map((v) => v.sizeId)
      ),
    [product.variants, colorId]
  );

  const canAdd = sizeId !== null && isVariantAvailable(product, colorId, sizeId);
  const activePrice = product.promoPrice ?? product.price;

  function handleAddToCart() {
    if (!canAdd || !sizeId) return;
    const color = product.colors.find((c) => c.id === colorId);
    const size = product.sizes.find((s) => s.id === sizeId);

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      reference: product.reference,
      image: product.images[0].url,
      colorId,
      colorName: color?.name ?? "",
      sizeId,
      sizeLabel: size?.label ?? "",
      price: activePrice,
      quantity,
    });

    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2200);
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
      <ProductGallery images={product.images} />

      <div className="max-w-lg">
        <h1 className="font-display text-2xl sm:text-3xl">{product.name}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Ref.: {product.reference}
        </p>
        <Price
          price={product.price}
          promoPrice={product.promoPrice}
          size="lg"
          className="mt-4 block"
        />

        {/* colors */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
            Cor: {product.colors.find((c) => c.id === colorId)?.name}
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  setColorId(color.id);
                  setSizeId(null);
                }}
                aria-label={color.name}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform",
                  colorId === color.id
                    ? "scale-110 border-foreground"
                    : "border-transparent"
                )}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: "0 0 0 1px var(--border) inset",
                }}
              />
            ))}
          </div>
        </div>

        {/* sizes */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
              Tamanho
            </p>
            <SizeGuideModal rows={sizeGuideRows} />
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const available = availableSizeIds.has(size.id);
              return (
                <button
                  key={size.id}
                  disabled={!available}
                  onClick={() => setSizeId(size.id)}
                  className={cn(
                    "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors",
                    !available &&
                      "cursor-not-allowed border-border text-muted-foreground/40 line-through",
                    available &&
                      sizeId === size.id &&
                      "border-foreground bg-foreground text-background",
                    available &&
                      sizeId !== size.id &&
                      "border-border hover:border-foreground"
                  )}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
          {sizeId === null && (
            <p className="mt-2 text-xs text-muted-foreground">
              Selecione um tamanho disponível.
            </p>
          )}
        </div>

        {/* quantity */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest-xs text-muted-foreground">
            Quantidade
          </p>
          <div className="inline-flex items-center border border-border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* actions */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 py-4 text-xs font-medium uppercase tracking-widest-xs transition-colors",
              canAdd
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            {confirmed ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} />
                Adicionado
              </>
            ) : (
              "Adicionar ao carrinho"
            )}
          </button>
          <FavoriteButton productId={product.id} size="lg" className="static" />
        </div>

        {/* description */}
        <div className="mt-12 divide-y divide-border border-t border-border">
          <details open className="group py-4">
            <summary className="cursor-pointer text-xs font-medium uppercase tracking-widest-xs">
              Descrição
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </details>
          {product.composition && (
            <details className="group py-4">
              <summary className="cursor-pointer text-xs font-medium uppercase tracking-widest-xs">
                Composição
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.composition}
              </p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
