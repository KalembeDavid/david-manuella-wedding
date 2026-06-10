import { createHash } from "crypto";
import { cookies } from "next/headers";

/**
 * Authentification admin minimaliste :
 * - le mot de passe vient de la variable d'environnement ADMIN_PASSWORD ;
 * - après login, un jeton (hash du mot de passe) est posé en cookie httpOnly ;
 * - chaque route admin vérifie ce cookie.
 */

export const ADMIN_COOKIE = "dm_admin";

/** Jeton dérivé du mot de passe (jamais le mot de passe en clair). */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`dm-admin-v1:${pw}`).digest("hex");
}

/** Vrai si la requête courante porte le cookie admin valide. */
export async function isAdminRequest(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === token;
}
