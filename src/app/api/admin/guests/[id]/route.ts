import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

const ALLOWED_PATCH_FIELDS = [
  "full_name",
  "phone",
  "party_size",
  "table_number",
  "checked_in",
  "checked_in_at",
];

/** Mise à jour d'un invité (admin). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Base de données non configurée." }, { status: 503 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;

  const update: Record<string, unknown> = {};
  for (const field of ALLOWED_PATCH_FIELDS) {
    if (field in body) update[field] = body[field];
  }

  // Auto-gestion de checked_in_at
  if (body.checked_in === true && !("checked_in_at" in body)) {
    update.checked_in_at = new Date().toISOString();
  }
  if (body.checked_in === false && !("checked_in_at" in body)) {
    update.checked_in_at = null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur mise à jour invité:", error);
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
  return NextResponse.json({ guest: data });
}

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
