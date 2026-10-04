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
    searchLabel: 'Motorrad suchen',
    searchPlaceholder: 'z. B. MT-07, Duke oder Ducati',
    searchSubmit: 'Suchen',
    categoriesTitle: 'Nach Kategorie',
    categoriesLead: 'Vom wendigen Naked Bike bis zur Reiseenduro.',
    categoryCount: (count: number) => (count === 1 ? '1 Modell' : `${count} Modelle`),
    matchTitle: 'Unsicher, was passt?',
    matchText:
      'Beantworte ein paar Fragen zu Führerausweis, Grösse, Budget und Einsatz – MotoMatch schlägt dir passende Bikes vor.',
    gaugeLabel: 'Drehzahlmesser (Dekoration)',
  },

  categories: {
    naked: 'Naked Bike',
    supersport: 'Supersportler',
    sport: 'Sportler',
    touring: 'Tourer',
    adventure: 'Adventure',
    enduro: 'Enduro',
    supermoto: 'Supermoto',
    cruiser: 'Cruiser',
    retro: 'Retro',
    scooter: 'Roller',
  },

  featureGroups: {
    comfort: 'Komfort',
    safety: 'Sicherheit',
    chassis: 'Fahrwerk',
    electronics: 'Elektronik',
    technology: 'Technik',
  },

  availability: {
    standard: 'Serie',
    optional: 'Optional',
    none: 'Nein',
  },

  licence: {
    label: 'Führerausweis',
    short: { A1: 'A1', A_LIMITED: 'A beschränkt', A: 'A' },
    long: {
      A1: 'Kategorie A1',
      A_LIMITED: 'Kategorie A beschränkt',
      A: 'Kategorie A',
    },
    withThrottle: 'Mit Drosselung A beschränkt möglich',
    throttleShort: 'gedrosselt A beschränkt',
    disclaimer: 'Richtwert, verbindlich ist der Fahrzeugausweis.',
  },

  data: {
    notAvailable: 'k. A.',
    approx: 'ca.',
    needsVerification: 'Daten werden noch geprüft',
  },

  catalog: {
    eyebrow: 'Katalog',
    searchLabel: 'Bikes durchsuchen',
    searchPlaceholder: 'Modell oder Marke …',
    clearSearch: 'Suche löschen',
    sortLabel: 'Sortieren',
    sort: {
      name: 'Name (A–Z)',
      'price-asc': 'Preis: tiefster zuerst',
      'price-desc': 'Preis: höchster zuerst',
      'power-desc': 'Leistung: stärkste zuerst',
      'power-asc': 'Leistung: schwächste zuerst',
      'torque-desc': 'Drehmoment: höchstes zuerst',
      'weight-asc': 'Gewicht: leichteste zuerst',
      'seat-asc': 'Sitzhöhe: tiefste zuerst',
    },
    filters: 'Filter',
    filterButtonLabel: (activeCount: number) =>
      activeCount > 0 ? `Filter, ${activeCount} aktiv` : 'Filter öffnen',
    closeFilters: 'Filter schliessen',
    resultsHeading: 'Ergebnisse',
    showResults: (count: number) => (count === 1 ? '1 Bike anzeigen' : `${count} Bikes anzeigen`),
    resetFilters: 'Alle Filter zurücksetzen',
    resultCount: (count: number) => (count === 1 ? '1 Bike' : `${count} Bikes`),
    emptyTitle: 'Keine Bikes gefunden',
    emptyText: 'Lockere die Filter oder setze sie zurück.',
    filter: {
      licence: 'Mein Führerausweis',
      licenceAll: 'Alle',
      includeThrottled: 'Drosselbare Bikes einschliessen',
      includeThrottledHint:
        'Zeigt bei «A beschränkt» auch Bikes, die mit offizieller Drosselung passen.',
      manufacturers: 'Hersteller',
      categories: 'Kategorie',
      price: 'Preis',
      power: 'Leistung',
      displacement: 'Hubraum',
      cylinders: 'Zylinder',
      equipment: 'Ausstattung',
      throttleable: 'Drosselbar',
      quickshifter: 'Quickshifter',
      blipper: 'Auto-Blipper',
      equipmentHint: 'Serie oder optional erhältlich',
      extras: 'Extras',
      minimum: 'Minimum',
      maximum: 'Maximum',
    },
  },

  card: {
    compare: 'Vergleichen',
    compareFull: 'Maximal 3 Bikes im Vergleich',
    moreGenerations: (count: number) =>
      count === 1 ? '+1 weitere Generation' : `+${count} weitere Generationen`,
    power: 'Leistung',
    torque: 'Drehmoment',
    price: 'Preis',
    details: (name: string) => `Details zu ${name}`,
    detailsHint: 'Details',
  },

  compareBar: {
    label: 'Vergleichsauswahl',
    title: 'Vergleich',
    compareNow: 'Vergleichen',
    clear: 'Auswahl leeren',
    remove: (name: string) => `${name} aus dem Vergleich entfernen`,
    needMore: 'Noch ein Bike wählen',
    freeSlot: 'Freier Platz',
    count: (count: number) => `${count} von 3`,
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
