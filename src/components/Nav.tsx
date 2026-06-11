"use client";

import { useEffect, useState } from "react";
import { monogram } from "@/lib/wedding";

const LINKS = [
  { href: "#notre-histoire", label: "Notre histoire" },
  { href: "#ceremonies", label: "Le grand jour" },
  { href: "#galerie", label: "Galerie" },
  { href: "#rsvp", label: "Un mot pour nous" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-deep/95 backdrop-blur-md shadow-[0_8px_30px_-15px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#accueil"
          className={`font-display text-xl tracking-wide-sm transition-colors duration-300 ${
            scrolled ? "text-gold-light" : "text-ink/80"
          }`}
          aria-label="Retour en haut"
        >
          {monogram}
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`nav-link whitespace-nowrap text-xs uppercase tracking-wide-sm transition-colors duration-300 ${
                  scrolled
                    ? "text-cream/80 hover:text-gold-light"
                    : "text-ink/65 hover:text-gold"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton mobile */}
        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 transition-all duration-300 ${
              scrolled ? "bg-gold-light" : "bg-ink/65"
            } ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 transition-all duration-300 ${
              scrolled ? "bg-gold-light" : "bg-ink/65"
            } ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 transition-all duration-300 ${
              scrolled ? "bg-gold-light" : "bg-ink/65"
            } ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Menu mobile déroulant */}
      <div
        className={`overflow-hidden bg-deep/98 backdrop-blur-md transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm uppercase tracking-wide-sm text-cream/80 hover:text-gold-light"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
