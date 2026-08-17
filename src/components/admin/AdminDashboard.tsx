"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Shirt,
  Tag,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/admin-auth-store";
import { products, getProductStock } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { storeSettings } from "@/data/store-settings";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Produtos", icon: Shirt, active: false },
  { label: "Categorias", icon: Tag, active: false },
  { label: "Pedidos (WhatsApp)", icon: MessageCircle, active: false },
  { label: "Configurações", icon: Settings, active: false },
];

export function AdminDashboard() {
  const adminName = useAdminAuthStore((s) => s.adminName);
  const logout = useAdminAuthStore((s) => s.logout);

  const activeProducts = products.filter((p) => p.active);
  const outOfStock = products.filter((p) => !getProductStock(p));
  const novelties = products.filter((p) => p.isNew);
  const featured = products.filter((p) => p.isFeatured);

  const stats = [
    { label: "Produtos", value: products.length },
    { label: "Ativos", value: activeProducts.length },
    { label: "Esgotados", value: outOfStock.length },
    { label: "Novidades", value: novelties.length },
    { label: "Destaques", value: featured.length },
    { label: "Categorias", value: categories.length },
  ];

  return (
    <div className="flex min-h-svh bg-muted/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background px-5 py-6 md:flex">
        <p className="font-display text-lg tracking-widest-xs">
          {storeSettings.name}
          <span className="ml-1.5 text-xs text-muted-foreground">Admin</span>
        </p>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 text-sm",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "cursor-not-allowed text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
              {!item.active && (
                <span className="ml-auto text-[10px] uppercase tracking-widest-xs text-muted-foreground/70">
                  em breve
                </span>
              )}
            </div>
          ))}
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
            <p className="text-sm font-medium">Dashboard</p>
            <p className="text-xs text-muted-foreground">
              Visão geral da loja
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{adminName}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-display text-sm">
              {adminName?.charAt(0) ?? "A"}
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

        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-border bg-background p-4"
            >
              <p className="font-display text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-10">
          <div className="border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-medium">Produtos recentes</p>
              <Link
                href="/colecao"
                className="text-xs text-muted-foreground underline underline-offset-4"
              >
                Ver na loja
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest-xs text-muted-foreground">
                    <th className="px-5 py-3 font-normal">Produto</th>
                    <th className="px-5 py-3 font-normal">Categoria</th>
                    <th className="px-5 py-3 font-normal">Preço</th>
                    <th className="px-5 py-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 8).map((product) => {
                    const category = categories.find(
                      (c) => c.slug === product.categorySlug
                    );
                    const inStock = getProductStock(product);
                    return (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-3">{product.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {category?.name}
                        </td>
                        <td className="px-5 py-3">{formatPrice(product.price)}</td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px]",
                              inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {inStock ? "Disponível" : "Esgotado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            O cadastro e a edição de produtos, categorias e pedidos serão
            habilitados na próxima etapa, junto da integração com o Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
