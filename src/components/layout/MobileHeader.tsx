"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X, MessageCircle, User } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { useState } from "react";
import { NAV_LINKS } from "./nav-links";
import { CartCount } from "./CartCount";
import { storeSettings } from "@/data/store-settings";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { categories } from "@/data/categories";
import { useAuthStore } from "@/store/auth-store";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <Link href="/" className="font-display text-lg tracking-widest-xs">
          {storeSettings.name}
        </Link>

        <Link href="/carrinho" aria-label="Carrinho" className="relative">
          <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
          <CartCount />
        </Link>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="animate-fade-in absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-background px-6 py-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl tracking-widest-xs">
                {storeSettings.name}
              </span>
              <button aria-label="Fechar" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-widest-xs"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <p className="mb-3 text-xs uppercase tracking-widest-xs text-muted-foreground">
                Categorias
              </p>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/colecao?categoria=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-foreground/80"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
              <Link
                href={currentUser ? "/conta" : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                {currentUser ? currentUser.name.split(" ")[0] : "Entrar / Cadastrar"}
              </Link>
              <a
                href={buildSimpleWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Falar no WhatsApp
              </a>
              <a
                href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm"
              >
                <InstagramIcon className="h-4 w-4" />
                {storeSettings.instagram}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
