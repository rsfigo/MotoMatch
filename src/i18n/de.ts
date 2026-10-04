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
    notAvailableLong: 'keine Angabe',
    approx: 'ca.',
    needsVerification: 'Daten werden noch geprüft',
    needsVerificationHint:
      'Einzelne Werte dieser Generation sind noch nicht vollständig bestätigt. Details in den Quellen.',
    verified: 'Daten geprüft',
    kind: {
      official: 'Herstellerangabe',
      tested: 'Messwert aus einem Test',
      estimate: 'Schätzung bzw. ungefährer Wert',
    },
    sourceOf: (label: string) => `${label}: Art der Quelle`,
    yes: 'Ja',
    no: 'Nein',
    none: '–',
  },

  /** Beschriftungen der technischen Daten (Detailseite und Vergleich) */
  specs: {
    power: 'Leistung',
    torque: 'Drehmoment',
    displacement: 'Hubraum',
    cylinders: 'Zylinder',
    layout: 'Bauart',
    cooling: 'Kühlung',
    powerToWeight: 'Leistungsgewicht',
    topSpeed: 'Höchstgeschwindigkeit',
    accel: 'Beschleunigung 0–100 km/h',
    weight: 'Gewicht fahrbereit',
    seatHeight: 'Sitzhöhe',
    tank: 'Tankinhalt',
    consumption: 'Verbrauch (WMTC)',
    range: 'Reichweite',
    gears: 'Gänge',
    drive: 'Antrieb',
    quickshifter: 'Quickshifter',
    blipper: 'Auto-Blipper',
    throttle: 'Drosselbar',
    licence: 'Führerausweis',
    price: 'Listenpreis',
    noise: 'Standgeräusch',
    tuningVisual: 'Tuning Optik',
    tuningPerformance: 'Tuning Leistung',
    sound: 'Sound',
    atRpm: (rpm: string) => `bei ${rpm}`,
    priceAsOf: (date: string) => `Stand ${date}`,
    throttleYes: (kw: string) => `Ja, auf ${kw}`,
    rangeHint: 'Berechnet aus Tankinhalt und Verbrauch',
    powerToWeightHint: 'Berechnet aus Leistung und Gewicht',
    blipperHint: 'Runterschalten ohne Kupplung',
  },

  cooling: { air: 'Luft', liquid: 'Flüssigkeit', 'air-oil': 'Luft/Öl' },
  drive: { chain: 'Kette', shaft: 'Kardan', belt: 'Riemen' },

  profile: {
    beginner: 'Einsteiger',
    city: 'Stadt',
    touring: 'Touren',
    sport: 'Sport',
    offroad: 'Offroad',
  },

  editorial: {
    label: 'Redaktionelle Einschätzung',
    hint: 'Diese Wertung ist eine Einschätzung der MotoMatch-Redaktion auf einer Skala von 1 bis 10 – keine Herstellerangabe.',
    scoreOutOf: (score: number) => `${score} von 10`,
  },

  tuning: {
    disclaimer: 'Angaben ohne Gewähr, Eintragung beim Strassenverkehrsamt prüfen.',
    visualScale: '1 = kaum Zubehör · 5 = übliche Teile · 10 = riesiger Zubehörmarkt',
    performanceScale:
      '1 = praktisch nichts legal möglich · 5 = zugelassene Auspuff-, Filter- und Mapping-Kombinationen · 10 = viele legale Leistungsteile',
  },

  detail: {
    back: 'Zurück',
    backToCatalog: 'Alle Bikes',
    notFoundTitle: 'Bike nicht gefunden',
    notFoundText: 'Dieses Motorrad gibt es (noch) nicht bei MotoMatch.',
    generations: 'Baujahre',
    generationLabel: 'Generation wählen',
    whatsNew: 'Was ist neu?',
    whatsNewLead: 'Gegenüber der Vorgängergeneration',
    keyFigures: 'Kerndaten',
    techData: 'Technische Daten',
    groups: {
      engine: 'Motor & Leistung',
      chassis: 'Fahrwerk & Abmessungen',
      equipment: 'Ausstattung & Elektronik',
      price: 'Preis',
    },
    licenceTitle: 'Führerausweis',
    licenceText: {
      A1: 'Mit dem Führerausweis A1 (ab 16 Jahren) fahrbar: höchstens 125 cm³ und 11 kW.',
      A_LIMITED:
        'Mit «A beschränkt» (ab 18 Jahren) fahrbar: höchstens 35 kW und 0.2 kW pro kg Gewicht.',
      A: 'Braucht den unbeschränkten Führerausweis A.',
    },
    licenceThrottle: (kw: string) =>
      `Mit der offiziellen Drosselung auf ${kw} reicht auch «A beschränkt».`,
    licenceThrottleRule:
      'Gedrosselt werden darf nur, wenn die Serienleistung höchstens doppelt so hoch ist wie die gedrosselte (VTS Art. 145a). Offizielle 35-kW-Versionen der Hersteller erfüllen das.',
    extrasTitle: 'Ausstattung',
    extrasLead: 'Was dieses Bike serienmässig hat oder gegen Aufpreis bekommt.',
    optional: 'Optional',
    character: 'Charakter',
    profileTitle: 'Einsatzprofil',
    tuningTitle: 'Tuning',
    soundTitle: 'Sound',
    soundPlay: 'Sound abspielen',
    soundPause: 'Sound pausieren',
    similarTitle: 'Ähnliche Bikes',
    sourcesTitle: 'Quellen und Datenstand',
    lastChecked: (date: string) => `Zuletzt geprüft am ${date}`,
    colors: 'Farben',
    compareAdd: 'Zum Vergleich',
    variantNote: 'Hinweis',
  },

  youtube: {
    sectionTitle: 'Video-Review',
    title: (name: string) => `${name} im Video-Test`,
    play: (name: string) => `Video-Test zu ${name} abspielen`,
    privacy: 'Das Video wird erst nach dem Klick von YouTube (youtube-nocookie.com) geladen.',
    iframeTitle: (name: string) => `YouTube-Video: ${name}`,
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
