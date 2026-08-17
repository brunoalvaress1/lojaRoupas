import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const BASE_URL = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const productRoutes = products
    .filter((p) => p.active)
    .map((p) => ({
      url: `${BASE_URL}/produto/${p.slug}`,
      lastModified: new Date(p.createdAt),
    }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/colecao?categoria=${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
