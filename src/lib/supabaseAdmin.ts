import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté SERVEUR uniquement (clé service_role).
 * Ne JAMAIS importer ce fichier dans un composant client.
 * Création paresseuse : n'échoue qu'à l'usage si les variables manquent,
 * pour ne pas casser le build tant que Supabase n'est pas configuré.
 */
let client: SupabaseClient | null = null;

/** Vrai si les variables Supabase sont présentes. */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase non configuré : définis NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (dans .env.local en local, et dans les variables Vercel en production)."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export type Guest = {
  id: string;
  full_name: string;
  phone: string | null;
  party_size: number;
  message: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};
