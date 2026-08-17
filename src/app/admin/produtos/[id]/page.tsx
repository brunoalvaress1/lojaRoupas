import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries/categories";
import { getProductById } from "@/lib/queries/products";

export const metadata: Metadata = { title: "Editar produto" };

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <AdminGuard>
      <AdminShell title="Editar produto" subtitle={product.name}>
        <ProductForm product={product} categories={categories} />
      </AdminShell>
    </AdminGuard>
  );
}
