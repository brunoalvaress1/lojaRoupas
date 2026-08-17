import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { storeSettings } from "@/data/store-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${storeSettings.name} — ${storeSettings.tagline}`,
    template: `%s | ${storeSettings.name}`,
  },
  description:
    "Loja de roupas premium. Descubra a coleção e monte seu pedido diretamente pelo WhatsApp.",
  openGraph: {
    title: storeSettings.name,
    description: storeSettings.tagline,
    images: [storeSettings.heroFallbackImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
