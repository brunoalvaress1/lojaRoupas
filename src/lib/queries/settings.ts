import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SizeGuideRow, StoreSettings } from "@/types";

export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;

  return {
    name: data.name,
    tagline: data.tagline,
    whatsappNumber: data.whatsapp_number,
    whatsappDefaultMessage: data.whatsapp_default_message,
    instagram: data.instagram,
    address: data.address,
    hours: data.hours,
    heroVideoUrl: data.hero_video_url ?? undefined,
    heroFallbackImage: data.hero_fallback_image ?? "",
    heroTitle: data.hero_title,
    heroSubtitle: data.hero_subtitle,
    heroButtonLabel: data.hero_button_label,
  };
});

export const getSizeGuide = cache(
  async (gender: "feminino" | "masculino"): Promise<SizeGuideRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("size_guides")
      .select("*")
      .eq("gender", gender)
      .order("position", { ascending: true });

    if (error) throw error;

    return data.map((r) => ({
      size: r.size,
      busto: r.busto ?? "",
      cintura: r.cintura ?? "",
      quadril: r.quadril ?? "",
    }));
  }
);
