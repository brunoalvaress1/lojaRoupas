"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { storeSettings } from "@/data/store-settings";
import { cn } from "@/lib/utils";

type Tab = "login" | "cadastro";

export function LoginView() {
  const [tab, setTab] = useState<Tab>("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/favoritos";

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const result = login(loginEmail, loginPassword);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }
    router.push(redirectTo);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 4) {
      setError("Preencha todos os campos. A senha deve ter ao menos 4 caracteres.");
      return;
    }
    const result = register(name.trim(), email.trim(), password);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível criar sua conta.");
      return;
    }
    router.push(redirectTo);
  }

  return (
    <div className="grid min-h-[calc(100svh-64px)] grid-cols-1 md:min-h-[calc(100svh-80px)] md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=1200&q=80&auto=format&fit=crop"
          alt={`Look da coleção ${storeSettings.name}`}
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-x-0 bottom-12 px-10 text-white">
          <p className="font-display text-3xl leading-snug">
            Sua conta, seu estilo,
            <br />
            sempre à mão.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display text-2xl tracking-widest-xs">
            {storeSettings.name}
          </Link>

          <div className="mt-10 mb-8 flex border-b border-border">
            {(["login", "cadastro"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError(null);
                }}
                className={cn(
                  "relative pb-3 pr-6 text-sm font-medium uppercase tracking-widest-xs transition-colors",
                  tab === t ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t === "login" ? "Login" : "Cadastro"}
                {tab === t && (
                  <motion.span
                    layoutId="login-tab-underline"
                    className="absolute -bottom-px left-0 h-px w-10 bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
              >
                <p className="text-sm text-muted-foreground">
                  Bem-vinda de volta! Entre para ver seus favoritos e pedidos.
                </p>
                <Field
                  label="E-mail"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  required
                />
                <PasswordField
                  label="Senha"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  show={showPassword}
                  onToggleShow={() => setShowPassword((v) => !v)}
                  required
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <Link
                  href="/login"
                  className="-mt-1 self-end text-xs text-muted-foreground underline underline-offset-4"
                >
                  Esqueci minha senha
                </Link>
                <button
                  type="submit"
                  className="mt-2 bg-accent py-3.5 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Entrar
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="cadastro"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="flex flex-col gap-4"
              >
                <p className="text-sm text-muted-foreground">
                  Crie sua conta para salvar favoritos e agilizar seus pedidos.
                </p>
                <Field label="Nome completo" value={name} onChange={setName} required />
                <Field
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <PasswordField
                  label="Senha"
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggleShow={() => setShowPassword((v) => !v)}
                  required
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="mt-2 bg-accent py-3.5 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Cadastrar
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou entrar com</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-3">
            <SocialButton label="Google">G</SocialButton>
            <SocialButton label="Facebook">f</SocialButton>
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Login social disponível em breve.
          </p>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            {tab === "login" ? (
              <>
                Ainda não tem conta?{" "}
                <button
                  onClick={() => setTab("cadastro")}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Faça login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-background px-3.5 py-3 text-sm outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border bg-background px-3.5 py-3 pr-10 text-sm outline-none transition-colors focus:border-foreground"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>
    </label>
  );
}

function SocialButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled
      aria-label={label}
      className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 border border-border py-3 text-sm text-muted-foreground opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
        {children}
      </span>
      {label}
    </button>
  );
}
