import { cache } from "react";
import { createStaticClient } from "@/lib/supabase/static";
import type { SizeGuideRow, StoreSettings } from "@/types";

/**
 * site_settings and size_guides are public for every role (RLS: `using
 * (true)`), so these never need the cookie-bound session client. Using the
 * anon client here keeps these pages free of `cookies()`, which lets
 * Next.js cache/statically render them instead of re-fetching on every
 * request — admin edits still show up immediately because the settings
 * and product Server Actions call `revalidatePath()` on save.
 */
export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  const supabase = createStaticClient();
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
    const supabase = createStaticClient();
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
