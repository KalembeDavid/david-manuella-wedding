import Nav from "@/components/Nav";
import Countdown from "@/components/Countdown";
import RsvpForm from "@/components/RsvpForm";
import Reveal from "@/components/Reveal";
import { wedding, monogram, mapsUrl } from "@/lib/wedding";
import {
  MotifDivider,
  KenteBand,
  MotifGrid,
  MotifCorner,
  MotifMudcloth,
  FloatingAccents,
} from "@/components/Motifs";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <KenteBand />
      <Invitation />
      <Couple />
      <KenteBand />
      <Ceremonies />
      <Gallery />
      <KenteBand />
      <Rsvp />
      <Footer />
    </main>
  );
}

/* Séparateur = motif africain doré (losange + zigzags) */
function Diamond() {
  return <MotifDivider />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-script text-2xl text-gold sm:text-3xl">{children}</p>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wine px-5 text-center"
    >
      {/* motifs africains en filigrane + losanges flottants */}
      <MotifGrid />
      <FloatingAccents />
      {/* halos dorés en fond */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-wine-500/30 blur-3xl" />
      {/* cadre doré décoratif + ornements d'angle */}
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-gold/20 sm:inset-8" />
      <MotifCorner className="pointer-events-none absolute left-5 top-5 sm:left-9 sm:top-9" />
      <MotifCorner className="pointer-events-none absolute right-5 top-5 -scale-x-100 sm:right-9 sm:top-9" />
      <MotifCorner className="pointer-events-none absolute bottom-5 left-5 -scale-y-100 sm:bottom-9 sm:left-9" />
      <MotifCorner className="pointer-events-none absolute bottom-5 right-5 -scale-100 sm:bottom-9 sm:right-9" />

      <div className="relative z-10 mx-auto max-w-3xl py-28">
        <p className="reveal in-view font-script text-3xl text-gold-light sm:text-4xl">
          Nous nous marions
        </p>

        <h1
          className="reveal in-view mt-6 font-display text-6xl leading-[0.95] text-ivory sm:text-8xl"
          style={{ animationDelay: "120ms" }}
        >
          {wedding.groom.firstName}
          <span className="mx-3 inline-block font-script text-5xl text-gold-light sm:mx-5 sm:text-7xl">
            &
          </span>
          {wedding.bride.firstName}
        </h1>

        <div
          className="reveal in-view mx-auto mt-8 flex max-w-md items-center justify-center"
          style={{ animationDelay: "220ms" }}
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="px-4 text-sm uppercase tracking-luxe text-gold-light">
            {wedding.dateLabel}
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        <p
          className="reveal in-view mt-4 text-sm uppercase tracking-wide-sm text-cream/70"
          style={{ animationDelay: "300ms" }}
        >
          {wedding.venue} · {wedding.city} · {wedding.country}
        </p>

        <div className="reveal in-view mt-12" style={{ animationDelay: "400ms" }}>
          <Countdown date={wedding.date} />
        </div>

        <div
          className="reveal in-view mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "520ms" }}
        >
          <a href="#rsvp" className="btn-gold">
            Confirmer ma présence
          </a>
          <a href="#ceremonies" className="btn-outline">
            Voir le programme
          </a>
        </div>
      </div>

      {/* indicateur de scroll */}
      <a
        href="#invitation"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float-slow text-gold-light/70"
        aria-label="Défiler"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0 6-6m-6 6-6-6" />
        </svg>
      </a>
    </section>
  );
}

