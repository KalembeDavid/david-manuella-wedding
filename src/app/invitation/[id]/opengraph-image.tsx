import { ImageResponse } from "next/og";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { wedding } from "@/lib/wedding";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let guestName = "Invité(e)";
  let partySize = 1;
  try {
    if (isSupabaseConfigured()) {
      const { data } = await getSupabaseAdmin()
        .from("guests")
        .select("full_name, party_size")
        .eq("id", id)
        .single();
      if (data?.full_name) guestName = data.full_name;
      if (data?.party_size) partySize = data.party_size;
    }
  } catch {}

  const convie = partySize > 1 ? "conviés" : "convié(e)";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f4ede5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top terracotta bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#cd5b21",
          }}
        />

        {/* Sand decorative line */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 0,
            right: 0,
            height: 4,
            background: "#cbad8d",
          }}
        />

        {/* Script intro */}
        <p
          style={{
            color: "#b87545",
            fontSize: 34,
            margin: "0 0 6px",
            fontStyle: "italic",
          }}
        >
          Invitation personnelle
        </p>

        {/* Guest name */}
        <p
          style={{
            color: "#2d1307",
            fontSize: 68,
            fontWeight: "bold",
            margin: "0 0 6px",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {guestName}
        </p>

        {/* Subtitle */}
        <p style={{ color: "#7a5242", fontSize: 26, margin: "0 0 36px" }}>
          est {convie} au mariage de
        </p>

        {/* Couple names */}
        <p
          style={{
            color: "#2d1307",
            fontSize: 72,
            fontWeight: "bold",
            margin: "0 0 20px",
            letterSpacing: "-1px",
          }}
        >
          {wedding.groom.firstName}{" "}
          <span style={{ color: "#cd5b21", fontStyle: "italic", fontWeight: "normal" }}>
            &amp;
          </span>{" "}
          {wedding.bride.firstName}
        </p>

        {/* Date & venue */}
        <p style={{ color: "#cd5b21", fontSize: 28, margin: "0 0 6px", letterSpacing: "2px" }}>
          {wedding.dayLabel.toUpperCase()} {wedding.dateLabel.toUpperCase()} · {wedding.timeLabel.toUpperCase()}
        </p>
        <p style={{ color: "#7a5242", fontSize: 24, margin: 0 }}>
          {wedding.venue} · {wedding.city}
        </p>

        {/* Bottom bars */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            height: 4,
            background: "#cbad8d",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#cd5b21",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
