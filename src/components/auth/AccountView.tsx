"use client";

import Link from "next/link";
import { Heart, ShoppingBag, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

export function AccountView() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) return null;

  if (!currentUser) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <User className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
        <h1 className="mt-6 font-display text-2xl">Sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre para ver seus favoritos, pedidos e dados salvos.
        </p>
        <Link
          href="/login?redirect=/conta"
          className="mt-8 inline-flex items-center bg-accent px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground"
        >
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 pb-20 pt-10 sm:pt-16">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted font-display text-xl">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-xl">{currentUser.name}</p>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </div>
      </div>

      <div className="mt-10 divide-y divide-border border-y border-border">
        <Link
          href="/favoritos"
          className="flex items-center justify-between py-4 text-sm"
        >
          <span className="flex items-center gap-3">
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            Meus favoritos
          </span>
          <span>→</span>
        </Link>
        <Link
          href="/carrinho"
          className="flex items-center justify-between py-4 text-sm"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            Meu carrinho
          </span>
          <span>→</span>
        </Link>
      </div>

      <button
        onClick={logout}
        className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest-xs text-muted-foreground underline underline-offset-4"
      >
        <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
        Sair da conta
      </button>
    </div>
  );
}
