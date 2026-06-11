import Image from "next/image";
import Nav from "@/components/Nav";
import RsvpForm from "@/components/RsvpForm";
import Reveal from "@/components/Reveal";
import { wedding, monogram, mapsUrl, calendarUrl } from "@/lib/wedding";
import { getCouplePhotos, getGalleryPhotos } from "@/lib/photos";
import {
  AfricanMotifColumn,
  BotanicalAccent,
  ConcentricCircles,
  HeroBrushStroke,
  KenteBand,
  MotifDivider,
  MotifGrid,
  MotifMudcloth,
  OliveBranch,
} from "@/components/Motifs";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <KenteBand />
      <NotreHistoire />
      <Ceremonies />
      <Blessing />
      <Gallery />
      <KenteBand />
      <Rsvp />
      <Footer />
    </main>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
async function Hero() {
  const { hero: heroPhoto } = await getCouplePhotos();

  return (
    <section
      id="accueil"
      className="relative min-h-svh overflow-hidden bg-ivory"
    >
      {/* Colonne de motifs africains — bord gauche */}
      <AfricanMotifColumn className="pointer-events-none absolute left-0 top-0 z-10 h-full w-9 text-gold/50 sm:w-11" />

      {/* Coup de pinceau mobile */}
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[62%] overflow-hidden lg:hidden">
        <HeroBrushStroke className="absolute inset-0 h-full w-full text-gold/35" />
      </div>

      {/* Photo héro mobile — container plus large pour loger les deux visages */}
      {heroPhoto && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-0 h-[72%] w-[76%] overflow-hidden lg:hidden"
          style={{
            maskImage: [
              "linear-gradient(to right,",
              "  transparent 0%,",
              "  rgba(0,0,0,0.06) 12%,",
              "  rgba(0,0,0,0.28) 24%,",
              "  rgba(0,0,0,0.62) 36%,",
              "  rgba(0,0,0,0.88) 48%,",
              "  black 58%,",
              "  black 86%,",
              "  transparent 100%",
              ")",
            ].join(""),
          }}
        >
          <Image
            src={heroPhoto}
            alt={`${wedding.groom.firstName} & ${wedding.bride.firstName}`}
            fill
            className="object-cover"
            style={{ objectPosition: "55% 12%" }}
            sizes="76vw"
          />
        </div>
      )}

      <div className="flex min-h-svh flex-col lg:flex-row">

        {/* ── COLONNE TEXTE ── */}
        <div className="relative z-10 flex flex-1 flex-col justify-center py-28 pl-14 pr-8 sm:pl-16 lg:max-w-[48%] lg:pl-20 xl:pl-24">

          <p className="reveal in-view text-[0.6rem] uppercase tracking-luxe text-ink/45">
            Mariage coutumier
          </p>

          <h1
            className="reveal in-view relative mt-4 font-display font-bold leading-[0.9] text-ink"
            style={{ animationDelay: "80ms" }}
          >
            <span className="block text-[clamp(3.8rem,8.5vw,6.5rem)]">
              {wedding.groom.firstName}{" "}
              <span className="font-script font-normal text-[clamp(2.4rem,5.5vw,4rem)] text-gold">
                &amp;
              </span>
            </span>
            <span className="block text-[clamp(3.8rem,8.5vw,6.5rem)]">
              {wedding.bride.firstName}
            </span>
          </h1>

          <p
            className="reveal in-view mt-5 text-[0.65rem] uppercase tracking-[0.28em] text-ink/60"
            style={{ animationDelay: "160ms" }}
          >
            Nous nous marions
          </p>
          <div className="mt-2 h-px w-8 bg-ink/25" aria-hidden />
          <p
            className="reveal in-view mt-3 text-sm font-bold uppercase tracking-[0.18em] text-gold"
            style={{ animationDelay: "200ms" }}
          >
            {wedding.dayLabel} {wedding.dateLabel}
          </p>

          {/* Vague décorative */}
          <svg
            className="mt-4 text-ink/30"
            width="44"
            height="16"
            viewBox="0 0 44 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 8 C5 3 9 3 12 8 C15 13 19 13 22 8 C25 3 29 3 32 8 C35 13 39 13 42 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <div
            className="reveal in-view mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "300ms" }}
          >
            <a href="#rsvp" className="btn-gold">
              Un mot pour le couple
            </a>
            <a href="#ceremonies" className="btn-outline-dark">
              Le grand jour
            </a>
          </div>

          {/* Indicateur scroll */}
          <a
            href="#notre-histoire"
            className="absolute bottom-8 left-14 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-ink/40 sm:left-16 lg:left-20"
            aria-label="Défiler vers le bas"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m0 0 6-6m-6 6-6-6"
              />
            </svg>
            Découvrez notre univers
          </a>
        </div>

        {/* ── COLONNE VISUELLE (desktop) ── */}
        <div className="relative hidden flex-1 overflow-hidden bg-ivory lg:block">
          {/* Coup de pinceau — couche basse */}
          <HeroBrushStroke className="pointer-events-none absolute inset-0 h-full w-full text-gold" />

          {/* Photo couple */}
          {heroPhoto ? (
            <div
              className="absolute inset-0"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
              }}
            >
              <Image
                src={heroPhoto}
                alt={`${wedding.groom.firstName} & ${wedding.bride.firstName}`}
                fill
                className="object-cover object-top"
                sizes="55vw"
                priority
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-display text-[10rem] font-bold leading-none text-ink/8">
                {monogram}
              </p>
            </div>
          )}

          {/* Branche d'olivier */}
          <OliveBranch className="pointer-events-none absolute right-5 top-10 z-20 h-56 w-20 text-ink/38" />

          {/* Cercles concentriques adinkra */}
          <ConcentricCircles className="pointer-events-none absolute bottom-14 right-10 z-20 h-24 w-24 text-ink/20" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── NOTRE HISTOIRE ─────────────────────── */
