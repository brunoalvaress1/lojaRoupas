import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
