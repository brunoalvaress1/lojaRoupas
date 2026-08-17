"use client";

import Link from "next/link";
import { Heart, LogOut } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export function FavoritesView() {
  const productIds = useFavoritesStore((s) => s.productIds);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) return null;

  if (!currentUser) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <Heart className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
        <h1 className="mt-6 font-display text-2xl">Seus favoritos ficam aqui</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre na sua conta para salvar e ver as peças que você amou.
        </p>
        <Link
          href="/login?redirect=/favoritos"
          className="mt-8 inline-flex items-center bg-accent px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
        >
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  const favoriteProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Meus favoritos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Olá, {currentUser.name.split(" ")[0]}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-muted-foreground underline underline-offset-4"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          Sair
        </button>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
          <p className="mt-6 text-sm text-muted-foreground">
            Toque no coração das peças que você amar para salvá-las aqui.
          </p>
          <Link
            href="/colecao"
            className="mt-8 inline-flex items-center bg-accent px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
          >
            Explorar coleção
          </Link>
        </div>
      ) : (
        <StaggerGroup className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
