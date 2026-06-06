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
