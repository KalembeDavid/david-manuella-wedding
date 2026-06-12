import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSupabaseAdmin, type Guest } from "@/lib/supabaseAdmin";
import { getBaseUrl } from "@/lib/baseUrl";
import { wedding } from "@/lib/wedding";
import InvitationActions from "@/components/InvitationActions";
import {
  MotifDivider,
  KenteBand,
  MotifMudcloth,
  OliveBranch,
  BotanicalAccent,
  ConcentricCircles,
} from "@/components/Motifs";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let guest: Guest | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .single();
    guest = (data as Guest) ?? null;
  } catch {
    guest = null;
  }

  if (!guest) notFound();

  const base = await getBaseUrl();
  const invitationUrl = `${base}/invitation/${id}`;
  const qr = await QRCode.toDataURL(invitationUrl, {
    margin: 1,
    width: 460,
    color: { dark: "#1a0904", light: "#ebe3db" },
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory px-4 py-16">
      <MotifMudcloth />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* ── Carte ── */}
        <div className="relative overflow-hidden rounded-3xl border border-sand/55 bg-ivory text-center shadow-2xl shadow-ink/10">

          {/* ── En-tête terracotta ── */}
          <div className="relative overflow-hidden">
            <KenteBand />

            {/* Coup de pinceau organique en fond */}
            <svg
              viewBox="0 0 500 110"
              className="pointer-events-none absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden
            >
              <path
                d="M-60 90 C60 15 190 -8 310 18 C400 38 465 75 560 55"
                stroke="#cd5b21"
                strokeWidth="52"
                strokeLinecap="round"
                opacity="0.10"
              />
            </svg>

            {/* Sceau central — cercles concentriques */}
            <div className="relative flex justify-center pt-7 pb-2">
              <ConcentricCircles className="h-12 w-12 text-orange/60" />
            </div>
          </div>

          {/* ── Bordure intérieure décorative ── */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-sand/28" aria-hidden />

          {/* ── Branches d'olivier — bords ── */}
          <div
            className="pointer-events-none absolute left-0 top-24"
            style={{ transform: "translateX(-1rem)" }}
            aria-hidden
          >
            <OliveBranch className="h-48 w-14 text-ink/[0.18]" />
          </div>
          <div
            className="pointer-events-none absolute right-0 top-24"
            style={{ transform: "translateX(1rem) scaleX(-1)" }}
            aria-hidden
          >
            <OliveBranch className="h-48 w-14 text-ink/[0.18]" />
          </div>

          {/* ── Corps ── */}
          <div className="relative px-8 pb-7 pt-3 sm:px-12">

            {/* Script d'invitation */}
            <p className="font-script text-[1.75rem] leading-tight text-orange-light">
              {guest.party_size > 1 ? "Vous êtes conviés" : "Vous êtes convié(e)"}
            </p>

            {/* Nom de l'invité */}
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              {guest.full_name}
            </h1>

            <MotifDivider className="!my-5" />

            <p className="text-xs uppercase tracking-wide-sm text-ink/45">au mariage de</p>

            {/* Noms des mariés encadrés de petites branches */}
            <div className="relative mt-2 flex items-center justify-center gap-2">
              <BotanicalAccent className="h-9 w-11 -scale-x-100 text-ink/22" />
              <p className="font-display text-[1.65rem] text-ink">
                {wedding.groom.firstName}
                <span className="mx-[0.35rem] font-script text-[1.4rem] text-orange">&amp;</span>
                {wedding.bride.firstName}
              </p>
              <BotanicalAccent className="h-9 w-11 text-ink/22" />
            </div>

            {/* Date & lieu */}
            <div className="mt-5">
              {/* Filet terracotta */}
              <div className="mx-auto mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-sand/60" />
                <svg viewBox="0 0 20 20" className="h-3 w-3 text-orange/60" fill="currentColor" aria-hidden>
                  <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
                </svg>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-sand/60" />
              </div>
              <p className="text-[0.7rem] uppercase tracking-wide-sm text-orange">
                {wedding.dayLabel} {wedding.dateLabel} · {wedding.timeLabel}
              </p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {wedding.venue} · {wedding.city}
              </p>
            </div>

            {/* QR code */}
            <div className="mx-auto mt-7 w-fit rounded-2xl bg-cream p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt="QR code d'invitation"
                width={200}
                height={200}
                className="h-44 w-44"
              />
            </div>
            <p className="mt-2.5 text-[0.68rem] text-ink/38">
              Présentez ce QR code à l&apos;entrée
            </p>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[0.68rem]">
              <Badge>
                {guest.party_size}{" "}
                {guest.party_size > 1 ? "personnes" : "personne"}
              </Badge>
              {guest.table_number && <Badge>Table {guest.table_number}</Badge>}
              <Badge>Mariage coutumier</Badge>
            </div>
          </div>

          {/* ── Accent botanique bas ── */}
          <div className="flex justify-center pb-5 pt-1" aria-hidden>
            <div style={{ transform: "scaleY(-1)" }}>
              <BotanicalAccent className="text-ink/18" />
            </div>
          </div>
        </div>

        <InvitationActions
          url={invitationUrl}
          name={guest.full_name}
          partySize={guest.party_size}
          downloadUrl={`/api/invitation-image/${guest.id}?download=1`}
        />

        <p className="mt-8 text-center print:hidden">
          <a
            href="/"
            className="text-xs uppercase tracking-wide-sm text-ink/38 transition-colors hover:text-orange"
          >
            ← Retour au site
          </a>
        </p>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-orange/35 px-3 py-1 text-orange">
      {children}
    </span>
  );
}
