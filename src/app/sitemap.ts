import type { MetadataRoute } from "next";
import { getProductSlugsStatic } from "@/lib/queries/products";
import { getCategoriesStatic } from "@/lib/queries/categories";

const BASE_URL = "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProductSlugsStatic(),
    getCategoriesStatic(),
  ]);

  const staticRoutes = [
    "",
    "/colecao",
    "/categorias",
    "/favoritos",
    "/carrinho",
    "/sobre",
    "/contato",
    "/trocas",
    "/guia-de-tamanhos",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/produto/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/colecao?categoria=${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
