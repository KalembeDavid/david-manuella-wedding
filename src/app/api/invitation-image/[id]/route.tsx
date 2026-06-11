import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { getSupabaseAdmin, isSupabaseConfigured, type Guest } from "@/lib/supabaseAdmin";
import { getBaseUrl } from "@/lib/baseUrl";
import { wedding, monogram } from "@/lib/wedding";

export const runtime = "nodejs";

/* Palette du site (cf. globals.css — thème « Noir & Or ») */
const DEEP = "#15100a";
const DEEP_ALT = "#2c2415";
const QR_INK = "#131008";
const ORANGE = "#c49a2c";
const GOLD = "#c49a2c";
const GOLD_LIGHT = "#e9cf8e";
const IVORY = "#faf6ee";
const CREAM = "#f1e8d6";

const WIDTH = 1080;
const HEIGHT = 1528;

/* ── Polices Google (ttf) — mises en cache au niveau module ── */
const fontCache = new Map<string, Promise<ArrayBuffer | null>>();

function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}`;
  if (!fontCache.has(key)) {
    fontCache.set(
      key,
      (async () => {
        try {
          const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`;
          // Sans User-Agent navigateur, Google Fonts sert du TTF (requis par satori).
          const css = await (await fetch(cssUrl)).text();
          const m = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
          if (!m) return null;
          return await (await fetch(m[1])).arrayBuffer();
        } catch {
          return null;
        }
      })()
    );
  }
  return fontCache.get(key)!;
}

