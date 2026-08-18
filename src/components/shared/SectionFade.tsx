import { cn } from "@/lib/utils";

/** Transitional strip that blends a full-bleed dark section into the page's
 * light background (or vice-versa), so dark/light sections meet gradually
 * instead of a hard cut. */
export function SectionFade({
  variant = "toLight",
  className,
}: {
  variant?: "toLight" | "toDark";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-14 w-full sm:h-20",
        variant === "toLight"
          ? "bg-gradient-to-b from-black to-background"
          : "bg-gradient-to-b from-background to-black",
        className
      )}
    />
  );
}
