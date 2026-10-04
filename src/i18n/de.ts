/**
 * Alle Texte der Oberfläche an einem Ort (Deutsch, Schweizer Schreibweise: «ss» statt «ß»).
 * Für eine spätere Übersetzung wird diese Datei kopiert (z. B. fr.ts) und in i18n/index.ts gewählt.
 *
 * Texte mit Platzhaltern sind kleine Funktionen, z. B. `t.catalog.resultCount(12)`.
 */
export const de = {
  site: {
    name: 'MotoMatch',
    claim: 'Finde das Bike, das zu dir passt.',
    description:
      'Motorräder für die Schweiz vergleichen: Leistung, Gewicht, Preis in CHF, Führerausweis-Kategorie und Ausstattung auf einen Blick.',
  },

  a11y: {
    skipToContent: 'Zum Inhalt springen',
    mainNavigation: 'Hauptnavigation',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schliessen',
    homeLink: 'MotoMatch – zur Startseite',
  },

  nav: {
    home: 'Start',
    bikes: 'Bikes',
    compare: 'Vergleich',
    match: 'Match',
  },

  theme: {
    switchToLight: 'Helles Design aktivieren',
    switchToDark: 'Dunkles Design aktivieren',
  },

  footer: {
    disclaimer:
      'Alle Angaben ohne Gewähr. Marken gehören den jeweiligen Inhabern, MotoMatch steht in keiner Verbindung zu den Herstellern.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    tagline: 'Motorräder vergleichen – gemacht für die Schweiz.',
    legalNav: 'Rechtliches',
  },

  common: {
    comingSoon: 'Dieser Bereich entsteht gerade.',
    backToHome: 'Zur Startseite',
    toCatalog: 'Alle Bikes ansehen',
    loading: 'Wird geladen …',
  },

  home: {
    eyebrow: 'Motorrad-Vergleich für die Schweiz',
    title: 'Finde das Bike, das zu dir passt.',
    lead: 'Leg Motorräder nebeneinander und sieh sofort, was zählt: Leistung, Gewicht, Sitzhöhe, Preis in CHF und welcher Führerausweis reicht.',
    ctaCatalog: 'Bikes entdecken',
    ctaMatch: 'Match-Wizard starten',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    text: 'Diese Strasse führt ins Leere. Vielleicht hilft dir der Katalog weiter.',
  },

  pages: {
    catalog: {
      title: 'Alle Bikes',
      description: 'Alle Motorräder im Überblick – filtern, sortieren, vergleichen.',
    },
    compare: {
      title: 'Vergleich',
      description: 'Bis zu drei Motorräder direkt nebeneinander vergleichen.',
    },
    match: {
      title: 'Match-Wizard',
      description: 'Ein paar Fragen – und MotoMatch schlägt dir passende Bikes vor.',
    },
    imprint: { title: 'Impressum', description: 'Impressum von MotoMatch.' },
    privacy: { title: 'Datenschutz', description: 'Datenschutzerklärung von MotoMatch.' },
  },
} as const;

export type Texts = typeof de;
