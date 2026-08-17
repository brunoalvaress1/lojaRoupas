"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

export function AccountIcon() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const hasHydrated = useHasHydrated();

  return (
    <Link
      href={currentUser ? "/conta" : "/login"}
      aria-label={currentUser ? "Minha conta" : "Entrar"}
      className="relative transition-opacity hover:opacity-60"
    >
      <User className="h-5 w-5" strokeWidth={1.5} />
      {hasHydrated && currentUser && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
      )}
    </Link>
  );
}
