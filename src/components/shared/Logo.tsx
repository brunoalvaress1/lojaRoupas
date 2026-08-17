import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 1280 / 927;

export function Logo({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/logo-fluflu-modas.jpeg"
      alt="Lá Flu Flu Modas"
      width={Math.round(height * ASPECT)}
      height={height}
      className={cn("rounded object-cover", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}
