import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  promoPrice,
  size = "md",
  className,
}: {
  price: number;
  promoPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  if (promoPrice && promoPrice < price) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className={cn(sizes[size], "font-medium")}>
          {formatPrice(promoPrice)}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(price)}
        </span>
      </div>
    );
  }

  return (
    <span className={cn(sizes[size], "font-medium", className)}>
      {formatPrice(price)}
    </span>
  );
}