/* ─────────────────────────── INVITATION ─────────────────────────── */
function Invitation() {
  return (
    <section id="invitation" className="relative overflow-hidden bg-ivory px-5 py-24 sm:py-32">
      <MotifMudcloth />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>Avec joie</Eyebrow>
          <Diamond />
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-2 text-sm uppercase tracking-wide-sm text-ink-soft">
            <p>{wedding.groom.family}</p>
            <p className="font-script text-2xl normal-case tracking-normal text-gold">
              &amp;
            </p>
            <p>{wedding.bride.family}</p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-2xl font-display text-2xl leading-relaxed text-ink sm:text-3xl">
            {wedding.invitationLead}{" "}
            <span className="text-wine">{wedding.invitationBody}</span>
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-10 font-script text-5xl text-wine sm:text-6xl">
            {wedding.groom.firstName} &amp; {wedding.bride.firstName}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── COUPLE ───────────────────────────── */
function Couple() {
  const portraits = [
    { name: wedding.groom.firstName, family: wedding.groom.family },
    { name: wedding.bride.firstName, family: wedding.bride.family },
  ];
  return (
    <section id="couple" className="relative overflow-hidden bg-cream px-5 py-24 sm:py-32">
      <MotifMudcloth />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <Eyebrow>Les futurs époux</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-wine sm:text-5xl">
            Notre histoire commence
          </h2>
          <Diamond />
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-16">
          {portraits.map((p, i) => (
            <Reveal key={p.name} delay={i * 150} className="text-center">
              {/* Cadre photo — remplacer par une vraie image plus tard */}
              <div className="group relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-full border border-gold/40 bg-gradient-to-b from-wine-500/15 to-wine/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-8xl text-wine/25">
                    {p.name[0]}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine/15 to-transparent py-4">
                  <span className="text-[0.65rem] uppercase tracking-wide-sm text-wine/50">
                    Photo à venir
                  </span>
                </div>
              </div>
              <h3 className="mt-6 font-display text-3xl text-wine">{p.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wide-sm text-ink-soft">
                {p.family}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── CÉRÉMONIES ──────────────────────────── */
function Ceremonies() {
  return (
    <section id="ceremonies" className="relative bg-wine px-5 py-24 sm:py-32">
      <MotifGrid />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full border border-gold" />
        <div className="absolute left-10 bottom-10 h-52 w-52 rounded-full border border-gold" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center">
          <Eyebrow>Le grand jour</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-ivory sm:text-5xl">
            Programme des cérémonies
          </h2>
          <p className="mt-4 text-sm uppercase tracking-wide-sm text-gold-light">
            {wedding.dayLabel} {wedding.dateLabel}
          </p>
          <Diamond />
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {wedding.ceremonies.map((c, i) => (
            <Reveal key={c.key} delay={i * 150}>
              <article className="flex h-full flex-col rounded-2xl border border-gold/25 bg-wine-700/40 p-8 text-center backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1.5 hover:border-gold/50">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold-light">
                  {c.key === "civil" ? <RingsIcon /> : <HeartIcon />}
                </span>
                <h3 className="font-display text-3xl text-ivory">{c.title}</h3>
                <p className="mt-2 text-sm text-cream/70">{c.subtitle}</p>

                <div className="my-6 hairline" />

                <dl className="space-y-3 text-sm text-cream/85">
                  <Row label="Date">{c.date}</Row>
                  <Row label="Heure">{c.time ?? "À confirmer"}</Row>
                  <Row label="Lieu">
                    {c.venue}, {c.city}
                  </Row>
                </dl>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-7 self-center !px-6 !py-2.5 text-[0.7rem]"
                >
                  Voir l&apos;itinéraire
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-xs uppercase tracking-wide-sm text-gold-light/70">
        {label}
      </dt>
      <dd className="text-cream/90">{children}</dd>
    </div>
  );
}

/* ───────────────────────────── GALERIE ───────────────────────────── */
function Gallery() {
  return (
    <section id="galerie" className="relative overflow-hidden bg-ivory px-5 py-24 sm:py-32">
      <MotifMudcloth />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <Eyebrow>Souvenirs</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-wine sm:text-5xl">
            Galerie
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            Quelques-uns de nos plus beaux moments — les photos seront ajoutées
            très bientôt.
          </p>
          <Diamond />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className={i % 5 === 0 ? "col-span-2 sm:col-span-1" : ""}
            >
              <div className="flex aspect-square items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-br from-cream to-sand/60">
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-wine/25" fill="none" stroke="currentColor" strokeWidth="1.2">
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

/* ────────────────────────────── RSVP ────────────────────────────── */
function Rsvp() {
  return (
    <section id="rsvp" className="relative bg-wine px-5 py-24 sm:py-32">
      <MotifGrid />
      <div className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[2rem] border border-gold/15" />
      <div className="relative mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>Votre présence</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-ivory sm:text-5xl">
            Confirmez votre venue
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/70">
            Faites-nous savoir si vous serez des nôtres et choisissez votre
            boisson préférée.
          </p>
          <Diamond />
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
    <footer className="bg-ink px-5 py-16 text-center text-cream/70">
      <p className="font-display text-3xl text-gold-light">{monogram}</p>
      <p className="mt-4 font-script text-2xl text-cream/80">
        Avec tout notre amour
      </p>
      <p className="mt-2 text-sm uppercase tracking-wide-sm">
        {wedding.dateLabel} · {wedding.venue}, {wedding.city}
      </p>
      {(wedding.contact.phone || wedding.contact.email) && (
        <p className="mt-4 text-xs text-cream/50">
          {wedding.contact.phone}
          {wedding.contact.phone && wedding.contact.email ? " · " : ""}
          {wedding.contact.email}
        </p>
      )}
      <div className="mx-auto mt-8 h-px w-24 bg-gold/30" />
      <p className="mt-6 text-[0.7rem] uppercase tracking-wide-sm text-cream/30">
        {wedding.groom.firstName} &amp; {wedding.bride.firstName} —{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}

/* ────────────────────────────── ICÔNES ────────────────────────────── */
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" />
    </svg>
  );
}
function RingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 4 1.5 2.5h3L15 4" />
    </svg>
  );
}
