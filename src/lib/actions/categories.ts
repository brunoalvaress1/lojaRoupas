"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

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
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name) return { error: "Informe o nome da categoria." };
  if (!imageUrl) return { error: "Selecione uma imagem para a categoria." };

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
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name) return { error: "Informe o nome da categoria." };

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
