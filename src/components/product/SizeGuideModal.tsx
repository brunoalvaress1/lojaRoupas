"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SizeGuideTable } from "./SizeGuideTable";

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground underline underline-offset-4"
      >
        Guia de tamanhos
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="animate-fade-in relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl">Guia de Tamanhos</p>
              <button onClick={() => setOpen(false)} aria-label="Fechar">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <SizeGuideTable />
          </div>
        </div>
      )}
    </>
  );
}
