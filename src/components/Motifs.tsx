/**
 * Motifs décoratifs — art traditionnel africain + éléments botaniques
 * Kente, mudcloth, losanges, frises, coups de pinceau terracotta.
 */

/** Colonne de motifs africains géométriques — bord gauche du héro. */
export function AfricanMotifColumn({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMin meet"
      className={className}
    >
      {/* Chevrons 1 */}
      <path d="M4 14 L20 4 L36 14" stroke="currentColor" strokeWidth="1.5" opacity="0.78" strokeLinecap="round" />
      <path d="M4 21 L20 11 L36 21" stroke="currentColor" strokeWidth="1.4" opacity="0.56" strokeLinecap="round" />
      <path d="M4 28 L20 18 L36 28" stroke="currentColor" strokeWidth="1.3" opacity="0.36" strokeLinecap="round" />
      {/* Bullseye 1 */}
      <circle cx="20" cy="54" r="12"  stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      <circle cx="20" cy="54" r="7.5" stroke="currentColor" strokeWidth="0.9" opacity="0.50" />
      <circle cx="20" cy="54" r="3"   fill="currentColor"                     opacity="0.55" />
      {/* Diamond */}
      <path d="M20 76 L33 89 L20 102 L7 89 Z" stroke="currentColor" strokeWidth="1.2" opacity="0.58" />
      <path d="M20 81 L28 89 L20 97 L12 89 Z" fill="currentColor"                    opacity="0.28" />
      {/* Chevrons 2 */}
      <path d="M4 120 L20 110 L36 120" stroke="currentColor" strokeWidth="1.5" opacity="0.72" strokeLinecap="round" />
      <path d="M4 127 L20 117 L36 127" stroke="currentColor" strokeWidth="1.4" opacity="0.52" strokeLinecap="round" />
      <path d="M4 134 L20 124 L36 134" stroke="currentColor" strokeWidth="1.3" opacity="0.34" strokeLinecap="round" />
      {/* Sun adinkra */}
      <circle cx="20" cy="162" r="13" stroke="currentColor" strokeWidth="1"   opacity="0.38" />
      <circle cx="20" cy="162" r="8"  stroke="currentColor" strokeWidth="0.9" opacity="0.44" />
      <circle cx="20" cy="162" r="3"  fill="currentColor"                     opacity="0.46" />
      <line x1="20" y1="149" x2="20" y2="175" stroke="currentColor" strokeWidth="0.7" opacity="0.28" />
      <line x1="7"  y1="162" x2="33" y2="162" stroke="currentColor" strokeWidth="0.7" opacity="0.28" />
      <line x1="11" y1="153" x2="29" y2="171" stroke="currentColor" strokeWidth="0.6" opacity="0.20" />
      <line x1="29" y1="153" x2="11" y2="171" stroke="currentColor" strokeWidth="0.6" opacity="0.20" />
      {/* Triangle up */}
      <path d="M20 192 L34 214 L6 214 Z"  stroke="currentColor" strokeWidth="1.2" opacity="0.52" />
      <path d="M20 197 L29 214 L11 214 Z" fill="currentColor"                    opacity="0.20" />
      {/* Chevrons 3 */}
      <path d="M4 232 L20 222 L36 232" stroke="currentColor" strokeWidth="1.5" opacity="0.68" strokeLinecap="round" />
      <path d="M4 239 L20 229 L36 239" stroke="currentColor" strokeWidth="1.4" opacity="0.50" strokeLinecap="round" />
      <path d="M4 246 L20 236 L36 246" stroke="currentColor" strokeWidth="1.3" opacity="0.32" strokeLinecap="round" />
      {/* Cross in square */}
      <rect x="8"  y="262" width="24" height="24" stroke="currentColor" strokeWidth="1"   opacity="0.42" />
      <line x1="8"  y1="274" x2="32" y2="274"    stroke="currentColor" strokeWidth="0.8" opacity="0.30" />
      <line x1="20" y1="262" x2="20" y2="286"    stroke="currentColor" strokeWidth="0.8" opacity="0.30" />
      {/* Bullseye 2 */}
      <circle cx="20" cy="316" r="12"  stroke="currentColor" strokeWidth="1"   opacity="0.40" />
      <circle cx="20" cy="316" r="7"   stroke="currentColor" strokeWidth="0.9" opacity="0.46" />
      <circle cx="20" cy="316" r="2.5" fill="currentColor"                     opacity="0.50" />
      {/* Chevrons 4 */}
      <path d="M4 338 L20 328 L36 338" stroke="currentColor" strokeWidth="1.5" opacity="0.65" strokeLinecap="round" />
      <path d="M4 345 L20 335 L36 345" stroke="currentColor" strokeWidth="1.4" opacity="0.47" strokeLinecap="round" />
      <path d="M4 352 L20 342 L36 352" stroke="currentColor" strokeWidth="1.3" opacity="0.30" strokeLinecap="round" />
      {/* Double diamond chain */}
      <path d="M20 368 L28 376 L20 384 L12 376 Z" stroke="currentColor" strokeWidth="1"   opacity="0.52" />
      <line x1="20" y1="384" x2="20" y2="390"    stroke="currentColor" strokeWidth="0.8" opacity="0.34" />
      <path d="M20 390 L28 398 L20 406 L12 398 Z" stroke="currentColor" strokeWidth="1"   opacity="0.44" />
      {/* Chevrons 5 */}
      <path d="M4 424 L20 414 L36 424" stroke="currentColor" strokeWidth="1.5" opacity="0.62" strokeLinecap="round" />
      <path d="M4 431 L20 421 L36 431" stroke="currentColor" strokeWidth="1.4" opacity="0.44" strokeLinecap="round" />
      <path d="M4 438 L20 428 L36 438" stroke="currentColor" strokeWidth="1.3" opacity="0.28" strokeLinecap="round" />
      {/* Wheel */}
      <circle cx="20" cy="468" r="13"  stroke="currentColor" strokeWidth="0.9" opacity="0.38" />
      <circle cx="20" cy="468" r="7.5" stroke="currentColor" strokeWidth="0.9" opacity="0.44" />
      <circle cx="20" cy="468" r="2.5" fill="currentColor"                     opacity="0.46" />
      <line x1="20" y1="455" x2="20" y2="481" stroke="currentColor" strokeWidth="0.6" opacity="0.24" />
      <line x1="7"  y1="468" x2="33" y2="468" stroke="currentColor" strokeWidth="0.6" opacity="0.24" />
      {/* Triangle down */}
      <path d="M6 496 L34 496 L20 516 Z"  stroke="currentColor" strokeWidth="1.2" opacity="0.50" />
      <path d="M11 496 L29 496 L20 510 Z" fill="currentColor"                    opacity="0.20" />
      {/* Chevrons 6 */}
      <path d="M4 532 L20 522 L36 532" stroke="currentColor" strokeWidth="1.5" opacity="0.60" strokeLinecap="round" />
      <path d="M4 539 L20 529 L36 539" stroke="currentColor" strokeWidth="1.4" opacity="0.42" strokeLinecap="round" />
      <path d="M4 546 L20 536 L36 546" stroke="currentColor" strokeWidth="1.3" opacity="0.26" strokeLinecap="round" />
      {/* Dots row */}
      <circle cx="8"  cy="565" r="2" fill="currentColor" opacity="0.40" />
      <circle cx="20" cy="565" r="2" fill="currentColor" opacity="0.50" />
      <circle cx="32" cy="565" r="2" fill="currentColor" opacity="0.40" />
      {/* Final bullseye */}
      <circle cx="20" cy="594" r="13" stroke="currentColor" strokeWidth="1.1" opacity="0.36" />
      <circle cx="20" cy="594" r="8"  stroke="currentColor" strokeWidth="0.9" opacity="0.42" />
      <circle cx="20" cy="594" r="3"  fill="currentColor"                     opacity="0.44" />
    </svg>
  );
}

