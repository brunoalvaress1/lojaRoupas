import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesAdminList } from "@/components/admin/CategoriesAdminList";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Categorias" };

export default async function AdminCategoriasPage() {
  const categories = await getCategories();

  return (
    <AdminGuard>
      <AdminShell title="Categorias" subtitle="Organize as coleções da loja">
        <CategoriesAdminList categories={categories} />
      </AdminShell>
    </AdminGuard>
  );
}
