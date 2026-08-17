import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsAdminList } from "@/components/admin/ProductsAdminList";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Produtos" };

export default async function AdminProdutosPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <AdminGuard>
      <AdminShell title="Produtos" subtitle={`${products.length} produtos cadastrados`}>
        <ProductsAdminList products={products} categories={categories} />
      </AdminShell>
    </AdminGuard>
  );
}
