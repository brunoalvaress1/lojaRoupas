"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const EMPTY_SET: Set<string> = new Set();

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (active) {
          setFavoriteIds(new Set((data ?? []).map((row) => row.product_id)));
        }
      });
    return () => {
      active = false;
    };
  }, [user, supabase]);

  const effectiveFavoriteIds = user ? favoriteIds : EMPTY_SET;

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return;
      const has = favoriteIds.has(productId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (has) next.delete(productId);
        else next.add(productId);
        return next;
      });

      if (has) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, product_id: productId });
      }
    },
    [user, favoriteIds, supabase]
  );

  const isFavorite = useCallback(
    (productId: string) => effectiveFavoriteIds.has(productId),
    [effectiveFavoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds: effectiveFavoriteIds, isFavorite, toggle }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
