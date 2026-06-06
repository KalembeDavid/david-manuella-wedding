/**
 * Motifs décoratifs inspirés de l'art traditionnel africain
 * (losanges, triangles, frises type « kente »/« mudcloth »).
 */

/** Séparateur géométrique doré — losange central + zigzags + filets. */
export function MotifDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`my-8 flex items-center justify-center text-gold ${className}`}
      aria-hidden
    >
      <svg
        width="260"
        height="26"
        viewBox="0 0 260 26"
        fill="none"
        className="w-[min(72%,260px)]"
      >
        {/* filets latéraux */}
        <line x1="0" y1="13" x2="86" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <line x1="174" y1="13" x2="260" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        {/* zigzag gauche */}
        <path d="M92 13 L99 6 L106 13 L113 6" stroke="currentColor" strokeWidth="1" />
        {/* zigzag droite */}
        <path d="M168 13 L161 6 L154 13 L147 6" stroke="currentColor" strokeWidth="1" />
        {/* losange central */}
        <path d="M130 2 L143 13 L130 24 L117 13 Z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M130 8 L137 13 L130 18 L123 13 Z" fill="currentColor" opacity="0.85" />
      </svg>
    </div>
  );
}

/** Frise « kente » répétée horizontalement (triangles or/rouge). */
export function KenteBand({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`kente-band ${className}`} />;
}

/** Grille de losanges en filigrane (à placer dans un conteneur `relative`). */
export function MotifGrid() {
  return <div aria-hidden className="motif-grid" />;
}

/**
 * Texture "mudcloth" vectorielle — INSPIRÉE des images de référence
 * (zigzags, losanges, croix, points), sans utiliser les images directement.
 * À placer dans une section `relative overflow-hidden`, contenu en z-10.
 */
export function MotifMudcloth() {
  return <div aria-hidden className="motif-mudcloth" />;
}

/** Petits losanges dorés qui flottent doucement (couche de "délice"). */
export function FloatingAccents() {
  const items: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    size: number;
    delay: number;
    dur: number;
  }[] = [
    { top: "16%", left: "10%", size: 14, delay: 0, dur: 7 },
    { top: "28%", right: "12%", size: 10, delay: 1.2, dur: 8.5 },
    { top: "66%", left: "16%", size: 8, delay: 0.6, dur: 6.5 },
    { bottom: "14%", right: "18%", size: 12, delay: 1.8, dur: 7.8 },
    { top: "46%", left: "44%", size: 6, delay: 0.9, dur: 9.2 },
    { bottom: "24%", left: "30%", size: 9, delay: 2.4, dur: 8 },
  ];
  return (
    <>
      {items.map((it, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute block animate-float-slow bg-gold/25"
          style={{
            top: it.top,
            left: it.left,
            right: it.right,
            bottom: it.bottom,
            width: it.size,
            height: it.size,
            rotate: "45deg",
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.dur}s`,
          }}
        />
      ))}
    </>
  );
}

/** Ornement d'angle en losanges, pour encadrer une section. */
export function MotifCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={`text-gold/40 ${className}`}
    >
      <path d="M4 4 L20 4 M4 4 L4 20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 12 L20 20" stroke="currentColor" strokeWidth="1" />
      <path d="M10 22 L16 16 L22 22 L16 28 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M22 10 L28 16 L22 22" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
