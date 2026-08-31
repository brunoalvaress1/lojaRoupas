"use client";

import { useActionState, useState, useTransition } from "react";
import { updateSiteSettings, type SettingsFormState } from "@/lib/actions/settings";
import { uploadToStorage } from "@/lib/upload-client";
import type { StoreSettings } from "@/types";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);
  const [, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const videoFile = fd.get("heroVideo") as File | null;
    const posterFile = fd.get("heroPoster") as File | null;
    fd.delete("heroVideo");
    fd.delete("heroPoster");

    if ((videoFile && videoFile.size > 0) || (posterFile && posterFile.size > 0)) {
      setUploadError(null);
      setUploading(true);
      try {
        if (videoFile && videoFile.size > 0) {
          fd.set("heroVideoUrl", await uploadToStorage("site-media", "hero-video", videoFile));
        }
        if (posterFile && posterFile.size > 0) {
          fd.set("heroPosterUrl", await uploadToStorage("site-media", "hero-poster", posterFile));
        }
      } catch {
        setUploading(false);
        setUploadError("Não foi possível enviar o arquivo. Verifique sua conexão e tente novamente.");
        return;
      }
      setUploading(false);
    }

    startTransition(() => formAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-8">
      <section className="border border-border bg-background p-6">
        <p className="mb-5 text-sm font-medium">Loja</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome da loja" name="name" defaultValue={settings.name} required />
          <Field label="Frase de efeito (tagline)" name="tagline" defaultValue={settings.tagline} />
          <Field label="Endereço" name="address" defaultValue={settings.address} className="sm:col-span-2" />
          <Field label="Horário de funcionamento" name="hours" defaultValue={settings.hours} />
          <Field label="Instagram (@usuario)" name="instagram" defaultValue={settings.instagram} />
        </div>
      </section>

      <section className="border border-border bg-background p-6">
        <p className="mb-5 text-sm font-medium">WhatsApp</p>
        <div className="grid grid-cols-1 gap-4">
          <Field
            label="Número (com DDI e DDD, só dígitos)"
            name="whatsappNumber"
            defaultValue={settings.whatsappNumber}
            placeholder="5511999999999"
            required
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Mensagem padrão
            </span>
            <textarea
              name="whatsappDefaultMessage"
              rows={2}
              defaultValue={settings.whatsappDefaultMessage}
              className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </label>
        </div>
      </section>

      <section className="border border-border bg-background p-6">
        <p className="mb-5 text-sm font-medium">Hero da página inicial</p>
        <div className="flex flex-col gap-4">
          <Field label="Título" name="heroTitle" defaultValue={settings.heroTitle} />
          <Field label="Subtítulo" name="heroSubtitle" defaultValue={settings.heroSubtitle} />
          <Field label="Texto do botão" name="heroButtonLabel" defaultValue={settings.heroButtonLabel} />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Substituir vídeo do hero (mp4)
            </span>
            <input type="file" name="heroVideo" accept="video/mp4" className="text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              Substituir imagem de capa (fallback)
            </span>
            <input type="file" name="heroPoster" accept="image/*" className="text-sm" />
          </label>
        </div>
      </section>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-700">Configurações salvas com sucesso.</p>
      )}

      <button
        type="submit"
        disabled={pending || uploading}
        className="w-fit bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {uploading ? "Enviando arquivo..." : pending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}
