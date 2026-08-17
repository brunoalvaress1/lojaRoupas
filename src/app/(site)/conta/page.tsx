import type { Metadata } from "next";
import { AccountView } from "@/components/auth/AccountView";

export const metadata: Metadata = {
  title: "Minha Conta",
};

export default function ContaPage() {
  return <AccountView />;
}
