"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    router.push(`/colecao?busca=${encodeURIComponent(term.trim())}`);
    setOpen(false);
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      {open ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-b border-foreground/40"
        >
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar peças..."
            className="w-40 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground sm:w-56"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar busca"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buscar"
          className="transition-opacity hover:opacity-60"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
