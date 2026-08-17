import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Editar categoria" };

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <AdminGuard>
      <AdminShell title="Editar categoria" subtitle={category.name}>
        <CategoryForm category={category} />
      </AdminShell>
    </AdminGuard>
  );
}
