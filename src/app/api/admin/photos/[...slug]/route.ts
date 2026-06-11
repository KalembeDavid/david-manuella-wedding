import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";
import { PHOTO_BUCKET } from "@/lib/photos";

export const runtime = "nodejs";

/** Suppression d'une photo : DELETE /api/admin/photos/couple/david.jpg */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Non configuré." }, { status: 503 });
  }

  const { slug } = await params;
  const path = slug.join("/");

  const { error } = await getSupabaseAdmin().storage.from(PHOTO_BUCKET).remove([path]);
  if (error) {
    console.error("Erreur suppression photo:", error);
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
