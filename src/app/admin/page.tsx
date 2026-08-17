import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <AdminGuard>
      <AdminDashboard products={products} categories={categories} />
    </AdminGuard>
  );
}
