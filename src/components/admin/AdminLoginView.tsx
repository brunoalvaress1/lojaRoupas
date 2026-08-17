"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import type { StoreSettings } from "@/types";

export function AdminLoginView({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setSubmitting(false);
      setError("E-mail ou senha inválidos.");
      return;
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("Esta conta não tem permissão de administrador.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0d0c0a] px-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo height={72} />
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
            disabled={submitting}
            className="mt-2 bg-white py-3.5 text-xs font-medium uppercase tracking-widest-xs text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/40">
          Acesso restrito à equipe {settings.name}. Contas de administrador
          não podem ser criadas publicamente.
        </p>

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
