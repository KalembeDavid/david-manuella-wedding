"use client";

import { wedding } from "@/lib/wedding";

export default function InvitationActions({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const text = `${name}, vous êtes invité(e) au mariage de ${wedding.groom.firstName} & ${wedding.bride.firstName} le ${wedding.dateLabel} à ${wedding.venue}, ${wedding.city}. Voici votre invitation : ${url}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row print:hidden">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold"
      >
        Partager sur WhatsApp
      </a>
      <button onClick={() => window.print()} className="btn-outline" type="button">
        Enregistrer / Imprimer
      </button>
    </div>
  );
}
