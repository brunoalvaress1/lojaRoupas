import type { Product, ProductColor, ProductSize, ProductVariant } from "@/types";

export const SIZES: ProductSize[] = [
  { id: "p", label: "P" },
  { id: "m", label: "M" },
  { id: "g", label: "G" },
  { id: "gg", label: "GG" },
];

const COLOR_LIBRARY: Record<string, ProductColor> = {
  preto: { id: "preto", name: "Preto", hex: "#17140f" },
  bege: { id: "bege", name: "Bege", hex: "#cdb79a" },
  verde: { id: "verde", name: "Verde", hex: "#4b5c47" },
  offwhite: { id: "offwhite", name: "Off White", hex: "#f2ede3" },
  marinho: { id: "marinho", name: "Marinho", hex: "#26324a" },
  terracota: { id: "terracota", name: "Terracota", hex: "#b5603f" },
};

function buildVariants(
  colorIds: string[],
  sizeIds: string[],
  unavailable: string[] = []
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const colorId of colorIds) {
    for (const sizeId of sizeIds) {
      const key = `${colorId}:${sizeId}`;
      const available = !unavailable.includes(key);
      variants.push({
        colorId,
        sizeId,
        available,
        stock: available ? 8 : 0,
      });
    }
  }
  return variants;
}

const ALL_SIZES = SIZES.map((s) => s.id);

