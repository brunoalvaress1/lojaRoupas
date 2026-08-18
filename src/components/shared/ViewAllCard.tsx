import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewAllCard({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex aspect-[3/4] flex-col items-center justify-center gap-3 border border-border bg-muted/40 text-center transition-colors hover:bg-muted",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 transition-colors group-hover:border-foreground">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
      </span>
      <span className="text-xs font-medium uppercase tracking-widest-xs">{label}</span>
    </Link>
  );
}
