import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Parisienne } from "next/font/google";
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

const script = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${wedding.groom.firstName} & ${wedding.bride.firstName} — ${wedding.dateLabel}`,
  description: `Faire-part de mariage de ${wedding.groom.firstName} & ${wedding.bride.firstName}. ${wedding.dateLabel} à ${wedding.venue}, ${wedding.city}. Confirmez votre présence.`,
  openGraph: {
    title: `${wedding.groom.firstName} & ${wedding.bride.firstName} se marient`,
    description: `${wedding.dateLabel} · ${wedding.venue}, ${wedding.city}`,
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
