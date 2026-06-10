import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Tant que Supabase n'est pas branché, on signale "non configuré" (503)
  // pour que le formulaire affiche une confirmation gracieuse côté client.
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Base de données non configurée.", configured: false },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  if (!fullName) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }

  const partySize = Math.min(
    20,
    Math.max(1, parseInt(String(body.partySize ?? "1"), 10) || 1)
  );

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("guests")
      .insert({
        full_name: fullName,
        phone: String(body.phone ?? "").trim() || null,
        party_size: partySize,
        message: String(body.message ?? "").trim() || null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Erreur insertion RSVP:", error);
      return NextResponse.json(
        { error: "Enregistrement impossible. Merci de réessayer." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error("Erreur serveur RSVP:", e);
    return NextResponse.json(
      { error: "Service indisponible. Merci de réessayer plus tard." },
      { status: 503 }
    );
  }
}