/** Séparateur botanique — losange central flanqué de feuilles. */
export function MotifDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`my-8 flex items-center justify-center text-gold ${className}`}
      aria-hidden
    >
      <svg
        width="280"
        height="30"
        viewBox="0 0 280 30"
        fill="none"
        className="w-[min(72%,280px)]"
      >
        <line x1="0"   y1="15" x2="92"  y2="15" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <line x1="188" y1="15" x2="280" y2="15" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <path d="M92,15 C96,9 106,8 110,12 C106,16 96,18 92,15 Z" stroke="currentColor" strokeWidth="1" opacity="0.85" />
        <path d="M104,9 C108,4 115,4 117,8" stroke="currentColor" strokeWidth="0.85" opacity="0.65" />
        <path d="M140 4 L153 15 L140 26 L127 15 Z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M140 9 L147 15 L140 21 L133 15 Z" fill="currentColor" opacity="0.8" />
        <path d="M188,15 C184,9 174,8 170,12 C174,16 184,18 188,15 Z" stroke="currentColor" strokeWidth="1" opacity="0.85" />
        <path d="M176,9 C172,4 165,4 163,8" stroke="currentColor" strokeWidth="0.85" opacity="0.65" />
      </svg>
    </div>
  );
}

/** Frise kente répétée horizontalement. */
export function KenteBand({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`kente-band ${className}`} />;
}

