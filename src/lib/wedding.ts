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
  },
  bride: {
    firstName: "Manuella",
    family: "Famille Kapapa Mukanda Bantu",
  },

  // Date principale de la célébration (format ISO : AAAA-MM-JJTHH:MM:SS)
  // Sert au compte à rebours. Ajuste l'heure quand elle sera connue.
  date: "2026-06-20T17:00:00",
  dateLabel: "20 Juin 2026",
  dayLabel: "Samedi",

  // Lieu
  city: "Kolwezi",
  venue: "Katebi",
  country: "R.D. Congo",
  // Lien Google Maps (remplace par le lien exact du lieu quand tu l'as)
  mapsQuery: "Katebi, Kolwezi",

  // Phrase d'invitation (ton coutumier / traditionnel)
  invitationLead:
    "Selon la coutume et avec la bénédiction de nos familles,",
  invitationBody:
    "nos deux familles s'unissent pour célébrer notre mariage traditionnel. Nous vous convions à partager cette journée de dot, d'union et de réjouissances. Votre présence sera notre plus grande joie.",

  // La cérémonie traditionnelle (mariage coutumier).
  // Mets "time" à null tant que l'heure n'est pas confirmée.
  ceremony: {
    title: "Mariage Coutumier",
    subtitle: "L'union de nos deux familles selon la tradition",
    date: "20 Juin 2026",
    time: "17h00" as string | null,
    venue: "Katebi",
    city: "Kolwezi",
  },

  // Date limite pour confirmer sa présence
  rsvpDeadlineLabel: "1er Juin 2026",

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

/** Monogramme court, ex. "D & M" */
export const monogram = `${wedding.groom.firstName[0]} & ${wedding.bride.firstName[0]}`;
