"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageOff } from "lucide-react";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 border-b border-border py-5">
      <Link
        href={`/produto/${item.slug}`}
        className="relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden bg-muted sm:h-28 sm:w-24"
      >
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
        ) : (
          <ImageOff className="h-5 w-5 text-muted-foreground/40" strokeWidth={1.2} />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/produto/${item.slug}`} className="text-sm font-medium">
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Ref.: {item.reference}</p>
            <p className="text-xs text-muted-foreground">
              {item.colorName} / {item.sizeLabel}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.colorId, item.sizeId)}
            aria-label="Remover"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center border border-border">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.colorId, item.sizeId, item.quantity - 1)
              }
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <span className="w-7 text-center text-xs">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.colorId, item.sizeId, item.quantity + 1)
              }
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