async function NotreHistoire() {
  const photos = await getCouplePhotos();

  return (
    <section
      id="notre-histoire"
      className="relative overflow-hidden bg-cream px-5 py-24 sm:py-32"
    >
      <MotifMudcloth />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-14">

          {/* ── Texte + CTA ── */}
          <div className="lg:max-w-[280px] lg:pt-6">
            <Reveal>
              <p className="text-[0.6rem] uppercase tracking-luxe text-ink/45">
                Notre Histoire
              </p>
              <h2 className="mt-3 font-script text-5xl leading-snug text-ink sm:text-6xl">
                Deux cœurs,<br />une seule âme
              </h2>
              <div className="mt-4 h-px w-10 bg-ink/25" />
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 text-sm leading-relaxed text-ink/65">
                {wedding.invitationLead} les familles{" "}
                <strong className="text-ink/80">
                  {wedding.groom.family}
                </strong>{" "}
                et{" "}
                <strong className="text-ink/80">
                  {wedding.bride.family}
                </strong>{" "}
                {wedding.invitationBody}
              </p>
              <a
                href="#ceremonies"
                className="btn-outline-dark mt-6 inline-flex !px-5 !py-2.5 text-[0.7rem]"
              >
                Voir le faire-part →
              </a>
            </Reveal>
          </div>

          {/* ── Polaroïds + timeline ── */}
          <div className="flex-1">
            {/* Polaroïd cards */}
            <Reveal delay={80}>
              <div className="relative mx-auto h-80 max-w-md sm:max-w-lg">
                {/* Card 1 — David (en arrière, inclinée gauche) */}
                <div
                  className="absolute left-0 top-4 z-0 w-44 sm:w-52"
                  style={{ transform: "rotate(-6deg)" }}
                >
                  <div className="rounded-sm bg-ivory p-2.5 pb-9 shadow-[0_8px_32px_-8px_rgba(45,19,7,0.25)]">
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand/25">
                      {photos.david ? (
                        <Image
                          src={photos.david}
                          alt={wedding.groom.firstName}
                          fill
                          className="object-cover"
                          sizes="210px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-5xl text-gold/30">
                            {wedding.groom.firstName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-center font-script text-lg text-ink/55">
                      {wedding.groom.firstName}
                    </p>
                  </div>
                </div>

                {/* Card 3 — Couple ensemble (si dispo, derrière tout) */}
                {photos.hero && (
                  <div
                    className="absolute left-[22%] top-0 z-0 w-48 sm:w-56"
                    style={{ transform: "rotate(1deg)" }}
                  >
                    <div className="rounded-sm bg-ivory p-2.5 pb-9 shadow-[0_12px_40px_-10px_rgba(45,19,7,0.22)]">
                      {/* Ruban adhésif */}
                      <div
                        className="absolute -top-3 left-1/2 h-5 w-12 -translate-x-1/2 rounded-sm bg-sand/55"
                        aria-hidden
                      />
                      <div className="relative aspect-[3/4] overflow-hidden bg-sand/25">
                        <Image
                          src={photos.hero}
                          alt={`${wedding.groom.firstName} & ${wedding.bride.firstName}`}
                          fill
                          className="object-cover"
                          sizes="230px"
                        />
                      </div>
                      <p className="mt-2 text-center font-script text-lg text-ink/55">
                        Ensemble
                      </p>
                    </div>
                  </div>
                )}

                {/* Card 2 — Manuella (en avant, inclinée droite) */}
                <div
                  className="absolute right-0 top-2 z-10 w-44 sm:w-52"
                  style={{ transform: "rotate(5deg)" }}
                >
                  <div className="rounded-sm bg-ivory p-2.5 pb-9 shadow-[0_12px_40px_-10px_rgba(45,19,7,0.30)]">
                    {/* Ruban adhésif */}
                    <div
                      className="absolute -top-3 left-1/2 h-5 w-12 -translate-x-1/2 rounded-sm bg-sand/55"
                      aria-hidden
                    />
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand/25">
                      {photos.manuella ? (
                        <Image
                          src={photos.manuella}
                          alt={wedding.bride.firstName}
                          fill
                          className="object-cover"
                          sizes="210px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-5xl text-gold/30">
                            {wedding.bride.firstName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-center font-script text-lg text-ink/55">
                      {wedding.bride.firstName}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Timeline */}
            <Reveal delay={200} className="mt-12">
              <div className="relative">
                <div
                  className="absolute top-[11px] left-0 right-0 h-px bg-ink/12"
                  aria-hidden
                />
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "La rencontre",
                      desc: "Un regard,\nun sourire,\net tout a changé.",
                      accent: false,
                    },
                    {
                      label: "Le oui",
                      desc: "Le début\nde notre plus\nbelle aventure.",
                      accent: false,
                    },
                    {
                      label: wedding.dateLabel,
                      desc: "Notre mariage !\nLe plus beau\njour de nos vies.",
                      accent: true,
                    },
                  ].map((item) => (
                    <div key={item.label} className="relative pt-7">
                      <div
                        className={`absolute top-0 left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full border-2 ${
                          item.accent
                            ? "border-gold bg-gold"
                            : "border-ink/30 bg-cream"
                        }`}
                        aria-hidden
                      />
                      <p
                        className={`text-[0.6rem] font-bold uppercase tracking-wide-sm ${
                          item.accent ? "text-gold" : "text-ink/50"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="mt-1.5 whitespace-pre-line font-script text-base leading-snug text-ink/55">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── LE GRAND JOUR / CEREMONIES ──────────────────────── */
function Ceremonies() {
  return (
    <section
      id="ceremonies"
      className="relative overflow-hidden bg-wax-dark px-5 py-24 sm:py-32"
    >
      <MotifGrid />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-14">

          {/* ── Cartes physiques ── */}
          <Reveal className="relative w-full flex-1 lg:max-w-[480px]">
            <div className="relative mx-auto h-[520px] max-w-[420px]">

              {/* Enveloppe (derrière) */}
              <div
                className="absolute left-4 top-6 w-64 overflow-hidden rounded-sm border border-sand/20 bg-gradient-to-b from-[#d4b28a]/70 to-[#cbad8d]/60 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6)]"
                style={{ transform: "rotate(7deg)" }}
              >
                <div className="kente-band opacity-50" />
                <div className="h-52" />
              </div>

              {/* Faire-part principal */}
              <div
                className="absolute left-1/2 top-8 z-10 w-60 -translate-x-1/2 rounded-sm bg-ivory px-6 py-7 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.70)]"
                style={{ transform: "translateX(-50%) rotate(-3deg)" }}
              >
                <div className="mb-3 flex justify-center" style={{ transform: "scaleY(-1)" }} aria-hidden>
                  <BotanicalAccent className="h-7 w-16 text-gold/50" />
                </div>
                <p className="text-center text-[0.5rem] uppercase tracking-luxe text-ink/40">
                  Mariage coutumier
                </p>
                <p className="mt-2 text-center font-display text-2xl font-bold leading-tight text-ink">
                  {wedding.groom.firstName}
                </p>
                <p className="text-center font-script text-xl leading-tight text-gold">
                  &amp;
                </p>
                <p className="text-center font-display text-2xl font-bold leading-tight text-ink">
                  {wedding.bride.firstName}
                </p>
                <p className="mt-2 text-center font-script text-base text-ink/55">
                  se disent oui
                </p>
                <div className="my-3 hairline" />
                <p className="text-center text-[0.6rem] uppercase tracking-wide-sm text-ink/65">
                  {wedding.ceremony.date}
                </p>
                <p className="mt-0.5 text-center text-[0.6rem] text-ink/50">
                  {wedding.ceremony.venue} · {wedding.ceremony.city}
                </p>
                <div className="mt-3 flex justify-center">
                  <BotanicalAccent className="h-7 w-16 text-gold/50" />
                </div>
              </div>

              {/* Carte RSVP (avant droite) */}
              <div
                className="absolute bottom-10 right-2 z-20 w-44 rounded-sm bg-ivory px-4 py-4 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.55)]"
                style={{ transform: "rotate(5deg)" }}
              >
                <p className="text-[0.5rem] uppercase tracking-luxe text-ink/35">
                  RSVP
                </p>
                <p className="mt-1.5 text-[0.65rem] leading-snug text-ink/65">
                  Merci de confirmer votre présence avant le{" "}
                  <strong>{wedding.rsvpDeadlineLabel}</strong>.
                </p>
                <MotifDivider className="!my-2 scale-75" />
              </div>

              {/* Sceau de cire */}
              <div className="absolute bottom-6 left-16 z-30">
                <svg viewBox="0 0 60 60" className="h-14 w-14" fill="none">
                  <circle cx="30" cy="30" r="28" fill="#945131" opacity="0.92" />
                  <circle cx="30" cy="30" r="22" stroke="#cd5b21" strokeWidth="1.2" opacity="0.55" />
                  <path
                    d="M30 16 C30 16 22 23 22 32 C22 41 30 45 30 45 C30 45 38 41 38 32 C38 23 30 16 30 16 Z"
                    stroke="#f4ede5"
                    strokeWidth="1.3"
                    fill="none"
                    opacity="0.70"
                  />
                  <line x1="30" y1="16" x2="30" y2="45" stroke="#f4ede5" strokeWidth="0.8" opacity="0.45" />
                </svg>
              </div>

              {/* Feuilles botaniques déco */}
              <OliveBranch className="pointer-events-none absolute -bottom-4 -right-4 z-0 h-40 w-14 text-sand/30" />
            </div>
          </Reveal>

          {/* ── Texte info ── */}
          <div className="lg:max-w-sm">
            <Reveal>
              <p className="text-[0.6rem] uppercase tracking-luxe text-sand/55">
                Le mariage
              </p>
              <h2 className="mt-3 text-balance font-display text-4xl text-ivory sm:text-5xl">
                Le grand jour
              </h2>
              <p className="mt-2 text-base font-bold text-gold">
                {wedding.ceremony.date}
              </p>
              <MotifDivider className="!my-6" />
            </Reveal>

            <Reveal delay={100}>
              <p className="text-sm leading-relaxed text-cream/75">
                {wedding.invitationLead} les familles{" "}
                <strong className="text-cream/90">{wedding.groom.family}</strong>{" "}
                et{" "}
                <strong className="text-cream/90">{wedding.bride.family}</strong>{" "}
                {wedding.invitationBody}
              </p>
              <p className="mt-4 text-sm font-medium italic text-gold-light/80">
                {wedding.invitationClose}
              </p>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8">
                <p className="text-[0.6rem] uppercase tracking-luxe text-sand/55">
                  Au programme
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-sand/15 pb-3">
                    <dt className="text-gold-light/65 text-xs uppercase tracking-wide-sm">Heure</dt>
                    <dd className="text-cream/85">{wedding.ceremony.time}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-sand/15 pb-3">
                    <dt className="text-gold-light/65 text-xs uppercase tracking-wide-sm">Lieu</dt>
                    <dd className="text-cream/85">
                      {wedding.ceremony.venue}, {wedding.ceremony.city}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gold-light/65 text-xs uppercase tracking-wide-sm">RSVP avant le</dt>
                    <dd className="text-cream/85">{wedding.rsvpDeadlineLabel}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !px-5 !py-2.5 text-[0.7rem]"
                >
                  Itinéraire
                </a>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !px-5 !py-2.5 text-[0.7rem]"
                >
                  Agenda
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── BÉNÉDICTION ─────────────────────── */
function Blessing() {
  return (
    <section className="relative overflow-hidden bg-ivory px-5 py-24 text-center sm:py-28">
      {/* Silhouette d'arbre */}
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden opacity-[0.055]"
        aria-hidden
      >
        <svg viewBox="0 0 400 280" className="w-full max-w-md text-ink" fill="currentColor">
          <rect x="186" y="155" width="28" height="125" rx="4" opacity="0.7" />
          <ellipse cx="200" cy="115" rx="85" ry="95" opacity="0.55" />
          <ellipse cx="200" cy="145" rx="100" ry="75" opacity="0.48" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <span
            aria-hidden
            className="block font-display text-[7rem] leading-[0.3] text-gold/30"
          >
            "
          </span>
          <blockquote className="mt-8 font-display text-3xl italic leading-snug text-ink sm:text-4xl">
            {wedding.blessing}
          </blockquote>
          <cite className="mt-6 block text-xs not-italic uppercase tracking-luxe text-ink/45">
            — {wedding.blessingRef}
          </cite>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── GALERIE ───────────────────────────── */
async function Gallery() {
  const photos = await getGalleryPhotos();
  const hasPhotos = photos.length > 0;
  return (
    <section id="galerie" className="relative overflow-hidden bg-cream px-5 py-24 sm:py-32">
      <MotifMudcloth />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="font-script text-3xl text-gold sm:text-4xl">Nos souvenirs</p>
          <h2 className="mt-2 text-balance font-display text-4xl text-ink sm:text-5xl">
            La galerie
          </h2>
          <MotifDivider />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {hasPhotos
            ? photos.map((url, i) => (
                <Reveal
                  key={url}
                  delay={i * 80}
                  className={i % 5 === 0 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-gold/30 shadow-[0_12px_28px_-16px_rgba(45,19,7,0.4)]">
                    <Image
                      src={url}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                </Reveal>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <Reveal
                  key={i}
                  delay={i * 80}
                  className={i % 5 === 0 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <div className="flex aspect-square items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-ivory to-sand/50">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-9 w-9 text-gold/30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <circle cx="9" cy="10" r="1.6" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 18 5-5 4 4 3-3 4 4" />
                    </svg>
                  </div>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── RSVP ─────────────────── */
function Rsvp() {
  return (
    <section id="rsvp" className="relative overflow-hidden bg-wax-dark px-5 py-24 sm:py-32">
      <MotifGrid />
      <div className="pointer-events-none absolute inset-x-4 inset-y-8 rounded-[2rem] border border-gold/15 sm:inset-x-6" />
      <div className="relative mx-auto max-w-2xl px-3 md:px-0">
        <Reveal className="text-center">
          <p className="font-script text-3xl text-gold sm:text-4xl">Du fond du cœur</p>
          <h2 className="mt-2 text-balance font-display text-4xl text-ivory sm:text-5xl">
            Un mot pour les mariés
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70">
            Confirmez votre venue et laissez-nous quelques mots — ils seront lus
            et précieusement gardés.
          </p>
          <MotifDivider />
        </Reveal>
        <Reveal delay={150} className="mt-8">
          <RsvpForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────── FOOTER ────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ink px-5 py-16 text-center text-cream/70">
      <p className="font-display text-3xl text-gold-light">{monogram}</p>
      <p className="mt-4 font-script text-3xl text-cream/85">Avec tout notre amour</p>
      {(wedding.contact.phone || wedding.contact.email) && (
        <p className="mt-4 text-xs text-cream/50">
          {wedding.contact.phone}
          {wedding.contact.phone && wedding.contact.email ? " · " : ""}
          {wedding.contact.email}
        </p>
      )}
      <div className="mx-auto mt-8 h-px w-24 bg-gold/30" />
      <p className="mt-6 text-[0.7rem] uppercase tracking-wide-sm text-cream/40">
        {wedding.groom.firstName} &amp; {wedding.bride.firstName} —{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
