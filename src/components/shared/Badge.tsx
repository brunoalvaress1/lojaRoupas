import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "dark",
  className,
}: {
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
  className?: string;
}) {
  const variants = {
    dark: "bg-accent text-accent-foreground",
    light: "bg-surface text-foreground",
    outline: "border border-foreground/30 text-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
