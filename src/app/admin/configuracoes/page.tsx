import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getStoreSettings } from "@/lib/queries/settings";

export const metadata: Metadata = { title: "Configurações" };

export default async function AdminConfiguracoesPage() {
  const settings = await getStoreSettings();

  return (
    <AdminGuard>
      <AdminShell title="Configurações" subtitle="Dados públicos da loja">
        <SettingsForm settings={settings} />
      </AdminShell>
    </AdminGuard>
  );
}
