"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import {
  useAdminAuthStore,
  ADMIN_DEMO_EMAIL,
  ADMIN_DEMO_PASSWORD,
} from "@/store/admin-auth-store";
import { storeSettings } from "@/data/store-settings";

export function AdminLoginView() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0d0c0a] px-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Lock className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-2xl tracking-widest-xs">
            {storeSettings.name}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest-xs text-white/50">
            Painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-white/50">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-white/20 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-white/60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-white/50">
              Senha
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-white/20 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-white/60"
            />
          </label>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-2 bg-white py-3.5 text-xs font-medium uppercase tracking-widest-xs text-black transition-opacity hover:opacity-90"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/40">
          Acesso restrito à equipe {storeSettings.name}. Contas de administrador
          não podem ser criadas publicamente.
        </p>

        <div className="mt-6 rounded border border-white/10 bg-white/5 px-4 py-3 text-center text-[11px] text-white/50">
          Demonstração: {ADMIN_DEMO_EMAIL} / {ADMIN_DEMO_PASSWORD}
        </div>

        <Link
          href="/"
          className="mt-8 block text-center text-xs text-white/40 underline underline-offset-4"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
