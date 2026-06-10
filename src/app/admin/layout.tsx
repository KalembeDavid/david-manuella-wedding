import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace admin — David & Manuella",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
