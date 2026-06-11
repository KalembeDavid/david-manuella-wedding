import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";
import { PHOTO_BUCKET, getCouplePhotos, getGalleryPhotos } from "@/lib/photos";

export const runtime = "nodejs";

/** Liste les photos du couple + de la galerie. */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Non configuré." }, { status: 503 });
  }
  const [couple, gallery] = await Promise.all([getCouplePhotos(), getGalleryPhotos()]);
  return NextResponse.json({ couple, gallery });
}

/** Upload d'une photo.
 *  FormData : file (File), folder ("couple"|"gallery"), name ("david"|"manuella"|"")
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Non configuré." }, { status: 503 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = String(form.get("folder") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();

  if (!file || !folder) {
    return NextResponse.json({ error: "Fichier ou dossier manquant." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeName = name || String(Date.now());
  const path = `${folder}/${safeName}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await getSupabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: true });

  if (error) {
    console.error("Erreur upload photo:", error);
    return NextResponse.json({ error: "Upload impossible." }, { status: 500 });
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
  return NextResponse.json({ url, path });
}
