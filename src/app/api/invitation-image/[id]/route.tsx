import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { getSupabaseAdmin, isSupabaseConfigured, type Guest } from "@/lib/supabaseAdmin";
import { getBaseUrl } from "@/lib/baseUrl";
import { wedding } from "@/lib/wedding";

export const runtime = "nodejs";

/* ── Palette ── */
const IVORY       = "#f4ede5";
const CREAM       = "#ebe3db";
const SAND        = "#cbad8d";
const ORANGE      = "#cd5b21";
const ORANGE_LIGHT = "#b87545";
const MAHOGANY    = "#945131";
const INK         = "#2d1307";
const INK_SOFT    = "#7a5242";

const W = 1080;
const H = 1920; /* 9:16 */
const R = 80;   /* border-radius */

/* ── Frise kente — SVG pleine largeur ── */
function kenteBandUri(w: number, h: number): string {
  const unit = 48;
  let paths = "";
  for (let x = 0; x < w; x += unit) {
    paths +=
      `<path d="M${x} ${h} L${x+unit/2} ${h-h*0.42} L${x+unit} ${h}" fill="none" stroke="${ORANGE}" stroke-width="6"/>` +
      `<path d="M${x} ${h*0.67} L${x+unit/2} ${h*0.67-h*0.42} L${x+unit} ${h*0.67}" fill="none" stroke="${SAND}" stroke-width="4"/>` +
      `<path d="M${x} ${h*0.33} L${x+unit/2} ${h*0.33-h*0.42} L${x+unit} ${h*0.33}" fill="none" stroke="${MAHOGANY}" stroke-width="3"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${INK}"/>${paths}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* ── Motif mudcloth — grille SVG inline (pas de <pattern>, compatible satori) ── */
function mudclothUri(): string {
  const s = 80;
  let cells = "";
  for (let y = 0; y < H; y += s)
    for (let x = 0; x < W; x += s)
      cells += `<rect x="${x+20}" y="${y+20}" width="${s-40}" height="${s-40}" stroke="${SAND}" stroke-width="0.6" fill="none" opacity="0.22"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${cells}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* ── Entête terracotta avec coup de pinceau ── */
function headerUri(w: number, h: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${IVORY}"/><path d="M-${w*0.11} ${h*0.82} C${w*0.11} ${h*0.14} ${w*0.35} ${h*-0.07} ${w*0.57} ${h*0.16} C${w*0.74} ${h*0.35} ${w*0.86} ${h*0.68} ${w*1.03} ${h*0.5}" stroke="${ORANGE}" stroke-width="${h*0.47}" stroke-linecap="round" fill="none" opacity="0.10"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function slugify(s: string) {
  return (s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "invite");
}

/* ── Polices Google ── */
const fontCache = new Map<string, Promise<ArrayBuffer | null>>();
function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}`;
  if (!fontCache.has(key)) {
    fontCache.set(key, (async () => {
      try {
        const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`)).text();
        const m = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
        if (!m) return null;
        return (await fetch(m[1])).arrayBuffer();
      } catch { return null; }
    })());
  }
  return fontCache.get(key)!;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let guest: Guest | null = null;
  if (id === "apercu" && process.env.NODE_ENV !== "production") {
    guest = { id: "apercu", full_name: "Couple Erick Chansa", phone: null, party_size: 2, table_number: 3, message: null, checked_in: false, checked_in_at: null, created_at: new Date().toISOString() };
  } else {
    if (!isSupabaseConfigured()) return new Response("Non configuré.", { status: 503 });
    try {
      const { data } = await getSupabaseAdmin().from("guests").select("*").eq("id", id).single();
      guest = (data as Guest) ?? null;
    } catch { guest = null; }
  }
  if (!guest) return new Response("Introuvable.", { status: 404 });

  const base = await getBaseUrl();
  const url  = `${base}/invitation/${id}`;

  const [qr, display, script] = await Promise.all([
    QRCode.toDataURL(url, { margin: 1, width: 520, color: { dark: INK, light: CREAM } }),
    loadFont("Cormorant Garamond", 600),
    loadFont("Great Vibes", 400),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[] = [];
  if (display) fonts.push({ name: "Display", data: display, weight: 600, style: "normal" });
  if (script)  fonts.push({ name: "Script",  data: script,  weight: 400, style: "normal" });

  const kente   = kenteBandUri(W, 36);
  const mud     = mudclothUri();
  const header  = headerUri(W, 260);
  const convie  = guest.party_size > 1 ? "Vous êtes conviés" : "Vous êtes convié(e)";
  const party   = `${guest.party_size} ${guest.party_size > 1 ? "personnes" : "personne"}`;
  const table   = guest.table_number ? `Table ${guest.table_number}` : null;
  const nameFsz = guest.full_name.length > 22 ? 72 : guest.full_name.length > 16 ? 82 : 96;

  /* ── Composants SVG inline ── */
  /* ConcentricCircles — 100×100 viewBox, color=ORANGE/60% */
  const cc = (
    <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={ORANGE} strokeWidth="0.8" opacity="0.42" />
      <circle cx="50" cy="50" r="38" stroke={ORANGE} strokeWidth="0.7" opacity="0.40" />
      <circle cx="50" cy="50" r="30" stroke={ORANGE} strokeWidth="0.8" opacity="0.44" />
      <circle cx="50" cy="50" r="22" stroke={ORANGE} strokeWidth="0.7" opacity="0.42" />
      <circle cx="50" cy="50" r="14" stroke={ORANGE} strokeWidth="0.8" opacity="0.48" />
      <circle cx="50" cy="50" r="6"  stroke={ORANGE} strokeWidth="0.7" opacity="0.45" />
      <circle cx="50" cy="50" r="2"  fill={ORANGE}                     opacity="0.55" />
      <line x1="50" y1="3"  x2="50" y2="97" stroke={ORANGE} strokeWidth="0.5" opacity="0.22" />
      <line x1="3"  y1="50" x2="97" y2="50" stroke={ORANGE} strokeWidth="0.5" opacity="0.22" />
    </svg>
  );

  /* MotifDivider */
  const divider = (
    <svg width="560" height="60" viewBox="0 0 280 30" fill="none">
      <line x1="0"   y1="15" x2="92"  y2="15" stroke={SAND} strokeWidth="0.75" opacity="0.5" />
      <line x1="188" y1="15" x2="280" y2="15" stroke={SAND} strokeWidth="0.75" opacity="0.5" />
      <path d="M92,15 C96,9 106,8 110,12 C106,16 96,18 92,15 Z"   stroke={SAND} strokeWidth="1" opacity="0.85" />
      <path d="M104,9 C108,4 115,4 117,8"                          stroke={SAND} strokeWidth="0.85" opacity="0.65" />
      <path d="M140 4 L153 15 L140 26 L127 15 Z"                   stroke={ORANGE} strokeWidth="1.3" />
      <path d="M140 9 L147 15 L140 21 L133 15 Z"                   fill={ORANGE} opacity="0.8" />
      <path d="M188,15 C184,9 174,8 170,12 C174,16 184,18 188,15 Z" stroke={SAND} strokeWidth="1" opacity="0.85" />
      <path d="M176,9 C172,4 165,4 163,8"                           stroke={SAND} strokeWidth="0.85" opacity="0.65" />
    </svg>
  );

  /* BotanicalAccent — mirrored left & right */
  const botanical = (
    <svg width="90" height="75" viewBox="0 0 120 100" fill="none">
      <path d="M60 90 C60 70 58 50 55 30" stroke={INK} strokeWidth="1" opacity="0.22" />
      <path d="M55 65 C45 55 30 52 28 58 C32 66 48 66 55 65 Z" stroke={INK} strokeWidth="0.9" opacity="0.22" />
      <path d="M55 50 C42 38 28 36 26 44 C30 52 48 54 55 50 Z" stroke={INK} strokeWidth="0.9" opacity="0.20" />
      <path d="M56 35 C46 22 34 20 33 28 C37 36 52 38 56 35 Z" stroke={INK} strokeWidth="0.9" opacity="0.18" />
      <path d="M57 60 C67 50 82 48 83 54 C80 62 65 63 57 60 Z" stroke={INK} strokeWidth="0.9" opacity="0.20" />
      <path d="M57 44 C69 33 84 32 84 40 C81 48 65 49 57 44 Z" stroke={INK} strokeWidth="0.9" opacity="0.18" />
    </svg>
  );

  /* Star/diamond separator */
  const star = (
    <svg width="24" height="24" viewBox="0 0 20 20" fill={ORANGE} opacity="0.6">
      <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
    </svg>
  );

  const image = new ImageResponse(
    (
      /* Transparent root so PNG corners are empty; card is the non-root child that gets clipped */
      <div style={{ width: W, height: H, display: "flex" }}>
      <div style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        backgroundColor: IVORY,
        backgroundImage: `url(${mud})`,
        backgroundSize: `${W}px ${H}px`,
        borderRadius: R,
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Bordure intérieure décorative */}
        <div style={{ position: "absolute", top: 32, left: 32, right: 32, bottom: 32, border: `1.5px solid ${SAND}55`, borderRadius: R - 16, display: "flex" }} />

        {/* ── Entête ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>

          {/* Frise kente */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={kente} width={W} height={36} alt="" style={{ display: "flex", flexShrink: 0 }} />

          {/* Coup de pinceau + zone header */}
          <div style={{ width: W, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={header} width={W} height={260} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
            {/* Sceau cercles concentriques */}
            <div style={{ display: "flex", paddingTop: 52, paddingBottom: 20, zIndex: 1 }}>
              {cc}
            </div>
          </div>
        </div>

        {/* ── Corps ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 90px 90px", position: "relative", zIndex: 2 }}>

          {/* Branches d'olivier latérales */}
          <div style={{ position: "absolute", left: 10, top: 0, display: "flex", opacity: 0.7 }}>
            <svg viewBox="0 0 70 220" fill="none" width="70" height="220">
              <path d="M35 215 C33 180 35 145 38 110 C41 75 44 42 36 12" stroke={INK} strokeWidth="1.3" opacity="0.18" />
              <path d="M37 185 C25 174 10 168 8 175 C13 186 28 188 37 185 Z"  stroke={INK} strokeWidth="1" opacity="0.18" />
              <path d="M38 172 C52 161 66 156 65 163 C61 174 46 175 38 172 Z" stroke={INK} strokeWidth="1" opacity="0.16" />
              <path d="M37 155 C23 143 8 137 7 145 C12 157 28 158 37 155 Z"   stroke={INK} strokeWidth="1" opacity="0.16" />
              <path d="M39 140 C53 129 67 124 66 132 C62 143 47 143 39 140 Z" stroke={INK} strokeWidth="1" opacity="0.14" />
              <path d="M37 122 C23 110 9 104 8 112 C13 124 28 125 37 122 Z"   stroke={INK} strokeWidth="1" opacity="0.14" />
            </svg>
          </div>
          <div style={{ position: "absolute", right: 10, top: 0, display: "flex", opacity: 0.7, transform: "scaleX(-1)" }}>
            <svg viewBox="0 0 70 220" fill="none" width="70" height="220">
              <path d="M35 215 C33 180 35 145 38 110 C41 75 44 42 36 12" stroke={INK} strokeWidth="1.3" opacity="0.18" />
              <path d="M37 185 C25 174 10 168 8 175 C13 186 28 188 37 185 Z"  stroke={INK} strokeWidth="1" opacity="0.18" />
              <path d="M38 172 C52 161 66 156 65 163 C61 174 46 175 38 172 Z" stroke={INK} strokeWidth="1" opacity="0.16" />
              <path d="M37 155 C23 143 8 137 7 145 C12 157 28 158 37 155 Z"   stroke={INK} strokeWidth="1" opacity="0.16" />
              <path d="M39 140 C53 129 67 124 66 132 C62 143 47 143 39 140 Z" stroke={INK} strokeWidth="1" opacity="0.14" />
              <path d="M37 122 C23 110 9 104 8 112 C13 124 28 125 37 122 Z"   stroke={INK} strokeWidth="1" opacity="0.14" />
            </svg>
          </div>

          {/* Script d'invitation */}
          <div style={{ display: "flex", fontFamily: "Script", fontSize: 72, color: ORANGE_LIGHT, marginBottom: 8, marginTop: 16 }}>
            {convie}
          </div>

          {/* Nom de l'invité */}
          <div style={{ display: "flex", fontFamily: "Display", fontSize: nameFsz, color: INK, textAlign: "center", lineHeight: 1.1, maxWidth: 860 }}>
            {guest.full_name}
          </div>

          {/* MotifDivider */}
          <div style={{ display: "flex", margin: "40px 0 28px" }}>
            {divider}
          </div>

          {/* "AU MARIAGE DE" */}
          <div style={{ display: "flex", fontSize: 28, letterSpacing: "0.26em", color: `${INK_SOFT}88`, textTransform: "uppercase" }}>
            au mariage de
          </div>

          {/* Noms des mariés + BotanicalAccent */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 16 }}>
            <div style={{ display: "flex", transform: "scaleX(-1)" }}>{botanical}</div>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Display", fontSize: 90, color: INK, gap: 12 }}>
              {wedding.groom.firstName}
              <span style={{ fontFamily: "Script", fontSize: 76, color: ORANGE, margin: "0 8px" }}>&amp;</span>
              {wedding.bride.firstName}
            </div>
            <div style={{ display: "flex" }}>{botanical}</div>
          </div>

          {/* Séparateur étoile + filets */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, margin: "44px 0 16px" }}>
            <div style={{ display: "flex", width: 120, height: 1, backgroundColor: SAND, opacity: 0.6 }} />
            {star}
            <div style={{ display: "flex", width: 120, height: 1, backgroundColor: SAND, opacity: 0.6 }} />
          </div>

          {/* Date & heure */}
          <div style={{ display: "flex", fontSize: 34, letterSpacing: "0.2em", color: ORANGE, textTransform: "uppercase" }}>
            {wedding.dayLabel} {wedding.dateLabel} · {wedding.timeLabel}
          </div>

          {/* Lieu */}
          <div style={{ display: "flex", fontSize: 32, color: INK_SOFT, marginTop: 10 }}>
            {wedding.venue} · {wedding.city}
          </div>

          {/* QR code */}
          <div style={{ display: "flex", backgroundColor: CREAM, borderRadius: 28, padding: 24, marginTop: 56, border: `1.5px solid ${SAND}88` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={320} height={320} alt="QR code" />
          </div>
          <div style={{ display: "flex", fontSize: 26, color: `${INK_SOFT}77`, marginTop: 16 }}>
            Présentez ce QR code à l&apos;entrée
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
            <div style={{ display: "flex", padding: "12px 36px", borderRadius: 999, border: `1.5px solid ${ORANGE}55`, color: ORANGE, fontSize: 28 }}>{party}</div>
            {table && <div style={{ display: "flex", padding: "12px 36px", borderRadius: 999, border: `1.5px solid ${ORANGE}55`, color: ORANGE, fontSize: 28 }}>{table}</div>}
            <div style={{ display: "flex", padding: "12px 36px", borderRadius: 999, border: `1.5px solid ${ORANGE}55`, color: ORANGE, fontSize: 28 }}>Mariage coutumier</div>
          </div>

          {/* Accent botanique bas — inversé */}
          <div style={{ display: "flex", marginTop: 56, transform: "scaleY(-1)" }}>
            {botanical}
          </div>

        </div>

        {/* Frise kente — bas */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={kente} width={W} height={36} alt="" style={{ display: "flex", flexShrink: 0, position: "relative", zIndex: 2 }} />

        {/* ── Coins arrondis — wedges ivoire sur les 4 coins (satori ne supporte pas overflow:hidden sur img) ── */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 0, left: 0, zIndex: 200, display: "flex" }}>
          <path d={`M0,0 L${R},0 A${R},${R} 0 0,0 0,${R} Z`}                     fill={IVORY}/>
          <path d={`M${W},0 L${W-R},0 A${R},${R} 0 0,1 ${W},${R} Z`}             fill={IVORY}/>
          <path d={`M0,${H} L0,${H-R} A${R},${R} 0 0,1 ${R},${H} Z`}             fill={IVORY}/>
          <path d={`M${W},${H} L${W},${H-R} A${R},${R} 0 0,0 ${W-R},${H} Z`}     fill={IVORY}/>
        </svg>

      </div>
      </div>
    ),
    { width: W, height: H, fonts: fonts.length ? fonts : undefined }
  );

  const { searchParams } = new URL(req.url);
  if (searchParams.get("download")) {
    image.headers.set("Content-Disposition", `attachment; filename="invitation-${slugify(guest.full_name)}.png"`);
  }
  image.headers.set("Cache-Control", "no-store");
  return image;
}
