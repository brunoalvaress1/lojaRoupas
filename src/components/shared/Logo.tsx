import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 1536 / 1024;

export function Logo({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/logo-fluflu-modas.png"
      alt="Flu Flu Modas"
      width={Math.round(height * ASPECT)}
      height={height}
      className={cn("object-contain", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}