export const products: Product[] = [
  {
    id: "prod-blusa-ombro-unico",
    slug: "blusa-ombro-unico-preto",
    name: "Blusa Ombro Único",
    reference: "BLU-00123",
    categorySlug: "blusas",
    price: 129.9,
    description:
      "Blusa de ombro único em malha canelada, caimento justo e acabamento premium. Peça versátil para produções do dia ao noite.",
    composition: "90% Viscose, 10% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Ombro Único vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Ombro Único detalhe",
      },
      {
        url: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Ombro Único vista lateral",
      },
    ],
    colors: [COLOR_LIBRARY.preto, COLOR_LIBRARY.bege, COLOR_LIBRARY.terracota],
    sizes: SIZES,
    variants: buildVariants(["preto", "bege", "terracota"], ALL_SIZES, [
      "preto:gg",
    ]),
    isNew: true,
    isFeatured: true,
    active: true,
    createdAt: "2026-08-01",
  },
  {
    id: "prod-blusa-manga-bufante",
    slug: "blusa-manga-bufante-offwhite",
    name: "Blusa Manga Bufante",
    reference: "BLU-00098",
    categorySlug: "blusas",
    price: 169.9,
    promoPrice: 149.9,
    description:
      "Blusa com mangas bufantes e gola laço, tecido leve e fluido, ideal para looks românticos e sofisticados.",
    composition: "100% Viscose",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Manga Bufante vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Manga Bufante detalhe manga",
      },
    ],
    colors: [COLOR_LIBRARY.offwhite, COLOR_LIBRARY.preto],
    sizes: SIZES,
    variants: buildVariants(["offwhite", "preto"], ALL_SIZES),
    isNew: false,
    isFeatured: true,
    active: true,
    createdAt: "2026-06-11",
  },
  {
    id: "prod-blusa-cropped",
    slug: "blusa-cropped-canelada-marinho",
    name: "Blusa Cropped Canelada",
    reference: "BLU-00145",
    categorySlug: "blusas",
    price: 119.9,
    description: "Cropped em malha canelada com gola careca. Básico essencial para compor looks casuais.",
    composition: "95% Algodão, 5% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Cropped vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&q=80&auto=format&fit=crop",
        alt: "Blusa Cropped detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.marinho, COLOR_LIBRARY.preto, COLOR_LIBRARY.offwhite],
    sizes: SIZES,
    variants: buildVariants(["marinho", "preto", "offwhite"], ALL_SIZES, [
      "marinho:p",
    ]),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-05-20",
  },
  {
    id: "prod-vestido-midi",
    slug: "vestido-midi-canelado-preto",
    name: "Vestido Midi Canelado",
    reference: "VST-023",
    categorySlug: "vestidos",
    price: 189.9,
    description:
      "Vestido midi em malha canelada com fenda lateral discreta. Caimento acinturado que valoriza a silhueta.",
    composition: "92% Viscose, 8% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80&auto=format&fit=crop",
        alt: "Vestido Midi Canelado vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=1000&q=80&auto=format&fit=crop",
        alt: "Vestido Midi Canelado detalhe tecido",
      },
      {
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80&auto=format&fit=crop",
        alt: "Vestido Midi Canelado vista lateral",
      },
    ],
    colors: [COLOR_LIBRARY.preto, COLOR_LIBRARY.bege, COLOR_LIBRARY.verde],
    sizes: SIZES,
    variants: buildVariants(["preto", "bege", "verde"], ALL_SIZES, [
      "preto:g",
      "verde:gg",
    ]),
    isNew: true,
    isFeatured: true,
    active: true,
    createdAt: "2026-08-05",
  },
  {
    id: "prod-vestido-longo",
    slug: "vestido-longo-fluido-verde",
    name: "Vestido Longo Fluido",
    reference: "VST-011",
    categorySlug: "vestidos",
    price: 219.9,
    description: "Vestido longo em tecido fluido com decote V e amarração na cintura.",
    composition: "100% Viscose",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=1000&q=80&auto=format&fit=crop",
        alt: "Vestido Longo Fluido vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80&auto=format&fit=crop",
        alt: "Vestido Longo Fluido detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.verde, COLOR_LIBRARY.marinho],
    sizes: SIZES,
    variants: buildVariants(["verde", "marinho"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-04-02",
  },
  {
    id: "prod-conjunto-linho",
    slug: "conjunto-linho-bege",
    name: "Conjunto Linho",
    reference: "CNJ-007",
    categorySlug: "conjuntos",
    price: 219.9,
    description: "Conjunto blazer e calça em linho, corte reto e acabamento alfaiatado.",
    composition: "70% Linho, 30% Viscose",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=1000&q=80&auto=format&fit=crop",
        alt: "Conjunto Linho vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=80&auto=format&fit=crop",
        alt: "Conjunto Linho detalhe blazer",
      },
    ],
    colors: [COLOR_LIBRARY.bege, COLOR_LIBRARY.offwhite],
    sizes: SIZES,
    variants: buildVariants(["bege", "offwhite"], ALL_SIZES, ["offwhite:gg"]),
    isNew: true,
    isFeatured: true,
    active: true,
    createdAt: "2026-07-28",
  },
  {
    id: "prod-blazer-alfaiataria",
    slug: "blazer-alfaiataria-marinho",
    name: "Blazer Alfaiataria",
    reference: "BLZ-014",
    categorySlug: "conjuntos",
    price: 299.9,
    description: "Blazer estruturado em alfaiataria, forro interno e botões emborrachados.",
    composition: "68% Poliéster, 30% Viscose, 2% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=1000&q=80&auto=format&fit=crop",
        alt: "Blazer Alfaiataria vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&q=80&auto=format&fit=crop",
        alt: "Blazer Alfaiataria detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.marinho, COLOR_LIBRARY.preto],
    sizes: SIZES,
    variants: buildVariants(["marinho", "preto"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-03-14",
  },
  {
    id: "prod-calca-alfaiataria",
    slug: "calca-alfaiataria-bege",
    name: "Calça Alfaiataria",
    reference: "CAL-00086",
    categorySlug: "calcas",
    price: 199.9,
    description: "Calça de alfaiataria com pence frontal, cintura alta e caimento reto.",
    composition: "75% Poliéster, 23% Viscose, 2% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80&auto=format&fit=crop",
        alt: "Calça Alfaiataria vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80&auto=format&fit=crop",
        alt: "Calça Alfaiataria detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.bege, COLOR_LIBRARY.preto, COLOR_LIBRARY.marinho],
    sizes: SIZES,
    variants: buildVariants(["bege", "preto", "marinho"], ALL_SIZES, [
      "marinho:p",
      "marinho:m",
    ]),
    isNew: false,
    isFeatured: true,
    active: true,
    createdAt: "2026-05-30",
  },
  {
    id: "prod-calca-wide-leg",
    slug: "calca-wide-leg-preto",
    name: "Calça Wide Leg",
    reference: "CAL-00102",
    categorySlug: "calcas",
    price: 179.9,
    description: "Calça pantalona de perna larga, tecido com caimento fluido e cós elástico.",
    composition: "96% Poliéster, 4% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80&auto=format&fit=crop",
        alt: "Calça Wide Leg vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1000&q=80&auto=format&fit=crop",
        alt: "Calça Wide Leg detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.preto, COLOR_LIBRARY.offwhite],
    sizes: SIZES,
    variants: buildVariants(["preto", "offwhite"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-02-18",
  },
  {
    id: "prod-saia-midi-plissada",
    slug: "saia-midi-plissada-verde",
    name: "Saia Midi Plissada",
    reference: "SAI-00041",
    categorySlug: "saias",
    price: 149.9,
    description: "Saia midi plissada com cós alto, tecido leve e caimento com movimento.",
    composition: "100% Poliéster",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1000&q=80&auto=format&fit=crop",
        alt: "Saia Midi Plissada vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=1000&q=80&auto=format&fit=crop",
        alt: "Saia Midi Plissada detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.verde, COLOR_LIBRARY.bege],
    sizes: SIZES,
    variants: buildVariants(["verde", "bege"], ALL_SIZES, ["verde:p"]),
    isNew: true,
    isFeatured: false,
    active: true,
    createdAt: "2026-07-15",
  },
  {
    id: "prod-camisa-social",
    slug: "camisa-social-offwhite",
    name: "Camisa Social",
    reference: "CAM-00077",
    categorySlug: "camisas",
    price: 159.9,
    description: "Camisa social em tricoline, corte reto e acabamento impecável.",
    composition: "100% Algodão",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80&auto=format&fit=crop",
        alt: "Camisa Social vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000&q=80&auto=format&fit=crop",
        alt: "Camisa Social detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.offwhite, COLOR_LIBRARY.preto],
    sizes: SIZES,
    variants: buildVariants(["offwhite", "preto"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-03-30",
  },
  {
    id: "prod-regata-canelada",
    slug: "regata-canelada-bege",
    name: "Regata Canelada",
    reference: "REG-00033",
    categorySlug: "blusas",
    price: 88.9,
    description: "Regata básica em malha canelada, alcinha regulável e caimento justo.",
    composition: "94% Viscose, 6% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&q=80&auto=format&fit=crop",
        alt: "Regata Canelada vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=80&auto=format&fit=crop",
        alt: "Regata Canelada detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.bege, COLOR_LIBRARY.preto, COLOR_LIBRARY.offwhite],
    sizes: SIZES,
    variants: buildVariants(["bege", "preto", "offwhite"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-01-22",
  },
  {
    id: "prod-shorts-alfaiataria",
    slug: "shorts-alfaiataria-preto",
    name: "Shorts Alfaiataria",
    reference: "SHT-00019",
    categorySlug: "shorts",
    price: 109.9,
    description: "Shorts de alfaiataria com pence frontal e cós em elástico na parte traseira.",
    composition: "75% Poliéster, 23% Viscose, 2% Elastano",
    images: [
      {
        url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=80&auto=format&fit=crop",
        alt: "Shorts Alfaiataria vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=1000&q=80&auto=format&fit=crop",
        alt: "Shorts Alfaiataria detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.preto, COLOR_LIBRARY.bege],
    sizes: SIZES,
    variants: buildVariants(["preto", "bege"], ALL_SIZES),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2026-02-05",
  },
  {
    id: "prod-conjunto-tricot",
    slug: "conjunto-tricot-terracota",
    name: "Conjunto Tricot",
    reference: "CNJ-00061",
    categorySlug: "conjuntos",
    price: 249.9,
    description: "Conjunto de tricot com blusa canelada e saia midi, textura macia e aconchegante.",
    composition: "60% Algodão, 40% Poliéster",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=1000&q=80&auto=format&fit=crop",
        alt: "Conjunto Tricot vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80&auto=format&fit=crop",
        alt: "Conjunto Tricot detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.terracota, COLOR_LIBRARY.offwhite],
    sizes: SIZES,
    variants: buildVariants(["terracota", "offwhite"], ALL_SIZES, [
      "terracota:gg",
    ]),
    isNew: true,
    isFeatured: false,
    active: true,
    createdAt: "2026-08-10",
  },
  {
    id: "prod-brinco-dourado",
    slug: "brinco-argola-dourado",
    name: "Brinco Argola",
    reference: "ACS-00204",
    categorySlug: "acessorios",
    price: 59.9,
    description: "Brinco em formato de argola banhado a ouro, fecho de pressão.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&q=80&auto=format&fit=crop",
        alt: "Brinco Argola vista frontal",
      },
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1000&q=80&auto=format&fit=crop",
        alt: "Brinco Argola detalhe",
      },
    ],
    colors: [COLOR_LIBRARY.bege],
    sizes: [{ id: "unico", label: "Único" }],
    variants: buildVariants(["bege"], ["unico"]),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2025-12-01",
  },
  {
    id: "prod-cinto-couro",
    slug: "cinto-couro-preto",
    name: "Cinto de Couro",
    reference: "ACS-00187",
    categorySlug: "acessorios",
    price: 79.9,
    description: "Cinto em couro legítimo com fivela metálica, acabamento artesanal.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1000&q=80&auto=format&fit=crop",
        alt: "Cinto de Couro vista frontal",
      },
    ],
    colors: [COLOR_LIBRARY.preto, COLOR_LIBRARY.terracota],
    sizes: [{ id: "unico", label: "Único" }],
    variants: buildVariants(["preto", "terracota"], ["unico"]),
    isNew: false,
    isFeatured: false,
    active: true,
    createdAt: "2025-11-15",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug && product.active);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter(
    (product) => product.categorySlug === categorySlug && product.active
  );
}

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

export function getAllColors() {
  const map = new Map<string, ProductColor>();
  for (const product of products) {
    for (const color of product.colors) {
      if (!map.has(color.id)) map.set(color.id, color);
    }
  }
  return Array.from(map.values());
}