/** Grille de chevrons en filigrane (conteneur `relative` requis). */
export function MotifGrid() {
  return <div aria-hidden className="motif-grid" />;
}

/** Texture mudcloth vectorielle pour les sections claires. */
export function MotifMudcloth() {
  return <div aria-hidden className="motif-mudcloth" />;
}

/**
 * Grand coup de pinceau terracotta — arc organique en C, signature du héro.
 * À placer en absolu dans un conteneur `relative overflow-hidden`.
 * Utilise `text-gold` (currentColor = terracotta) pour la couleur.
 */
export function HeroBrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {/* Arc principal — forme en C enveloppant la composition */}
      <path
        d="M 160 15
           C 260 -12 430 0 520 70
           C 580 120 585 240 565 360
           C 545 480 485 558 385 592
           C 295 622 200 610 145 562
           C 105 525 90 478 100 430
           C 108 394 130 378 148 390
           C 166 402 168 432 152 456
           C 135 480 108 480 94 452
           C 79 422 84 374 106 344
           C 124 318 148 306 152 308
           C 160 312 148 256 124 194
           C 102 136 80 72 90 10
           Z"
        fill="currentColor"
        opacity="0.84"
      />
      {/* Lavis secondaire — chaleur sable en fond */}
      <path
        d="M 200 80
           C 290 48 420 58 508 118
           C 558 152 568 240 550 340
           C 532 438 474 502 378 530
           C 296 554 210 544 162 502
           C 132 476 122 440 132 408
           C 140 384 158 372 170 380
           C 182 388 182 412 170 432
           C 158 452 136 452 126 428
           Z"
        fill="currentColor"
        opacity="0.10"
      />
      {/* Éclaboussures de texture */}
      <ellipse cx="486" cy="88"  rx="13" ry="7"  transform="rotate(-22 486 88)"  fill="currentColor" opacity="0.45" />
      <ellipse cx="20"  cy="205" rx="8"  ry="4"  transform="rotate(14 20 205)"   fill="currentColor" opacity="0.35" />
      <ellipse cx="68"  cy="490" rx="10" ry="5"  transform="rotate(-12 68 490)"  fill="currentColor" opacity="0.38" />
      <ellipse cx="528" cy="402" rx="9"  ry="5"  transform="rotate(28 528 402)"  fill="currentColor" opacity="0.32" />
      <ellipse cx="388" cy="18"  rx="7"  ry="4"  transform="rotate(5 388 18)"    fill="currentColor" opacity="0.32" />
    </svg>
  );
}

/**
 * Branche d'olivier — élément botanique fin, bord droit du héro.
 */
export function OliveBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 220" fill="none" aria-hidden className={className}>
      <path d="M35 215 C33 180 35 145 38 110 C41 75 44 42 36 12" stroke="currentColor" strokeWidth="1.3" opacity="0.65" />
      <path d="M37 185 C25 174 10 168 8 175 C13 186 28 188 37 185 Z"  stroke="currentColor" strokeWidth="1" opacity="0.72" />
      <path d="M38 172 C52 161 66 156 65 163 C61 174 46 175 38 172 Z" stroke="currentColor" strokeWidth="1" opacity="0.68" />
      <path d="M37 155 C23 143 8 137 7 145 C12 157 28 158 37 155 Z"   stroke="currentColor" strokeWidth="1" opacity="0.68" />
      <path d="M39 140 C53 129 67 124 66 132 C62 143 47 143 39 140 Z" stroke="currentColor" strokeWidth="1" opacity="0.64" />
      <path d="M37 122 C23 110 9 104 8 112 C13 124 28 125 37 122 Z"   stroke="currentColor" strokeWidth="1" opacity="0.64" />
      <path d="M39 106 C52 95 65 90 64 98 C60 110 45 110 39 106 Z"    stroke="currentColor" strokeWidth="1" opacity="0.60" />
      <path d="M37 88 C24 76 10 70 10 78 C15 90 29 90 37 88 Z"         stroke="currentColor" strokeWidth="1" opacity="0.60" />
      <path d="M38 72 C51 61 63 57 62 65 C58 76 44 76 38 72 Z"         stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M36 55 C24 43 12 38 12 46 C17 57 30 57 36 55 Z"         stroke="currentColor" strokeWidth="1" opacity="0.50" />
      <path d="M37 38 C48 28 59 24 58 32 C55 43 42 43 37 38 Z"         stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="8"  cy="175" r="2.5" fill="currentColor" opacity="0.38" />
      <circle cx="65" cy="163" r="2.5" fill="currentColor" opacity="0.36" />
      <circle cx="7"  cy="145" r="2"   fill="currentColor" opacity="0.32" />
      <circle cx="66" cy="132" r="2"   fill="currentColor" opacity="0.30" />
    </svg>
  );
}

