-- ─────────────────────────────────────────────────────────────
--  Schéma base de données — Mariage David & Manuella
--  À exécuter dans Supabase : menu « SQL Editor » → coller → Run
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.guests (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  phone                 text,
  party_size            int  not null default 1,
  drink                 text,
  attending_coutumier   boolean not null default true,
  attending_civil       boolean not null default true,
  message               text,
  checked_in            boolean not null default false,
  checked_in_at         timestamptz,
  created_at            timestamptz not null default now()
);

-- Sécurité : on active RLS sans aucune policy publique.
-- => Personne ne peut lire/écrire la table directement depuis le navigateur.
--    Seul le serveur (clé service_role) y accède, ce qui est sûr.
alter table public.guests enable row level security;

-- Index utile pour l'admin (tri par date d'inscription)
create index if not exists guests_created_at_idx on public.guests (created_at desc);
