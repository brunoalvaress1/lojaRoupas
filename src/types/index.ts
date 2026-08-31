export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSize {
  id: string;
  label: string;
}

export interface ProductVariant {
  /** null when the product has no color options at all. */
  colorId: string | null;
  sizeId: string;
  available: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  /** Color this photo belongs to; null/undefined means it shows for every color. */
  colorId?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  categorySlug: string;
  price: number;
  promoPrice?: number;
  description: string;
  composition?: string;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  isNew: boolean;
  isFeatured: boolean;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  image: string;
  colorId: string | null;
  colorName: string;
  sizeId: string;
  sizeLabel: string;
  price: number;
  quantity: number;
}

export interface SizeGuideRow {
  size: string;
  busto: string;
  cintura: string;
  quadril: string;
}

export interface StoreSettings {
  name: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  instagram: string;
  address: string;
  hours: string;
  heroVideoUrl?: string;
  heroFallbackImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonLabel: string;
}
