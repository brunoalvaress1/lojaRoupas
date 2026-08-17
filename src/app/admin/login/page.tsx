import type { Metadata } from "next";
import { AdminLoginView } from "@/components/admin/AdminLoginView";

export const metadata: Metadata = {
  title: "Login",
};

export default function AdminLoginPage() {
  return <AdminLoginView />;
}
