import type { Metadata } from "next";
import { AdminLoginView } from "@/components/admin/AdminLoginView";
import { getStoreSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Login",
};

export default async function AdminLoginPage() {
  const settings = await getStoreSettings();
  return <AdminLoginView settings={settings} />;
}
