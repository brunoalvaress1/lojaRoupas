"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AccountIcon() {
  const { user } = useAuth();

  return (
    <Link
      href={user ? "/conta" : "/login"}
      aria-label={user ? "Minha conta" : "Entrar"}
      className="relative transition-opacity hover:opacity-60"
    >
      <User className="h-5 w-5" strokeWidth={1.5} />
      {user && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
      )}
    </Link>
  );
}
