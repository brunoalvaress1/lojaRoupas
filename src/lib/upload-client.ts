"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.82;
/** Below this size, a photo is already reasonably light — skip re-encoding it. */
const SKIP_COMPRESSION_UNDER_BYTES = 1.5 * 1024 * 1024;

/**
 * Resizes/re-encodes an image client-side before it ever leaves the device.
 * Phone cameras routinely produce 4-8MB photos at resolutions far higher than
 * anything the site displays — uploading them as-is is what makes "adding
 * several photos at once" slow (or, on a weak connection, look like it hung)
 * for the admin. Never throws: any decode issue (e.g. an unsupported HEIC
 * variant) just falls back to uploading the original file untouched.
 */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < SKIP_COMPRESSION_UNDER_BYTES) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const targetW = Math.round(bitmap.width * scale);
    const targetH = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/**
 * Uploads a file straight from the browser to Supabase Storage and returns
 * its public URL. Used instead of sending the file through a Server Action,
 * whose request body is capped (1MB by default in Next.js) — a real photo
 * from a phone easily exceeds that and would make the save fail.
 */
export async function uploadToStorage(
  bucket: string,
  pathPrefix: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const upload = await compressImage(file);
  const ext = upload.type === "image/jpeg" ? "jpg" : upload.name.split(".").pop() ?? "jpg";

  // A weak connection can drop a single request without the whole batch
  // being unreasonable — retry a couple of times before giving up on it.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, upload, { contentType: upload.type });
    if (!error) {
      return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }
    lastError = error;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  throw lastError;
}

/**
 * Runs `fn` over `items` with at most `limit` in flight at once. Uploading
 * every selected photo in parallel is what overwhelms a weak connection when
 * an admin adds many photos to a product at the same time; a small pool keeps
 * each upload's chance of finishing high without serializing everything.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next;
      next += 1;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
