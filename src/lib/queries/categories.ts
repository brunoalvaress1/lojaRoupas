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

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data.map(mapCategory);
});

/** For generateStaticParams / sitemap.ts — no request context at build time. */
export async function getCategoriesStatic(): Promise<Category[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data.map(mapCategory);
}
