import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Novo produto" };

export default async function NovoProdutoPage() {
  const categories = await getCategories();

  return (
    <AdminGuard>
      <AdminShell title="Novo produto">
        <ProductForm categories={categories} />
      </AdminShell>
    </AdminGuard>
  );
}
