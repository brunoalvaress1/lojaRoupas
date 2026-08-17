import Link from "next/link";
import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { SearchBox } from "./SearchBox";
import { CartCount } from "./CartCount";
import { AccountIcon } from "./AccountIcon";
import { storeSettings } from "@/data/store-settings";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export function Header() {
  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-border bg-background/90 backdrop-blur md:block">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="font-display text-2xl tracking-widest-xs"
        >
          {storeSettings.name}
        </Link>

        <nav className="flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-widest-xs text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <SearchBox />
          <AccountIcon />
          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="transition-opacity hover:opacity-60"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <CartCount />
          </Link>
          <a
            href={buildSimpleWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="transition-opacity hover:opacity-60"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  );
}
