import Link from "next/link";
import { getProductStock } from "@/lib/product-helpers";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";
import type { Category, Product } from "@/types";

export function AdminDashboard({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
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
    <AdminShell title="Dashboard" subtitle="Visão geral da loja">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border bg-background p-4">
            <p className="font-display text-2xl">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-sm font-medium">Produtos recentes</p>
          <Link
            href="/admin/produtos"
            className="text-xs text-muted-foreground underline underline-offset-4"
          >
            Ver todos
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
                const category = categories.find((c) => c.slug === product.categorySlug);
                const inStock = getProductStock(product);
                return (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/admin/produtos/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{category?.name}</td>
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
    </AdminShell>
  );
}
