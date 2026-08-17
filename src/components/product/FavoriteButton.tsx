"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useFavoritesStore } from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  productId,
  className,
  size = "sm",
}: {
  productId: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const hasHydrated = useHasHydrated();
  const isFavorite = useFavoritesStore((s) => s.isFavorite(productId));
  const toggle = useFavoritesStore((s) => s.toggle);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!currentUser) {
            setGateOpen(true);
            return;
          }
          toggle(productId);
        }}
        className={cn(
          "flex items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-transform active:scale-90",
          size === "sm" ? "h-8 w-8" : "h-11 w-11",
          className
        )}
      >
        <Heart
          className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")}
          strokeWidth={1.5}
          fill={hasHydrated && currentUser && isFavorite ? "currentColor" : "none"}
        />
      </button>

      <AuthGateModal open={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}