/* ── Frise kente (chevrons orange/or sur bleu) en SVG data-URI ── */
function kenteBandUri(width: number, height: number): string {
  const unit = 36;
  let paths = "";
  for (let x = 0; x < width; x += unit) {
    paths +=
      `<path d="M${x} ${height} L${x + unit / 2} ${height - 18} L${x + unit} ${height}" fill="none" stroke="${ORANGE}" stroke-width="5"/>` +
      `<path d="M${x} ${height - 9} L${x + unit / 2} ${height - 27} L${x + unit} ${height - 9}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="3.5"/>` +
      `<path d="M${x} ${height - 18} L${x + unit / 2} ${height - 36} L${x + unit} ${height - 18}" fill="none" stroke="${GOLD}" stroke-width="2.5"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${DEEP}"/>${paths}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "invite"
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let guest: Guest | null = null;
  if (id === "apercu" && process.env.NODE_ENV !== "production") {
    // Aperçu local du design sans base de données (dev uniquement)
    guest = {
      id: "apercu",
      full_name: "Jean-Pierre Mwamba",
      phone: null,
      party_size: 2,
      table_number: 3,
      message: null,
      checked_in: false,
      checked_in_at: null,
      created_at: new Date().toISOString(),
    };
  } else {
    if (!isSupabaseConfigured()) {
      return new Response("Base de données non configurée.", { status: 503 });
    }
    try {
      const { data } = await getSupabaseAdmin()
        .from("guests")
        .select("*")
        .eq("id", id)
        .single();
      guest = (data as Guest) ?? null;
    } catch {
      guest = null;
    }
  }
  if (!guest) return new Response("Invitation introuvable.", { status: 404 });

  const base = await getBaseUrl();
  const invitationUrl = `${base}/invitation/${id}`;

  const [qr, display, script] = await Promise.all([
    QRCode.toDataURL(invitationUrl, {
      margin: 1,
      width: 560,
      color: { dark: QR_INK, light: `${IVORY}ff` },
    }),
    loadGoogleFont("Cormorant Garamond", 600),
    loadGoogleFont("Great Vibes", 400),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[] = [];
  if (display) fonts.push({ name: "Display", data: display, weight: 600, style: "normal" });
  if (script) fonts.push({ name: "Script", data: script, weight: 400, style: "normal" });

  const band = kenteBandUri(WIDTH, 36);
  const partyLabel = `${guest.party_size} ${guest.party_size > 1 ? "personnes" : "personne"}`;
  const tableLabel = guest.table_number ? `Table ${guest.table_number}` : null;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: DEEP,
          // même dégradé que .bg-wax-dark du site (tan → brun wax)
          backgroundImage: `linear-gradient(160deg, ${DEEP_ALT} 0%, ${DEEP} 55%)`,
        }}
      >
        {/* Frise kente — haut */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={band} width={WIDTH} height={36} alt="" />

        {/* Corps */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "44px 64px",
            position: "relative",
          }}
        >
          {/* Cadre doré */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 36,
              right: 36,
              bottom: 24,
              border: `2px solid ${GOLD}55`,
              borderRadius: 36,
              display: "flex",
            }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: 40,
              letterSpacing: "0.3em",
              color: GOLD_LIGHT,
            }}
          >
            {monogram}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Script",
              fontSize: 58,
              color: GOLD_LIGHT,
              marginTop: 28,
            }}
          >
            Vous êtes convié(e)
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: guest.full_name.length > 22 ? 64 : 80,
              color: IVORY,
              marginTop: 18,
              textAlign: "center",
            }}
          >
            {guest.full_name}
          </div>

          {/* Séparateur losange */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 26,
              marginBottom: 26,
            }}
          >
            <div style={{ display: "flex", width: 130, height: 2, backgroundColor: `${GOLD}88` }} />
            <div
              style={{
                display: "flex",
                width: 16,
                height: 16,
                backgroundColor: GOLD,
                transform: "rotate(45deg)",
                margin: "0 18px",
              }}
            />
            <div style={{ display: "flex", width: 130, height: 2, backgroundColor: `${GOLD}88` }} />
          </div>

          <div style={{ display: "flex", fontSize: 30, color: `${CREAM}cc` }}>
            au mariage coutumier de
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Display",
              fontSize: 66,
              color: IVORY,
              marginTop: 8,
            }}
          >
            {wedding.groom.firstName}
            <span
              style={{
                fontFamily: "Script",
                fontSize: 56,
                color: ORANGE,
                margin: "0 20px",
              }}
            >
              &
            </span>
            {wedding.bride.firstName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 32,
              letterSpacing: "0.22em",
              color: GOLD_LIGHT,
              marginTop: 30,
              textTransform: "uppercase",
            }}
          >
            {wedding.dayLabel} {wedding.dateLabel} · {wedding.timeLabel}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: `${CREAM}cc`, marginTop: 10 }}>
            {wedding.venue} · {wedding.city} · {wedding.country}
          </div>

          {/* QR code */}
          <div
            style={{
              display: "flex",
              backgroundColor: IVORY,
              borderRadius: 28,
              padding: 20,
              marginTop: 40,
              border: `3px solid ${GOLD}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={330} height={330} alt="QR code" />
          </div>
          <div style={{ display: "flex", fontSize: 26, color: `${CREAM}aa`, marginTop: 18 }}>
            Présentez ce QR code à l&apos;entrée
          </div>

          {/* Badges personnes + table */}
          <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 34px",
                borderRadius: 999,
                border: `2px solid ${GOLD}77`,
                color: CREAM,
                fontSize: 28,
              }}
            >
              {partyLabel}
            </div>
            {tableLabel && (
              <div
                style={{
                  display: "flex",
                  padding: "10px 34px",
                  borderRadius: 999,
                  backgroundColor: `${GOLD}22`,
                  border: `2px solid ${GOLD}99`,
                  color: GOLD_LIGHT,
                  fontSize: 28,
                  fontFamily: "Display",
                }}
              >
                {tableLabel}
              </div>
            )}
          </div>
        </div>

        {/* Frise kente — bas */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={band}
          width={WIDTH}
          height={36}
          alt=""
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );

  // ?download=1 → téléchargement direct avec un joli nom de fichier
  const { searchParams } = new URL(req.url);
  if (searchParams.get("download")) {
    image.headers.set(
      "Content-Disposition",
      `attachment; filename="invitation-${slugify(guest.full_name)}.png"`
    );
  }
  image.headers.set("Cache-Control", "no-store");
  return image;
}
