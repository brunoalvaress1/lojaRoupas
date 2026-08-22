"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

async function uploadCategoryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `categories/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export interface CategoryFormState {
  error?: string;
}

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  const active = formData.get("active") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!name) return { error: "Informe o nome da categoria." };
  if (!imageFile || imageFile.size === 0) {
    return { error: "Selecione uma imagem para a categoria." };
  }

  let imageUrl: string;
  try {
    imageUrl = await uploadCategoryImage(supabase, imageFile);
  } catch {
    return { error: "Não foi possível enviar a imagem." };
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    order,
    active,
    image: imageUrl,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe uma categoria com esse slug." : error.message,
    };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function updateCategory(
  id: string,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  const active = formData.get("active") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!name) return { error: "Informe o nome da categoria." };

  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadCategoryImage(supabase, imageFile);
    } catch {
      return { error: "Não foi possível enviar a imagem." };
    }
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugInput ? slugify(slugInput) : slugify(name),
      order,
      active,
      ...(imageUrl ? { image: imageUrl } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe uma categoria com esse slug." : error.message,
    };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
}