/**
 * Cercles concentriques — ornement décoratif inspiré adinkra, coin bas-droit.
 */
export function ConcentricCircles({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden className={className}>
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.8" opacity="0.42" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.7" opacity="0.40" />
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.8" opacity="0.44" />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.7" opacity="0.42" />
      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="0.8" opacity="0.48" />
      <circle cx="50" cy="50" r="6"  stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
      <circle cx="50" cy="50" r="2"  fill="currentColor"                     opacity="0.55" />
      <line x1="50" y1="3"  x2="50" y2="97" stroke="currentColor" strokeWidth="0.5" opacity="0.22" />
      <line x1="3"  y1="50" x2="97" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.22" />
    </svg>
  );
}

/**
 * Accent botanique — branche avec feuilles, en trait fin.
 */
export function BotanicalAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M60 90 C60 70 58 50 55 30" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M55 65 C45 55 30 52 28 58 C32 66 48 66 55 65 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
      <path d="M55 50 C42 38 28 36 26 44 C30 52 48 54 55 50 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.7"  />
      <path d="M56 35 C46 22 34 20 33 28 C37 36 52 38 56 35 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.6"  />
      <path d="M57 60 C67 50 82 48 83 54 C80 62 65 63 57 60 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.7"  />
      <path d="M57 44 C69 33 84 32 84 40 C81 48 65 49 57 44 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
    </svg>
  );
}

/** Rayons de soleil — conservé pour compatibilité. */
export function SunRays({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 24 });
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden
      className={`animate-spin-slow ${className}`}
    >
      <g stroke="currentColor">
        {rays.map((_, i) => {
          const angle = (i * 360) / rays.length;
          const long = i % 2 === 0;
          return (
            <line
              key={i}
              x1="300"
              y1={long ? 38 : 86}
              x2="300"
              y2={long ? 132 : 150}
              strokeWidth={long ? 1.4 : 1}
              opacity={long ? 0.9 : 0.5}
              transform={`rotate(${angle} 300 300)`}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="168" stroke="currentColor" strokeWidth="1"   opacity="0.5" />
      <circle cx="300" cy="300" r="176" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/** Losanges dorés flottants — couche de délice (pour sections sombres). */
export function FloatingAccents() {
  const items: {
    top?: string; left?: string; right?: string; bottom?: string;
    size: number; delay: number; dur: number;
  }[] = [
    { top: "16%", left: "10%",     size: 14, delay: 0,   dur: 7   },
    { top: "28%", right: "12%",    size: 10, delay: 1.2, dur: 8.5 },
    { top: "66%", left: "16%",     size: 8,  delay: 0.6, dur: 6.5 },
    { bottom: "14%", right: "18%", size: 12, delay: 1.8, dur: 7.8 },
    { top: "46%", left: "44%",     size: 6,  delay: 0.9, dur: 9.2 },
    { bottom: "24%", left: "30%",  size: 9,  delay: 2.4, dur: 8   },
  ];
  return (
    <>
      {items.map((it, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute block animate-float-slow ${
            i % 2 === 0 ? "bg-gold/25" : "bg-orange/25"
          }`}
          style={{
            top: it.top, left: it.left, right: it.right, bottom: it.bottom,
            width: it.size, height: it.size,
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
      className={`text-sand/40 ${className}`}
    >
      <path d="M4 4 L20 4 M4 4 L4 20"         stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 12 L20 20"                  stroke="currentColor" strokeWidth="1"   />
      <path d="M10 22 L16 16 L22 22 L16 28 Z"  stroke="currentColor" strokeWidth="1"   />
      <path d="M22 10 L28 16 L22 22"           stroke="currentColor" strokeWidth="1"   />
    </svg>
  );
}
