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
  colorId: string;
  sizeId: string;
  available: boolean;
  stock: number;
}

export interface ProductImage {
  url: string;
  alt: string;
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
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  image: string;
  colorId: string;
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
