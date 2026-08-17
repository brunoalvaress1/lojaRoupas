"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
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
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [gateOpen, setGateOpen] = useState(false);
  const favorited = isFavorite(productId);

  return (
    <>
      <button
        type="button"
        aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!user) {
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
          fill={user && favorited ? "currentColor" : "none"}
        />
      </button>

      <AuthGateModal open={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}
