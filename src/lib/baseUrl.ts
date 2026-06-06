import { headers } from "next/headers";

/** URL de base du site, déduite de la requête (marche en local et sur Vercel). */
export async function getBaseUrl(): Promise<string> {
  // Priorité à une variable explicite si définie
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
