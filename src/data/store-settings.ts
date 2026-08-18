import type { SizeGuideRow, StoreSettings } from "@/types";

export const storeSettings: StoreSettings = {
  name: "Flu Flu Modas",
  tagline: "Vista sua essência.",
  whatsappNumber: "5511999999999",
  whatsappDefaultMessage:
    "Olá! Gostaria de verificar a disponibilidade dessas peças.",
  instagram: "@la_fluflu_modas",
  address: "Av. Carlos Botelho, 1802 — Centro, São Carlos/SP",
  hours: "Seg a Sáb, das 10h às 20h",
  heroVideoUrl:
    "https://dtipzqbeuueiultgcorj.supabase.co/storage/v1/object/public/site-media/hero-video.mp4?v=2",
  heroFallbackImage:
    "https://dtipzqbeuueiultgcorj.supabase.co/storage/v1/object/public/site-media/hero-fallback.jpg?v=2",
  heroTitle: "Estilo que te representa.",
  heroSubtitle: "Mais que moda, uma experiência.",
  heroButtonLabel: "CONHEÇA A COLEÇÃO",
};

export const sizeGuide: SizeGuideRow[] = [
  { size: "P", busto: "86 cm", cintura: "68 cm", quadril: "94 cm" },
  { size: "M", busto: "92 cm", cintura: "74 cm", quadril: "100 cm" },
  { size: "G", busto: "98 cm", cintura: "80 cm", quadril: "106 cm" },
  { size: "GG", busto: "104 cm", cintura: "86 cm", quadril: "112 cm" },
];

export const sizeGuideMasculino: SizeGuideRow[] = [
  { size: "P", busto: "92 cm", cintura: "76 cm", quadril: "96 cm" },
  { size: "M", busto: "98 cm", cintura: "82 cm", quadril: "102 cm" },
  { size: "G", busto: "104 cm", cintura: "88 cm", quadril: "108 cm" },
  { size: "GG", busto: "110 cm", cintura: "94 cm", quadril: "114 cm" },
];
