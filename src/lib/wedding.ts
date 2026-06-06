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
  date: "2026-06-19T10:00:00",
  dateLabel: "19 Juin 2026",
  dayLabel: "Vendredi",

  // Lieu
  city: "Kolwezi",
  venue: "Katebi",
  country: "R.D. Congo",
  // Lien Google Maps (remplace par le lien exact du lieu quand tu l'as)
  mapsQuery: "Katebi, Kolwezi",

  // Phrase d'invitation
  invitationLead: "Avec la bénédiction de Dieu et la joie de nos familles,",
  invitationBody:
    "nous avons l'immense bonheur de vous convier à célébrer notre union. Votre présence sera le plus beau des cadeaux.",

  // Programme des cérémonies.
  // Mets "time" à null tant que l'heure n'est pas confirmée → le site
  // affichera « Heure à confirmer ».
  ceremonies: [
    {
      key: "coutumier",
      title: "Mariage Coutumier",
      subtitle: "La rencontre de nos deux familles",
      date: "19 Juin 2026",
      time: null as string | null,
      venue: "Katebi",
      city: "Kolwezi",
    },
    {
      key: "civil",
      title: "Mariage Civil",
      subtitle: "Le « oui » officiel",
      date: "19 Juin 2026",
      time: null as string | null,
      venue: "Katebi",
      city: "Kolwezi",
    },
  ],

  // Choix de boissons proposés à l'inscription (modifiable librement)
  drinks: [
    "Vin rouge",
    "Vin blanc",
    "Champagne",
    "Bière",
    "Jus / Sans alcool",
    "Eau",
  ],

  // Date limite pour confirmer sa présence
  rsvpDeadlineLabel: "1er Juin 2026",

  // Contact (optionnel — affiché en bas de page)
  contact: {
    phone: "",
    email: "",
  },
};

export type Ceremony = (typeof wedding.ceremonies)[number];

/** Lien Google Maps prêt à l'emploi */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  wedding.mapsQuery
)}`;

/** Monogramme court, ex. "D & M" */
export const monogram = `${wedding.groom.firstName[0]} & ${wedding.bride.firstName[0]}`;
