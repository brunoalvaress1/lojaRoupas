"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, X } from "lucide-react";

export function AuthGateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-black/50"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />
      <div className="animate-fade-in relative z-10 w-full max-w-sm rounded-t-2xl bg-background p-8 text-center sm:rounded-2xl">
        <button
          aria-label="Fechar"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 text-muted-foreground"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Heart className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <p className="mt-5 font-display text-xl">Entre para salvar favoritos</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Crie uma conta ou faça login para guardar suas peças favoritas e
          encontrá-las sempre que quiser.
        </p>

        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="mt-6 block bg-accent py-3.5 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90"
        >
          Entrar ou criar conta
        </Link>
      </div>
    </div>
  );
}
