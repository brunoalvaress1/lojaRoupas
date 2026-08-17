"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { cartTotals, useCartStore } from "@/store/cart-store";
import { CartItemRow } from "./CartItemRow";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useAppData } from "@/context/AppDataContext";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useHasHydrated();
  const { settings } = useAppData();
  const { totalPrice } = cartTotals(items);

  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
        <h1 className="mt-6 font-display text-2xl">Seu carrinho está vazio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore a coleção e adicione peças que combinam com você.
        </p>
        <Link
          href="/colecao"
          className="mt-8 inline-flex items-center bg-accent px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(
    buildOrderMessage(items, settings),
    settings.whatsappNumber
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-8 sm:pt-10">
      <h1 className="font-display text-3xl sm:text-4xl">Meu carrinho</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <div>
          {items.map((item) => (
            <CartItemRow key={`${item.productId}-${item.colorId}-${item.sizeId}`} item={item} />
          ))}
          <Link
            href="/colecao"
            className="mt-6 inline-block text-xs uppercase tracking-widest-xs underline underline-offset-4"
          >
            Continuar comprando
          </Link>
        </div>

        <div className="h-fit border border-border p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frete</span>
            <span className="text-muted-foreground">A calcular</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 bg-accent py-4 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            Finalizar pelo WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Ao clicar, você será direcionado para o WhatsApp com o resumo do
            seu pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
