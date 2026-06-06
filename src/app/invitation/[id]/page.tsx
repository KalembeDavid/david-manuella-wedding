import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSupabaseAdmin, type Guest } from "@/lib/supabaseAdmin";
import { getBaseUrl } from "@/lib/baseUrl";
import { wedding, monogram } from "@/lib/wedding";
import InvitationActions from "@/components/InvitationActions";
import { MotifDivider, KenteBand, MotifGrid } from "@/components/Motifs";

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
    color: { dark: "#5e1018", light: "#fbf5ecff" },
  });

  const ceremonies = [
    guest.attending_coutumier ? "Mariage Coutumier" : null,
    guest.attending_civil ? "Mariage Civil" : null,
  ].filter(Boolean) as string[];

  return (
    <main className="flex min-h-screen items-center justify-center bg-wine px-5 py-16">
      <div className="w-full max-w-lg">
        {/* Carte invitation */}
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-wine-700/40 to-wine text-center shadow-2xl">
          <KenteBand />
          <MotifGrid />
          <div className="relative p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/15" />

          <p className="font-display text-2xl tracking-wide-sm text-gold-light">
            {monogram}
          </p>
          <p className="mt-6 font-script text-3xl text-gold-light">
            Vous êtes convié(e)
          </p>

          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">
            {guest.full_name}
          </h1>

          <MotifDivider className="!my-6" />

          <p className="text-sm text-cream/80">au mariage de</p>
          <p className="mt-1 font-display text-3xl text-ivory">
            {wedding.groom.firstName}
            <span className="mx-2 font-script text-gold-light">&</span>
            {wedding.bride.firstName}
          </p>

          <p className="mt-5 text-sm uppercase tracking-wide-sm text-gold-light">
            {wedding.dayLabel} {wedding.dateLabel}
          </p>
          <p className="mt-1 text-sm text-cream/75">
            {wedding.venue} · {wedding.city}
          </p>

          {/* QR code */}
          <div className="mx-auto mt-8 w-fit rounded-2xl bg-ivory p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="QR code d'invitation"
              width={200}
              height={200}
              className="h-44 w-44"
            />
          </div>
          <p className="mt-3 text-xs text-cream/60">
            Présentez ce QR code à l&apos;entrée
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <Badge>
              {guest.party_size}{" "}
              {guest.party_size > 1 ? "personnes" : "personne"}
            </Badge>
            {guest.drink && <Badge>{guest.drink}</Badge>}
            {ceremonies.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </div>
          </div>
        </div>

        <InvitationActions url={invitationUrl} name={guest.full_name} />

        <p className="mt-8 text-center print:hidden">
          <a
            href="/"
            className="text-xs uppercase tracking-wide-sm text-cream/60 transition-colors hover:text-gold-light"
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
    <span className="rounded-full border border-gold/30 px-3 py-1 text-cream/85">
      {children}
    </span>
  );
}
