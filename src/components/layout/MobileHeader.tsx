"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X, MessageCircle, User } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { useState } from "react";
import { NAV_LINKS } from "./nav-links";
import { CartCount } from "./CartCount";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/shared/Logo";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { settings: storeSettings, categories } = useAppData();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black px-4 text-white md:hidden">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <Link href="/">
          <Logo variant="black-bg" height={40} />
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
          <div className="animate-fade-in absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-black px-6 py-6 text-white">
            <div className="mb-8 flex items-center justify-between">
              <Logo variant="black-bg" height={44} />
              <span className="sr-only">{storeSettings.name}</span>
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
                  className="font-display text-base uppercase tracking-wide text-zinc-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <p className="mb-3 text-xs uppercase tracking-widest-xs text-white/50">
                Categorias
              </p>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/colecao?categoria=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-white/80"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6">
              <Link
                href={currentUser ? "/conta" : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                {currentUser ? currentUser.name.split(" ")[0] : "Entrar / Cadastrar"}
              </Link>
              <a
                href={buildSimpleWhatsAppUrl(storeSettings)}
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
