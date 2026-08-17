import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Price } from "@/components/shared/Price";
import { Badge } from "@/components/shared/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { getProductStock } from "@/data/products";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const inStock = getProductStock(product);
  const secondImage = product.images[1] ?? product.images[0];
  const category = categories.find((c) => c.slug === product.categorySlug);

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
          />
          <Image
            src={secondImage.url}
            alt={secondImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute inset-0 hidden object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 md:block"
          />
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="dark">Novo</Badge>}
          {product.isFeatured && <Badge variant="light">Destaque</Badge>}
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge variant="outline" className="bg-background">
              Esgotado
            </Badge>
          </div>
        )}

        <FavoriteButton
          productId={product.id}
          className="absolute right-3 top-3 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
        />

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center bg-background/95 py-2.5 text-[11px] font-medium uppercase tracking-widest-xs text-foreground transition-transform duration-300 ease-out group-hover:translate-y-0 md:flex">
          Ver produto
        </div>
      </div>

      <div className={cn("mt-3 space-y-1", !inStock && "opacity-50")}>
        {category && (
          <p className="text-[11px] uppercase tracking-widest-xs text-muted-foreground">
            {category.name}
          </p>
        )}
        <h3 className="text-sm text-foreground/90">{product.name}</h3>
        <Price price={product.price} promoPrice={product.promoPrice} size="sm" />
      </div>
    </Link>
  );
}
