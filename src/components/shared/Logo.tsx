import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 1536 / 1024;
const ICON_ASPECT = 600 / 228;

export function Logo({
  className,
  height = 40,
  variant = "full",
}: {
  className?: string;
  height?: number;
  /** "icon" shows only the crown symbol, without the store name lockup. */
  variant?: "full" | "icon";
}) {
  const isIcon = variant === "icon";
  return (
    <Image
      src={isIcon ? "/logo-fluflu-crown.png" : "/logo-fluflu-modas.png"}
      alt="Flu Flu Modas"
      width={Math.round(height * (isIcon ? ICON_ASPECT : ASPECT))}
      height={height}
      className={cn("object-contain", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}
