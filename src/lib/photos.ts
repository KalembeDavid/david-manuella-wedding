import { isSupabaseConfigured, getSupabaseAdmin } from "./supabaseAdmin";

export const PHOTO_BUCKET = "wedding-photos";

export function getPhotoUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

export function pathFromUrl(url: string): string {
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`;
  return url.split(marker)[1] ?? url;
}

export async function getCouplePhotos(): Promise<{
  david: string | null;
  manuella: string | null;
  hero: string | null;
}> {
  if (!isSupabaseConfigured()) return { david: null, manuella: null, hero: null };
  try {
    const { data } = await getSupabaseAdmin()
      .storage.from(PHOTO_BUCKET)
      .list("couple", { limit: 50 });
    const files = (data ?? []).filter(f => f.name !== ".emptyFolderPlaceholder");
    const find = (prefix: string) => {
      const f = files.find(f => f.name.startsWith(prefix));
      return f ? getPhotoUrl(`couple/${f.name}`) : null;
    };
    return { david: find("david"), manuella: find("manuella"), hero: find("hero") };
  } catch {
    return { david: null, manuella: null, hero: null };
  }
}

export async function getGalleryPhotos(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await getSupabaseAdmin()
      .storage.from(PHOTO_BUCKET)
      .list("gallery", {
        limit: 100,
        sortBy: { column: "created_at", order: "asc" },
      });
    return (data ?? [])
      .filter(f => f.name !== ".emptyFolderPlaceholder")
      .map(f => getPhotoUrl(`gallery/${f.name}`));
  } catch {
    return [];
  }
}
