import { createClient } from "@supabase/supabase-js";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { storeSettings, sizeGuide, sizeGuideMasculino } from "../src/data/store-settings";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no ambiente."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function uploadAsset(bucket: string, path: string, url: string, contentType: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function seedCategories() {
  console.log(`Categorias: ${categories.length}`);
  const rows = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    image: c.image,
    order: c.order,
    active: true,
  }));
  const { error } = await supabase
    .from("categories")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw error;
}

async function seedSizeGuides() {
  console.log("Guia de tamanhos");
  const { error: delErr } = await supabase
    .from("size_guides")
    .delete()
    .neq("size", "__never__");
  if (delErr) throw delErr;

  const rows = [
    ...sizeGuide.map((r, i) => ({
      gender: "feminino" as const,
      size: r.size,
      busto: r.busto,
      cintura: r.cintura,
      quadril: r.quadril,
      position: i,
    })),
    ...sizeGuideMasculino.map((r, i) => ({
      gender: "masculino" as const,
      size: r.size,
      busto: r.busto,
      cintura: r.cintura,
      quadril: r.quadril,
      position: i,
    })),
  ];
  const { error } = await supabase.from("size_guides").insert(rows);
  if (error) throw error;
}

async function seedSiteSettings() {
  console.log("Configurações da loja + mídia do hero");

  const posterUrl = await uploadAsset(
    "site-media",
    "hero-poster.jpg",
    "http://localhost:3000/hero-poster.jpg",
    "image/jpeg"
  );
  const videoUrl = await uploadAsset(
    "site-media",
    "hero-video.mp4",
    storeSettings.heroVideoUrl!,
    "video/mp4"
  );

  const { error } = await supabase
    .from("site_settings")
    .update({
      name: storeSettings.name,
      tagline: storeSettings.tagline,
      whatsapp_number: storeSettings.whatsappNumber,
      whatsapp_default_message: storeSettings.whatsappDefaultMessage,
      instagram: storeSettings.instagram,
      address: storeSettings.address,
      hours: storeSettings.hours,
      hero_video_url: videoUrl,
      hero_fallback_image: posterUrl,
      hero_title: storeSettings.heroTitle,
      hero_subtitle: storeSettings.heroSubtitle,
      hero_button_label: storeSettings.heroButtonLabel,
    })
    .eq("id", 1);
  if (error) throw error;
}

async function seedProducts() {
  console.log(`Produtos: ${products.length}`);

  const { data: dbCategories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug");
  if (catErr) throw catErr;
  const categoryIdBySlug = new Map(dbCategories.map((c) => [c.slug, c.id]));

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug) ?? null;

    const { data: productRow, error: prodErr } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          reference: product.reference,
          category_id: categoryId,
          price: product.price,
          promo_price: product.promoPrice ?? null,
          description: product.description,
          composition: product.composition ?? null,
          is_new: product.isNew,
          is_featured: product.isFeatured,
          active: product.active,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (prodErr) throw prodErr;
    const productId = productRow.id as string;

    // Idempotent: wipe and reinsert child rows for this product.
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_variants").delete().eq("product_id", productId);
    await supabase.from("product_colors").delete().eq("product_id", productId);
    await supabase.from("product_sizes").delete().eq("product_id", productId);

    const { error: imgErr } = await supabase.from("product_images").insert(
      product.images.map((img, i) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt,
        position: i,
      }))
    );
    if (imgErr) throw imgErr;

    const { data: colorRows, error: colorErr } = await supabase
      .from("product_colors")
      .insert(
        product.colors.map((c, i) => ({
          product_id: productId,
          name: c.name,
          hex: c.hex,
          position: i,
        }))
      )
      .select("id, name");
    if (colorErr) throw colorErr;
    const colorIdByLocalId = new Map(
      product.colors.map((c, i) => [c.id, colorRows[i].id as string])
    );

    const { data: sizeRows, error: sizeErr } = await supabase
      .from("product_sizes")
      .insert(
        product.sizes.map((s, i) => ({
          product_id: productId,
          label: s.label,
          position: i,
        }))
      )
      .select("id, label");
    if (sizeErr) throw sizeErr;
    const sizeIdByLocalId = new Map(
      product.sizes.map((s, i) => [s.id, sizeRows[i].id as string])
    );

    const { error: variantErr } = await supabase.from("product_variants").insert(
      product.variants.map((v) => ({
        product_id: productId,
        color_id: v.colorId ? colorIdByLocalId.get(v.colorId) ?? null : null,
        size_id: sizeIdByLocalId.get(v.sizeId)!,
        available: v.available,
      }))
    );
    if (variantErr) throw variantErr;

    console.log(`  ✓ ${product.name}`);
  }
}

async function main() {
  await seedCategories();
  await seedSizeGuides();
  await seedSiteSettings();
  await seedProducts();
  console.log("Seed concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
