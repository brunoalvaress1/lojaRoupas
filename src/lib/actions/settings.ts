"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export interface SettingsFormState {
  error?: string;
  success?: boolean;
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

  const heroVideoUrl = String(formData.get("heroVideoUrl") ?? "").trim();
  if (heroVideoUrl) update.hero_video_url = heroVideoUrl;

  const heroPosterUrl = String(formData.get("heroPosterUrl") ?? "").trim();
  if (heroPosterUrl) update.hero_fallback_image = heroPosterUrl;

  const { error } = await supabase.from("site_settings").update(update).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
