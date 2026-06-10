import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

type GuestInput = {
  full_name: string;
  phone: string | null;
  party_size: number;
};

function sanitizeGuest(raw: unknown): GuestInput | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const fullName = String(o.full_name ?? o.fullName ?? "").trim();
  if (!fullName) return null;
  const partySize = Math.min(
    20,
    Math.max(1, parseInt(String(o.party_size ?? o.partySize ?? "1"), 10) || 1)
  );
  return {
    full_name: fullName,
    phone: String(o.phone ?? "").trim() || null,
    party_size: partySize,
  };
}

/** Liste complète des invités (admin). */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Base de données non configurée.", configured: false },
      { status: 503 }
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lecture invités:", error);
    return NextResponse.json(
      { error: "Lecture impossible." },
      { status: 500 }
    );
  }
  return NextResponse.json({ guests: data ?? [] });
}

/**
 * Création d'invités (admin) — un seul ou en masse (import CSV) :
 * POST { guests: [{ full_name, phone?, party_size? }, ...] }
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Base de données non configurée.", configured: false },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const rawList: unknown[] = Array.isArray(body.guests) ? body.guests : [body];
  const guests = rawList
    .map(sanitizeGuest)
    .filter((g): g is GuestInput => g !== null);

  if (guests.length === 0) {
    return NextResponse.json(
      { error: "Aucun invité valide (le nom est requis)." },
      { status: 400 }
    );
  }
  if (guests.length > 1000) {
    return NextResponse.json(
      { error: "Maximum 1000 invités par import." },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .insert(guests)
    .select("id");

  if (error || !data) {
    console.error("Erreur insertion invités:", error);
    return NextResponse.json(
      { error: "Enregistrement impossible." },
      { status: 500 }
    );
  }
  return NextResponse.json({ inserted: data.length });
}
