/**
 * ─────────────────────────────────────────────────────────────
 *  INFORMATIONS DU MARIAGE — David & Manuella
 * ─────────────────────────────────────────────────────────────
 *  C'est le SEUL fichier à modifier pour changer les textes,
 *  les dates, les lieux et le programme. Tout le site lit ici.
 * ─────────────────────────────────────────────────────────────
 */

export const wedding = {
  // Les mariés
  groom: {
    firstName: "David",
    family: "Famille Kalembe Kangandjo",
    role: "Le futur époux",
  },
  bride: {
    firstName: "Manuella",
    family: "Famille Kapapa Mukanda Bantu",
    role: "La future épouse",
  },

  // Date et heure de la célébration (format ISO : AAAA-MM-JJTHH:MM:SS)
  date: "2026-06-20T16:00:00",
  dateLabel: "20 Juin 2026",
  dayLabel: "Samedi",
  timeLabel: "16h00",

  // Lieu
  city: "Kolwezi",
  venue: "Katebi",
  country: "R.D. Congo",
  // Lien Google Maps (remplace par le lien exact du lieu quand tu l'as)
  mapsQuery: "Katebi, Kolwezi",

  // Verset — un amour sincère et divin (affiché une seule fois, sur le bandeau d'or)
  blessing: "Ce que Dieu a uni, que l'homme ne le sépare point.",
  blessingRef: "Matthieu 19, 6",

  // Faire-part — l'annonce officielle
  invitationLead: "Avec la bénédiction de Dieu et de leurs familles,",
  invitationBody:
    "ont la joie de vous convier au mariage coutumier de leurs enfants et de vous accueillir parmi eux pour sceller, selon la tradition, l'union de leurs deux familles.",
  invitationClose: "Votre présence est notre plus beau cadeau.",

  // La cérémonie traditionnelle (mariage coutumier)
  ceremony: {
    title: "Mariage Coutumier",
    subtitle: "L'union de nos deux familles selon la tradition",
    date: "Samedi 20 Juin 2026",
    time: "16h00" as string | null,
    venue: "Katebi",
    city: "Kolwezi",
  },

  // Date limite pour confirmer sa présence
  rsvpDeadlineLabel: "15 Juin 2026",

  // Contact (optionnel — affiché en bas de page)
  contact: {
    phone: "",
    email: "",
  },
};

export type Ceremony = typeof wedding.ceremony;

/** Lien Google Maps prêt à l'emploi */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  wedding.mapsQuery
)}`;

/** Lien « Ajouter à Google Agenda » (cérémonie de 16h00 à 22h00, heure de Kolwezi) */
export const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  `Mariage coutumier — ${wedding.groom.firstName} & ${wedding.bride.firstName}`
)}&dates=20260620T160000/20260620T220000&ctz=Africa/Lubumbashi&location=${encodeURIComponent(
  `${wedding.venue}, ${wedding.city}`
)}&details=${encodeURIComponent(
  `Célébration du mariage coutumier de ${wedding.groom.firstName} & ${wedding.bride.firstName}.`
)}`;

/** Monogramme court, ex. "D & M" */
export const monogram = `${wedding.groom.firstName[0]} & ${wedding.bride.firstName[0]}`;
