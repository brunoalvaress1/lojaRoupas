import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Nova categoria" };

export default function NovaCategoriaPage() {
  return (
    <AdminGuard>
      <AdminShell title="Nova categoria">
        <CategoryForm />
      </AdminShell>
    </AdminGuard>
  );
}
