import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Product } from "@/types";

const PRODUCT_SELECT =
  "*, categories(slug), product_images(*), product_colors(*), product_sizes(*), product_variants(*)";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category_id: string | null;
  price: number;
  promo_price: number | null;
  description: string | null;
  composition: string | null;
  is_new: boolean;
  is_featured: boolean;
  active: boolean;
  created_at: string;
  categories: { slug: string } | null;
  product_images: { url: string; alt: string | null; position: number; color_id: string | null }[];
  product_colors: { id: string; name: string; hex: string; position: number }[];
  product_sizes: { id: string; label: string; position: number }[];
  product_variants: {
    color_id: string | null;
    size_id: string;
    available: boolean;
  }[];
}

function mapProduct(row: ProductRow): Product {
  const images = [...row.product_images]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ url: i.url, alt: i.alt ?? row.name, colorId: i.color_id }));
  const colors = [...row.product_colors]
    .sort((a, b) => a.position - b.position)
    .map((c) => ({ id: c.id, name: c.name, hex: c.hex }));
  const sizes = [...row.product_sizes]
    .sort((a, b) => a.position - b.position)
    .map((s) => ({ id: s.id, label: s.label }));
  const variants = row.product_variants.map((v) => ({
    colorId: v.color_id,
    sizeId: v.size_id,
    available: v.available,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    reference: row.reference,
    categorySlug: row.categories?.slug ?? "",
    price: Number(row.price),
    promoPrice: row.promo_price != null ? Number(row.promo_price) : undefined,
    description: row.description ?? "",
    composition: row.composition ?? undefined,
    images,
    colors,
    sizes,
    variants,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    active: row.active,
    createdAt: row.created_at,
  };
}

/**
 * Admin-only: uses the session-bound client so RLS's `is_admin()` clause
 * also returns inactive/draft products. Never use this for public pages —
 * it forces the route into per-request dynamic rendering.
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapProduct);
});

/** Admin-only equivalent of getProductBySlug — see getProducts note. */
export const getProductById = cache(async (id: string): Promise<Product | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapProduct(data as unknown as ProductRow);
});

/**
 * Public storefront: anon client, only ever sees active products (RLS),
 * and carries no `cookies()` dependency so the page can be statically
 * cached and revalidated on demand instead of re-fetched every request.
 */
export const getPublicProducts = cache(async (): Promise<Product[]> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapProduct);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapProduct(data as unknown as ProductRow);
  }
);

/**
 * For generateStaticParams / sitemap.ts — these run at build time with no
 * incoming request, so the cookie-based server client isn't available.
 */
export async function getProductSlugsStatic(): Promise<
  { slug: string; createdAt: string }[]
> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("active", true);

  if (error) throw error;
  return data.map((p) => ({ slug: p.slug, createdAt: p.created_at }));
}
