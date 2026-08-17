import type { Product, ProductColor } from "@/types";

export function isVariantAvailable(
  product: Product,
  colorId: string,
  sizeId: string
) {
  const variant = product.variants.find(
    (v) => v.colorId === colorId && v.sizeId === sizeId
  );
  return variant?.available ?? false;
}

export function getProductStock(product: Product) {
  return product.variants.some((v) => v.available);
}

export function getAllColors(products: Product[]): ProductColor[] {
  const map = new Map<string, ProductColor>();
  for (const product of products) {
    for (const color of product.colors) {
      const key = `${color.name}:${color.hex}`;
      if (!map.has(key)) map.set(key, color);
    }
  }
  return Array.from(map.values());
}

const SIZE_ORDER = ["P", "M", "G", "GG", "Único"];

export function getAllSizeLabels(products: Product[]): string[] {
  const labels = new Set<string>();
  for (const product of products) {
    for (const size of product.sizes) labels.add(size.label);
  }
  return Array.from(labels).sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
