"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

async function uploadSiteMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  prefix: string
) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${prefix}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("site-media")
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) throw error;
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export async function updateSiteSettings(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").replace(/\D/g, "");
  const whatsappDefaultMessage = String(formData.get("whatsappDefaultMessage") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const heroButtonLabel = String(formData.get("heroButtonLabel") ?? "").trim();

  if (!name || !whatsappNumber) {
    return { error: "Informe ao menos o nome da loja e o número de WhatsApp." };
  }

  const update: SiteSettingsUpdate = {
    name,
    tagline,
    whatsapp_number: whatsappNumber,
    whatsapp_default_message: whatsappDefaultMessage,
    instagram,
    address,
    hours,
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    hero_button_label: heroButtonLabel,
    updated_at: new Date().toISOString(),
  };

  const videoFile = formData.get("heroVideo") as File | null;
  if (videoFile && videoFile.size > 0) {
    try {
      update.hero_video_url = await uploadSiteMedia(supabase, videoFile, "hero-video");
    } catch {
      return { error: "Não foi possível enviar o vídeo do hero." };
    }
  }

  const posterFile = formData.get("heroPoster") as File | null;
  if (posterFile && posterFile.size > 0) {
    try {
      update.hero_fallback_image = await uploadSiteMedia(supabase, posterFile, "hero-poster");
    } catch {
      return { error: "Não foi possível enviar a imagem de capa." };
    }
  }

  const { error } = await supabase.from("site_settings").update(update).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
