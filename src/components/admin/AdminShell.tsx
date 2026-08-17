"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Tag,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Produtos", icon: Shirt, href: "/admin/produtos" },
  { label: "Categorias", icon: Tag, href: "/admin/categorias" },
  { label: "Pedidos (WhatsApp)", icon: MessageCircle, href: null },
  { label: "Configurações", icon: Settings, href: "/admin/configuracoes" },
];

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh bg-muted/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background px-5 py-6 md:flex">
        <div className="flex items-center gap-2">
          <Logo height={32} />
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href && pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded px-3 py-2.5 text-sm text-muted-foreground/60"
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
                <span className="ml-auto text-[10px] uppercase tracking-widest-xs">
                  em breve
                </span>
              </div>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Sair
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <p className="text-sm font-medium">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{user?.name}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-display text-sm">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <button
              onClick={logout}
              aria-label="Sair"
              className="text-muted-foreground md:hidden"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
