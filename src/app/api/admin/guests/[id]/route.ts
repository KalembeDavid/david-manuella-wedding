import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

/** Suppression d'un invité (admin). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const { error } = await getSupabaseAdmin()
    .from("guests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur suppression invité:", error);
    return NextResponse.json(
      { error: "Suppression impossible." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
