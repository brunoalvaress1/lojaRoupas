import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, colorId: string, sizeId: string) => void;
  updateQuantity: (
    productId: string,
    colorId: string,
    sizeId: string,
    quantity: number
  ) => void;
  clear: () => void;
}

function sameLine(
  item: CartItem,
  productId: string,
  colorId: string,
  sizeId: string
) {
  return (
    item.productId === productId &&
    item.colorId === colorId &&
    item.sizeId === sizeId
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.colorId, item.sizeId)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.colorId, item.sizeId)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, colorId, sizeId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, colorId, sizeId)
          ),
        })),
      updateQuantity: (productId, colorId, sizeId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, productId, colorId, sizeId)
                ? { ...i, quantity: Math.max(1, quantity) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "lumina-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function cartTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  return { totalItems, totalPrice };
}
