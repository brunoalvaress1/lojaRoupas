"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { BOTTOM_NAV_LINKS } from "./nav-links";
import { CartCount } from "./CartCount";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  grid: LayoutGrid,
  heart: Heart,
  bag: ShoppingBag,
  user: User,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-white/10 bg-black md:hidden">
      {BOTTOM_NAV_LINKS.map((link) => {
        const Icon = ICONS[link.icon];
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex flex-col items-center gap-1 px-2 text-[10px] uppercase tracking-widest-xs",
              active ? "text-zinc-100" : "text-white/60"
            )}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2 : 1.5}
            />
            {link.icon === "bag" && <CartCount />}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
