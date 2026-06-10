import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

/** Connexion : POST { password } → pose le cookie admin. */
export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD n'est pas configuré sur le serveur (variable d'environnement).",
      },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const password = typeof body.password === "string" ? body.password : "";
  if (password !== expected) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });
  return res;
}

/** Déconnexion : DELETE → supprime le cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
