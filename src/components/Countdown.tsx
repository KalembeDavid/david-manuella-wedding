"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const now = Date.now();
  let delta = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = delta - minutes * 60;
  return { days, hours, minutes, seconds };
}

const LABELS: Record<keyof Parts, string> = {
  days: "Jours",
  hours: "Heures",
  minutes: "Minutes",
  seconds: "Secondes",
};

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const isPast = parts !== null && Object.values(parts).every((v) => v === 0);

  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-6">
      {(Object.keys(LABELS) as (keyof Parts)[]).map((key, i) => (
        <div key={key} className="flex items-center gap-3 sm:gap-6">
          {i > 0 && (
            <span className="font-display text-3xl text-gold/40 sm:text-4xl">
              :
            </span>
          )}
          <div className="flex min-w-[58px] flex-col items-center sm:min-w-[78px]">
            <span className="font-display text-4xl tabular-nums leading-none text-gold-light sm:text-6xl">
              {parts ? String(parts[key]).padStart(2, "0") : "--"}
            </span>
            <span className="mt-2 text-[0.6rem] uppercase tracking-wide-sm text-cream/60 sm:text-xs">
              {LABELS[key]}
            </span>
          </div>
        </div>
      ))}
      {isPast && (
        <span className="sr-only">Le grand jour est arrivé&nbsp;!</span>
      )}
    </div>
  );
}
