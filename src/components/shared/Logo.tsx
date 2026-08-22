import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 1536 / 1024;
const ICON_ASPECT = 600 / 228;
const BLACK_BG_ASPECT = 1280 / 927;

const LOGO_SRC = {
  full: "/logo-fluflu-modas.png",
  icon: "/logo-fluflu-crown.png",
  "black-bg": "/logo-fundo-preto.jpeg",
} as const;

const LOGO_ASPECT = {
  full: ASPECT,
  icon: ICON_ASPECT,
  "black-bg": BLACK_BG_ASPECT,
} as const;

export function Logo({
  className,
  height = 40,
  variant = "full",
}: {
  className?: string;
  height?: number;
  /**
   * "icon" shows only the crown symbol, without the store name lockup.
   * "black-bg" is the lockup with its own black background, for use on dark nav/footer bars.
   */
  variant?: "full" | "icon" | "black-bg";
}) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="La Flu Flu Modas"
      width={Math.round(height * LOGO_ASPECT[variant])}
      height={height}
      className={cn("object-contain", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}
