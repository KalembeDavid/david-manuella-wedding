"use client";

import { wedding } from "@/lib/wedding";

export default function InvitationActions({
  url,
  name,
  partySize = 1,
  downloadUrl,
}: {
  url: string;
  name: string;
  partySize?: number;
  downloadUrl: string;
}) {
  const convie = partySize > 1 ? "conviés" : "convié(e)";
  const text = `${name}, vous êtes ${convie} au mariage coutumier de ${wedding.groom.firstName} & ${wedding.bride.firstName} le ${wedding.dayLabel.toLowerCase()} ${wedding.dateLabel} à ${wedding.timeLabel}, ${wedding.venue} (${wedding.city}). Voici votre invitation : ${url}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row print:hidden">
      <a href={downloadUrl} className="btn-gold">
        Télécharger mon invitation
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline-dark"
      >
        Partager sur WhatsApp
      </a>
    </div>
  );
}
