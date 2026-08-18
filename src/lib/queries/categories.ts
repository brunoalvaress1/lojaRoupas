import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Category } from "@/types";

function mapCategory(c: {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  order: number;
  active: boolean;
}): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    image: c.image ?? "",
    order: c.order,
    active: c.active,
  };
}

/**
 * Admin-only: session-bound client so RLS's `is_admin()` clause also
 * returns inactive categories. Using this in a public page forces
 * per-request dynamic rendering — use getPublicCategories there instead.
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data.map(mapCategory);
});

/**
 * Public storefront + generateStaticParams/sitemap.ts: anon client, only
 * active categories, no `cookies()` dependency so the page can be
 * statically cached and revalidated on demand.
 */
export const getPublicCategories = cache(async (): Promise<Category[]> => {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data.map(mapCategory);
});
