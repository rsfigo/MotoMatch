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
    pricePerPs: 'Preis pro PS',
    perPs: 'pro PS',
    pricePerPsHint: 'Listenpreis geteilt durch die Leistung',
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

  compare: {
    eyebrow: 'Vergleich',
    titleWith: (names: string[]) => names.join(' vs. '),
    emptyTitle: 'Noch keine Bikes im Vergleich',
    emptyText:
      'Wähle bis zu drei Motorräder und leg sie nebeneinander – oder starte mit einem beliebten Vergleich.',
    addBike: 'Bike hinzufügen',
    addMore: 'Füge ein zweites Bike hinzu, um zu vergleichen.',
    selectedBikes: 'Ausgewählte Bikes',
    remove: (name: string) => `${name} aus dem Vergleich entfernen`,
    generationOf: (name: string) => `Baujahre von ${name}`,
    onlyDifferences: 'Nur Unterschiede anzeigen',
    onlyDifferencesHint: 'Blendet Zeilen aus, in denen alle Bikes gleich sind.',
    share: 'Link teilen',
    copied: 'Link kopiert',
    shareTitle: 'MotoMatch-Vergleich',
    best: 'Bestwert',
    collapse: (title: string) => `${title} zuklappen`,
    expand: (title: string) => `${title} aufklappen`,
    sections: {
      overview: 'Eckdaten',
      engine: 'Motor & Leistung',
      chassis: 'Fahrwerk & Elektronik',
      extras: 'Extras',
      tuningSound: 'Tuning & Sound',
      price: 'Preis',
    },
    noDifferences: 'In diesem Abschnitt sind alle Bikes gleich.',
    profileTitle: 'Einsatzprofil im Vergleich',
    videosTitle: 'Video-Reviews',
    popularTitle: 'Beliebte Vergleiche',
    popularLead: 'Ein Klick – und die Bikes stehen nebeneinander.',
    popular: {
      a1: 'Einstieg mit A1',
      a35: 'Ohne Drosselung für «A beschränkt»',
      middle: 'Mittelklasse-Nakeds',
      character: 'Drehmoment und Charakter',
    },
    paletteTitle: 'Bike zum Vergleich hinzufügen',
    palettePlaceholder: 'Modell oder Marke suchen …',
    paletteEmpty: 'Kein passendes Bike gefunden.',
    paletteHint: '↑↓ auswählen · Enter hinzufügen · Esc schliessen',
    paletteShortcut: 'Strg K',
    metaDescription: (names: string[]) =>
      `${names.join(' vs. ')}: Leistung, Gewicht, Preis und Ausstattung im direkten Vergleich.`,
    specColumn: 'Merkmal',
    deltaToBest: 'Abstand zum Bestwert',
    extraMissing: 'nicht erhältlich',
    shareFailed: 'Kopieren nicht möglich – bitte den Link aus der Adresszeile verwenden.',
    vs: 'vs.',
  },

  match: {
    eyebrow: 'Match-Wizard',
    title: 'Finde dein Bike in sechs Fragen',
    lead: 'Beantworte ein paar Fragen – MotoMatch rechnet aus, welche Bikes am besten zu dir passen.',
    progressLabel: 'Fortschritt',
    progress: (step: number, total: number) => `Frage ${step} von ${total}`,
    back: 'Zurück',
    next: 'Weiter',
    showResults: 'Matches anzeigen',
    toResult: 'Zum Ergebnis',
    steps: {
      licence: {
        title: 'Welchen Führerausweis hast du?',
        hint: 'Bikes, die du damit nicht fahren darfst, schlagen wir nicht vor.',
      },
      height: {
        title: 'Wie gross bist du?',
        hint: 'Daraus schätzen wir, welche Sitzhöhe für dich bequem ist.',
      },
      budget: {
        title: 'Wie viel darf das Bike kosten?',
        hint: 'Listenpreis neu in CHF. Zubehör und Bekleidung kommen dazu.',
      },
      purpose: {
        title: 'Wofür willst du das Bike vor allem?',
        hint: 'Mehrere Antworten möglich.',
      },
      experience: {
        title: 'Wie viel Fahrerfahrung hast du?',
        hint: 'Damit das Bike dich fordert, aber nicht überfordert.',
      },
      preferences: {
        title: 'Wie wichtig sind dir Sound und Tuning?',
        hint: 'Beides sind redaktionelle Einschätzungen auf einer Skala von 1 bis 10.',
      },
    },
    licenceOptions: {
      A1: { badge: 'A1', label: 'A1', description: 'Bis 125 cm³ und 11 kW, ab 16 Jahren' },
      A_LIMITED: {
        badge: 'A35',
        label: 'A beschränkt',
        description: 'Bis 35 kW und 0.2 kW/kg, ab 18 Jahren',
      },
      A: { badge: 'A', label: 'A', description: 'Ohne Leistungsgrenze' },
      none: {
        badge: '?',
        label: 'Noch offen',
        description: 'Ich mache den Ausweis erst – zeig mir alle Bikes',
      },
    },
    heightLess: 'Einen Zentimeter kleiner',
    heightMore: 'Einen Zentimeter grösser',
    heightValue: (cm: number) => `${cm} cm`,
    heightHint: (inseam: string, seat: string) =>
      `Geschätzte Schrittlänge: ca. ${inseam}. Bequem sind damit Sitzhöhen bis etwa ${seat}.`,
    budgetValue: (chf: string) => `bis ${chf}`,
    budgetUpTo: 'bis',
    budgetAny: 'Budget spielt keine Rolle',
    budgetAnyValue: 'Egal',
    purposes: {
      city: { label: 'Stadt & Pendeln', description: 'Wendig, sparsam, alltagstauglich' },
      touring: { label: 'Touren & Reisen', description: 'Komfort und Reichweite für lange Tage' },
      sport: { label: 'Kurven & Sport', description: 'Leistung, Handling und Fahrspass' },
      offroad: { label: 'Schotter & Gelände', description: 'Auch abseits vom Asphalt unterwegs' },
    },
    experienceOptions: {
      beginner: { label: 'Neu dabei', description: 'Prüfung frisch gemacht oder noch vor mir' },
      intermediate: { label: 'Etwas Erfahrung', description: 'Ein bis drei Saisons gefahren' },
      experienced: { label: 'Viel Erfahrung', description: 'Mehrere Jahre und verschiedene Bikes' },
    },
    importance: ['Egal', 'Etwas', 'Wichtig', 'Sehr wichtig'],
    soundLabel: 'Sound',
    tuningLabel: 'Tuning (Optik und Leistung)',
    summary: {
      licence: 'Ausweis',
      height: 'Grösse',
      budget: 'Budget',
      purpose: 'Einsatz',
      experience: 'Erfahrung',
      preferences: 'Sound und Tuning',
    },
    preferencesValue: (sound: string, tuning: string) => `Sound ${sound}, Tuning ${tuning}`,
    editAnswer: (question: string) => `${question} ändern`,
    results: {
      eyebrow: 'Deine Matches',
      title: 'Diese Bikes passen zu dir',
      lead: 'Sortiert nach Übereinstimmung mit deinen Antworten.',
      answersTitle: 'Deine Antworten',
      rank: (rank: number) => `Platz ${rank}`,
      percentLabel: (percent: number) => `${percent} Prozent Übereinstimmung`,
      details: 'Details',
      compareTop: (count: number) => `Top ${count} vergleichen`,
      restart: 'Neu starten',
      fewResults: (count: number) =>
        count === 1
          ? 'Mit diesem Führerausweis passt im Moment nur ein Bike aus unserem Katalog.'
          : `Mit diesem Führerausweis passen im Moment nur ${count} Bikes aus unserem Katalog.`,
      noResults: 'Mit diesem Führerausweis passt im Moment kein Bike aus unserem Katalog.',
      disclaimer:
        'Die Prozente sind eine Orientierung, keine Kaufberatung. Am besten Probe fahren – und die Sitzhöhe beim Händler testen.',
      howTitle: 'So rechnet MotoMatch',
      how: [
        'Führerausweis: Bikes, die du nicht fahren darfst, fallen weg. Mit «A beschränkt» zählen auch Bikes mit offizieller 35-kW-Drosselung.',
        'Einsatz, Budget, Sitzhöhe, Erfahrung, Leistung, Sound und Tuning ergeben je einen Wert. Das Match ist ihr gewichteter Durchschnitt – Einsatz und Budget zählen am meisten.',
        'Sitzhöhe: Wir schätzen die Schrittlänge auf 46 % der Körpergrösse. Bis 5 cm darüber gilt eine Sitzhöhe als bequem, ab 10 cm darüber als zu hoch.',
        'Budget: Bis 25 % darüber gibt es noch Teilpunkte.',
        'Einsatzprofil, Sound und Tuning sind redaktionelle Einschätzungen von 1 bis 10.',
      ],
    },
    reasons: {
      purpose: (purposes: string, score: number) => `Stark für ${purposes} (${score}/10)`,
      purposeWeak: (purpose: string, score: number) => `${purpose}: nur ${score}/10`,
      withinBudget: (price: string) => `Im Budget: ${price}`,
      overBudget: (amount: string) => `${amount} über deinem Budget`,
      seatFits: (seat: string) => `Sitzhöhe ${seat} passt zu deiner Grösse`,
      seatHigh: (seat: string) => `Sitzhöhe ${seat} – eher hoch für dich`,
      beginnerFriendly: (score: number) => `Einsteigerfreundlich (${score}/10)`,
      forExperienced: (score: number) => `Eher für Erfahrene (Einsteiger ${score}/10)`,
      power: (power: string) => `Kräftig: ${power}`,
      sound: (score: number) => `Starker Sound (${score}/10)`,
      tuning: (score: number) => `Viel Tuning-Potenzial (${score}/10)`,
      throttle: (power: string) => `Für A beschränkt mit offizieller Drosselung auf ${power}`,
    },
    /** «Stadt», «Stadt und Touren», «Stadt, Touren und Sport» */
    listAnd: (items: readonly string[]) =>
      items.length < 2
        ? items.join('')
        : `${items.slice(0, -1).join(', ')} und ${items[items.length - 1] ?? ''}`,
  },

  notFound: {
    title: 'Seite nicht gefunden',
    text: 'Diese Strasse führt ins Leere. Vielleicht hilft dir der Katalog weiter.',
  },

  /**
   * Rechtliches. Angaben in [eckigen Klammern] sind Platzhalter und werden vor dem Livegang
   * ergänzt; beide Texte vorher von einer Fachperson prüfen lassen (siehe DECISIONS.md).
   */
  legal: {
    draftNotice: 'Entwurf: Angaben in [eckigen Klammern] werden vor dem Livegang ergänzt.',
    externalLink: 'öffnet in neuem Tab',
    imprint: {
      lead: 'Angaben zum Betreiber dieser Website.',
      sections: [
        {
          title: 'Betreiber',
          paragraphs: ['[Vorname Nachname oder Firma]', '[Strasse Nr.], [PLZ Ort], Schweiz'],
        },
        { title: 'Kontakt', paragraphs: ['E-Mail: [E-Mail-Adresse]'] },
        {
          title: 'Haftungsausschluss',
          paragraphs: [
            'Alle Angaben ohne Gewähr. Technische Daten und Preise stammen aus den Quellen, die bei jedem Bike genannt sind; Schätzungen sind als solche gekennzeichnet. Verbindlich sind die Angaben der Hersteller und Händler sowie der Fahrzeugausweis.',
            'Die Führerausweis-Kategorien werden aus Hubraum, Leistung und Gewicht berechnet und sind ein Richtwert. Die Wertungen zu Tuning, Sound und Einsatzprofil sind redaktionelle Einschätzungen.',
          ],
        },
        {
          title: 'Links auf andere Websites',
          paragraphs: [
            'Für die Inhalte verlinkter Websites sind ausschliesslich deren Betreiber verantwortlich.',
          ],
        },
        {
          title: 'Marken und Grafiken',
          paragraphs: [
            'Marken- und Modellnamen gehören den jeweiligen Inhabern. MotoMatch steht in keiner Verbindung zu den Herstellern.',
            'Die Motorrad-Grafiken sind generische Silhouetten und zeigen keine bestimmten Modelle.',
          ],
        },
      ],
    },
    privacy: {
      lead: 'Wie MotoMatch mit deinen Daten umgeht – kurz und verständlich.',
      sections: [
        {
          title: 'Das Wichtigste in Kürze',
          list: [
            'Keine Cookies, kein Tracking, keine Werbung und kein Benutzerkonto.',
            'Deine Einstellungen bleiben in deinem Browser.',
            'YouTube wird erst geladen, wenn du ein Video startest.',
          ],
        },
        {
          title: 'Verantwortlich',
          paragraphs: [
            '[Vorname Nachname oder Firma], [Strasse Nr.], [PLZ Ort], Schweiz',
            'E-Mail: [E-Mail-Adresse]',
          ],
        },
        {
          title: 'Speicherung in deinem Browser',
          paragraphs: [
            'MotoMatch speichert zwei Einstellungen im lokalen Speicher deines Browsers (localStorage): ob du das helle oder das dunkle Design gewählt hast und welche Bikes in deiner Vergleichsauswahl sind. Diese Angaben verlassen dein Gerät nicht.',
            'Du kannst sie jederzeit löschen, indem du die Website-Daten in deinem Browser entfernst.',
          ],
        },
        {
          title: 'Match-Wizard und geteilte Links',
          paragraphs: [
            'Deine Antworten im Match-Wizard, zum Beispiel Körpergrösse und Budget, werden nur in deinem Browser ausgewertet. Sie stehen in der Adresse der Seite, damit «Zurück» und Neuladen funktionieren. Wenn du diesen Link teilst, sieht die andere Person deine Antworten. Dasselbe gilt für geteilte Vergleiche.',
          ],
        },
        {
          title: 'Hosting und Server-Logfiles',
          paragraphs: [
            'Die Website wird bei [Hosting-Anbieter, Land] betrieben. Beim Aufruf speichert der Server technisch notwendige Angaben wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browser. Sie dienen dem sicheren Betrieb und werden nach [Aufbewahrungsdauer] gelöscht.',
          ],
        },
        {
          title: 'Schriften',
          paragraphs: [
            'Die Schriften liegen auf demselben Server wie die Website. Es wird keine Verbindung zu Google Fonts oder anderen Schriftdiensten aufgebaut.',
          ],
        },
        {
          title: 'YouTube-Videos',
          paragraphs: [
            'Video-Reviews sind über youtube-nocookie.com eingebunden und werden erst geladen, wenn du auf «Abspielen» klickst. Erst dann werden Daten an YouTube bzw. Google übertragen, zum Beispiel deine IP-Adresse; YouTube kann dabei auch Cookies setzen. Es gilt die Datenschutzerklärung von Google.',
          ],
          link: {
            label: 'Datenschutzerklärung von Google',
            href: 'https://policies.google.com/privacy',
          },
        },
        {
          title: 'Links auf andere Websites',
          paragraphs: [
            'Quellen und Herstellerseiten sind verlinkt. Öffnest du einen solchen Link, gelten dort die Datenschutzbestimmungen des jeweiligen Betreibers.',
          ],
        },
        {
          title: 'Deine Rechte',
          paragraphs: [
            'Nach dem Schweizer Datenschutzgesetz (DSG) kannst du Auskunft über deine Daten verlangen sowie deren Berichtigung oder Löschung. Schreib dazu an die oben genannte E-Mail-Adresse.',
          ],
        },
      ],
      asOf: 'Stand: Oktober 2026',
    },
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
