import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Great_Vibes } from "next/font/google";
import "./globals.css";
import { wedding } from "@/lib/wedding";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${wedding.groom.firstName} & ${wedding.bride.firstName} — Mariage coutumier · ${wedding.dateLabel}`,
  description: `${wedding.groom.firstName} & ${wedding.bride.firstName} ont la joie de vous convier à leur mariage coutumier, le ${wedding.dayLabel.toLowerCase()} ${wedding.dateLabel} à ${wedding.timeLabel}, ${wedding.venue} — ${wedding.city}. Confirmez votre présence et laissez-leur un mot.`,
  openGraph: {
    title: `${wedding.groom.firstName} & ${wedding.bride.firstName} se marient`,
    description: `${wedding.dayLabel} ${wedding.dateLabel} · ${wedding.timeLabel} · ${wedding.venue}, ${wedding.city}`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
