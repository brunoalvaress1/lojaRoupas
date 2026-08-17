"use client";

import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { cartTotals, useCartStore } from "@/store/cart-store";

export function CartCount() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useHasHydrated();
  const { totalItems } = cartTotals(items);

  if (!hasHydrated || totalItems === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
      {totalItems}
    </span>
  );
}
