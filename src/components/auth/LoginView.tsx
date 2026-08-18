"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { Logo } from "@/components/shared/Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** If the account that just signed in is an admin, send it to the admin
 * panel instead of the regular customer destination — people who land on
 * the storefront login instead of /admin/login shouldn't get stuck. */
async function redirectTargetFor(supabase: ReturnType<typeof createClient>, fallback: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return fallback;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return admin ? "/admin" : fallback;
}

type Tab = "login" | "cadastro";

const PANEL_TRANSITION = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

export function LoginView() {
  const { settings } = useAppData();
  const [tab, setTab] = useState<Tab>("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/favoritos";

  const { signIn, signUp } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn(loginEmail, loginPassword);
    if (!result.ok) {
      setSubmitting(false);
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }
    const target = await redirectTargetFor(supabase, redirectTo);
    setSubmitting(false);
    router.push(target);
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Preencha todos os campos. A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível criar sua conta.");
      return;
    }
    if (result.needsEmailConfirmation) {
      setInfo("Enviamos um link de confirmação para o seu e-mail.");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  const panelProps = {
    tab,
    setTab,
    error,
    setError,
    info,
    submitting,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
    handleRegister,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop: sliding split panel */}
      <div className="relative hidden h-[calc(100svh-80px)] overflow-hidden md:block">
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          animate={{ x: tab === "cadastro" ? "100%" : "0%" }}
          transition={PANEL_TRANSITION}
        >
          <div
            className={cn(
              "relative h-full w-full overflow-hidden transition-[border-radius] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
              tab === "cadastro" ? "rounded-l-[64px]" : "rounded-r-[64px]"
            )}
          >
            <Image
              src="/foraDaLoja.jpeg"
              alt={`Fachada da loja ${settings.name}`}
              fill
              sizes="50vw"
              className="animate-ken-burns object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
            <AnimatePresence mode="wait">
              <motion.p
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-0 bottom-12 px-10 font-display text-3xl leading-snug text-white"
              >
                {tab === "login" ? (
                  <>
                    Sua conta, seu estilo,
                    <br />
                    sempre à mão.
                  </>
                ) : (
                  <>
                    Bem-vinda à família,
                    <br />
                    comece por aqui.
                  </>
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-y-0 left-1/2 flex w-1/2 items-center justify-center px-6 sm:px-12"
          animate={{ x: tab === "cadastro" ? "-100%" : "0%" }}
          transition={PANEL_TRANSITION}
        >
          <div className="w-full max-w-sm">
            <AuthPanel {...panelProps} />
          </div>
        </motion.div>
      </div>

      {/* Mobile: image + form slide in together as one block, like the desktop swap */}
      <div className="relative min-h-[100svh] overflow-hidden md:hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={tab}
            initial={{ x: tab === "cadastro" ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: tab === "cadastro" ? "-100%" : "100%" }}
            transition={PANEL_TRANSITION}
            className="absolute inset-0 flex flex-col"
          >
            <div
              className={cn(
                "relative h-[34vh] min-h-[240px] w-full shrink-0 overflow-hidden",
                tab === "cadastro" ? "rounded-bl-[48px]" : "rounded-br-[48px]"
              )}
            >
              <Image
                src={tab === "cadastro" ? "/dentroloja1.jpeg" : "/foraDaLoja.jpeg"}
                alt={`Ambiente da loja ${settings.name}`}
                fill
                sizes="100vw"
                className="animate-ken-burns object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/30" />
              <p className="absolute inset-x-0 bottom-6 px-8 font-display text-2xl leading-snug text-white">
                {tab === "login" ? (
                  <>
                    Sua conta, seu estilo,
                    <br />
                    sempre à mão.
                  </>
                ) : (
                  <>
                    Bem-vinda à família,
                    <br />
                    comece por aqui.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10">
              <div className="w-full max-w-sm">
                <AuthPanel {...panelProps} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface AuthPanelProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  error: string | null;
  setError: (e: string | null) => void;
  info: string | null;
  submitting: boolean;
  loginEmail: string;
  setLoginEmail: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (fn: (v: boolean) => boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
}

function AuthPanel({
  tab,
  setTab,
  error,
  setError,
  info,
  submitting,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  handleRegister,
}: AuthPanelProps) {
  return (
    <>
      <Link href="/">
        <Logo height={44} className="hidden sm:block" />
        <Logo height={40} variant="icon" className="sm:hidden" />
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
            <Field label="E-mail" type="email" value={loginEmail} onChange={setLoginEmail} required />
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
              disabled={submitting}
              className="mt-2 bg-accent py-3.5 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Entrando..." : "Entrar"}
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
            <Field label="E-mail" type="email" value={email} onChange={setEmail} required />
            <PasswordField
              label="Senha"
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
              required
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            {info && <p className="text-xs text-foreground">{info}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-accent py-3.5 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Criando conta..." : "Cadastrar"}
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
    </>
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
