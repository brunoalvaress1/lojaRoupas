"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

interface ColorInput {
  tempId: string;
  name: string;
  hex: string;
}
interface SizeInput {
  tempId: string;
  label: string;
}
interface VariantInput {
  colorTempId: string;
  sizeTempId: string;
  available: boolean;
  stock: number;
}
interface ExistingImage {
  url: string;
  alt: string;
  colorTempId: string | null;
}

export interface ProductFormState {
  error?: string;
}

function parseJson<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function uploadProductImage(
  supabase: SupabaseServer,
  productId: string,
  file: File
) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

async function replaceChildren(
  supabase: SupabaseServer,
  productId: string,
  formData: FormData,
  keepImages: ExistingImage[]
) {
  const colors = parseJson<ColorInput[]>(formData, "colorsJson", []);
  const sizes = parseJson<SizeInput[]>(formData, "sizesJson", []);
  const variants = parseJson<VariantInput[]>(formData, "variantsJson", []);
  const newImageFiles = formData.getAll("newImages").filter(
    (f): f is File => f instanceof File && f.size > 0
  );
  const newImageColorTempIds = formData.getAll("newImagesColorTempId").map(String);

  await supabase.from("product_images").delete().eq("product_id", productId);
  await supabase.from("product_variants").delete().eq("product_id", productId);
  await supabase.from("product_colors").delete().eq("product_id", productId);
  await supabase.from("product_sizes").delete().eq("product_id", productId);

  const colorIdByTempId = new Map<string, string>();
  if (colors.length > 0) {
    const { data: colorRows, error: colorErr } = await supabase
      .from("product_colors")
      .insert(
        colors.map((c, i) => ({
          product_id: productId,
          name: c.name,
          hex: c.hex,
          position: i,
        }))
      )
      .select("id");
    if (colorErr) throw colorErr;
    colors.forEach((c, i) => colorIdByTempId.set(c.tempId, colorRows[i].id as string));
  }

  const uploadedUrls = await Promise.all(
    newImageFiles.map((file) => uploadProductImage(supabase, productId, file))
  );
  const allImages = [
    ...keepImages,
    ...uploadedUrls.map((url, i) => ({
      url,
      alt: "",
      colorTempId: newImageColorTempIds[i] || null,
    })),
  ];
  if (allImages.length > 0) {
    const { error } = await supabase.from("product_images").insert(
      allImages.map((img, i) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt || null,
        position: i,
        color_id: img.colorTempId ? colorIdByTempId.get(img.colorTempId) ?? null : null,
      }))
    );
    if (error) throw error;
  }

  const sizeIdByTempId = new Map<string, string>();
  if (sizes.length > 0) {
    const { data: sizeRows, error: sizeErr } = await supabase
      .from("product_sizes")
      .insert(
        sizes.map((s, i) => ({
          product_id: productId,
          label: s.label,
          position: i,
        }))
      )
      .select("id");
    if (sizeErr) throw sizeErr;
    sizes.forEach((s, i) => sizeIdByTempId.set(s.tempId, sizeRows[i].id as string));
  }

  const variantRows = variants
    .map((v) => ({
      product_id: productId,
      color_id: colorIdByTempId.get(v.colorTempId),
      size_id: sizeIdByTempId.get(v.sizeTempId),
      available: v.available,
      stock: v.stock,
    }))
    .filter((v): v is typeof v & { color_id: string; size_id: string } =>
      Boolean(v.color_id && v.size_id)
    );

  if (variantRows.length > 0) {
    const { error: variantErr } = await supabase
      .from("product_variants")
      .insert(variantRows);
    if (variantErr) throw variantErr;
  }
}

function readBaseFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    reference: String(formData.get("reference") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "") || null,
    price: Number(formData.get("price") ?? 0),
    promoPrice: formData.get("promoPrice")
      ? Number(formData.get("promoPrice"))
      : null,
    description: String(formData.get("description") ?? ""),
    composition: String(formData.get("composition") ?? "") || null,
    isNew: formData.get("isNew") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    active: formData.get("active") === "on",
  };
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const fields = readBaseFields(formData);

  if (!fields.name || !fields.reference || !fields.price) {
    return { error: "Preencha nome, referência e preço." };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: fields.name,
      slug: slugify(`${fields.name}-${fields.reference}`),
      reference: fields.reference,
      category_id: fields.categoryId,
      price: fields.price,
      promo_price: fields.promoPrice,
      description: fields.description,
      composition: fields.composition,
      is_new: fields.isNew,
      is_featured: fields.isFeatured,
      active: fields.active,
    })
    .select("id")
    .single();

  if (error || !product) {
    return {
      error:
        error?.code === "23505"
          ? "Já existe um produto com essa referência."
          : error?.message ?? "Não foi possível criar o produto.",
    };
  }

  try {
    await replaceChildren(supabase, product.id, formData, []);
  } catch {
    return { error: "Produto criado, mas houve erro ao salvar imagens/variações." };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/colecao");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const fields = readBaseFields(formData);

  if (!fields.name || !fields.reference || !fields.price) {
    return { error: "Preencha nome, referência e preço." };
  }

  const keepImages = parseJson<ExistingImage[]>(formData, "existingImagesJson", []);

  const { error } = await supabase
    .from("products")
    .update({
      name: fields.name,
      reference: fields.reference,
      category_id: fields.categoryId,
      price: fields.price,
      promo_price: fields.promoPrice,
      description: fields.description,
      composition: fields.composition,
      is_new: fields.isNew,
      is_featured: fields.isFeatured,
      active: fields.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Já existe um produto com essa referência."
          : error.message,
    };
  }

  try {
    await replaceChildren(supabase, id, formData, keepImages);
  } catch {
    return { error: "Produto atualizado, mas houve erro ao salvar imagens/variações." };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/colecao");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/produtos");
  revalidatePath("/colecao");
  revalidatePath("/");
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/produtos");
  revalidatePath("/colecao");
  revalidatePath("/");
}
