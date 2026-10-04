/**
 * Datenmodell von MotoMatch
 * -------------------------
 * Die Zod-Schemas sind die einzige Quelle der Wahrheit: Aus ihnen entstehen die
 * TypeScript-Typen (z. B. `Model`, `Generation`), und `npm run validate:data` prüft
 * damit alle JSON-Dateien.
 *
 * Feldnamen sind englisch, Beschriftungen auf der Seite deutsch (siehe src/i18n/de.ts).
 *
 * Hinweis: Diese Datei wird auch von Node-Skripten geladen (scripts/validate-data.ts).
 * Deshalb importiert sie nur `zod` und verwendet keinen `@/`-Alias.
 *
 * Wichtig: Die App selbst importiert hieraus nur Typen (`import type`). So landet Zod
 * nicht im Browser-Bundle.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------

/** Kleinbuchstaben, Ziffern und Bindestriche, z. B. "yamaha-mt-07". */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Nur a–z, 0–9 und einzelne Bindestriche erlaubt');

/** Datum im ISO-Format JJJJ-MM-TT. */
const isoDate = z.iso.date();

const year = z.int().min(1950).max(2100);

export const CATEGORIES = [
  'naked',
  'supersport',
  'sport',
  'touring',
  'adventure',
  'enduro',
  'supermoto',
  'cruiser',
  'retro',
  'scooter',
] as const;
export const categorySchema = z.enum(CATEGORIES);

/** Serie, gegen Aufpreis (Werksoption oder Original-Zubehör) oder nicht erhältlich. */
export const availabilitySchema = z.enum(['standard', 'optional', 'none']);

/** Redaktionelle Wertung von 1 bis 10. */
export const scoreSchema = z.literal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

/**
 * Ein Messwert mit Angabe der Quelle:
 * official = Herstellerangabe, tested = Messung in einem Test, estimate = Schätzung.
 */
const estimatedNumber = z.strictObject({
  value: z.number().positive(),
  kind: z.enum(['official', 'tested', 'estimate']),
});

// ---------------------------------------------------------------------------
// Generation (alle Baujahre, in denen ein Modell technisch identisch ist)
// ---------------------------------------------------------------------------

export const engineSchema = z.strictObject({
  /** Hubraum in cm³ */
  displacementCc: z.number().positive(),
  cylinders: z.int().min(1).max(8),
  /** z. B. «Reihen-Zweizylinder», «V2», «Einzylinder» */
  layout: z.string().min(1),
  cooling: z.enum(['air', 'liquid', 'air-oil']),
  /** Leistung in kW – Quelle der Wahrheit. PS werden daraus berechnet. */
  powerKw: z.number().positive(),
  powerRpm: z.int().positive().optional(),
  /** Drehmoment in Newtonmeter */
  torqueNm: z.number().positive(),
  torqueRpm: z.int().positive().optional(),
});

export const performanceSchema = z.strictObject({
  topSpeedKmh: estimatedNumber.optional(),
  accel0to100s: estimatedNumber.optional(),
});

export const chassisSchema = z.strictObject({
  /** Fahrbereit laut Hersteller, ohne Fahrer */
  weightKg: z.number().positive(),
  /** Hinweis, falls der Hersteller das Gewicht anders definiert (z. B. «ohne Kraftstoff») */
  weightNote: z.string().min(1).optional(),
  seatHeightMm: z.int().positive(),
  tankL: z.number().positive(),
  /** Verbrauch nach WMTC in l/100 km */
  consumptionL100km: z.number().positive().optional(),
  gears: z.int().positive(),
  drive: z.enum(['chain', 'shaft', 'belt']),
});

export const throttleSchema = z.strictObject({
  /** Gibt es eine offizielle Drosselung des Herstellers (35-kW-Version oder A2-Kit)? */
  available: z.boolean(),
  /** Leistung gedrosselt. Nennt der Hersteller nur «max. 35 kW», steht hier 35. */
  throttledPowerKw: z.number().positive().optional(),
  note: z.string().min(1).optional(),
});

export const priceSchema = z.strictObject({
  /** Schweizer Listenpreis in CHF */
  chf: z.number().positive(),
  /** Stand des Preises */
  asOf: isoDate,
  note: z.string().min(1).optional(),
});

export const scoresSchema = z.strictObject({
  tuningVisual: scoreSchema,
  tuningPerformance: scoreSchema,
  sound: scoreSchema,
  profile: z.strictObject({
    beginner: scoreSchema,
    city: scoreSchema,
    touring: scoreSchema,
    sport: scoreSchema,
    offroad: scoreSchema,
  }),
});

export const soundSchema = z.strictObject({
  description: z.string().min(1),
  /** Pfad zu einer eigenen Audiodatei, z. B. "/audio/yamaha-mt-07.mp3" */
  audioSrc: z.string().min(1).optional(),
  /** Standgeräusch in dB(A) */
  noiseDbA: z.number().positive().optional(),
});

export const extraSchema = z.strictObject({
  /** Schlüssel aus features.json */
  key: slug,
  availability: z.enum(['standard', 'optional']),
  detail: z.string().min(1).optional(),
});

export const sourceSchema = z.strictObject({
  label: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
});

/** Erlaubt nur Links auf youtube.com/watch?v=… oder youtu.be/… */
const youtubeUrl = z
  .url({ protocol: /^https$/ })
  .refine((url) => getYouTubeVideoId(url) !== null, 'Kein gültiger YouTube-Link');

export const generationSchema = z
  .strictObject({
    /** Stabile ID: <modell-id>-<erstes Baujahr>, z. B. "yamaha-mt-07-2025" */
    id: slug,
    yearFrom: year,
    /** null = aktuell erhältlich */
    yearTo: year.nullable(),
    /** «Was ist neu?» gegenüber der Vorgängergeneration */
    changes: z.array(z.string().min(1)).optional(),
    /** Rein kosmetisch – löst keine neue Generation aus */
    colors: z.array(z.string().min(1)).optional(),
    engine: engineSchema,
    performance: performanceSchema,
    chassis: chassisSchema,
    throttle: throttleSchema,
    quickshifter: availabilitySchema,
    /** Auto-Blipper: Runterschalten ohne Kupplung */
    blipper: availabilitySchema,
    price: priceSchema,
    scores: scoresSchema,
    /** Kurz: was ist in der Schweiz legal bzw. eintragbar, was nicht */
    tuningNote: z.string().min(1),
    sound: soundSchema,
    extras: z.array(extraSchema).optional(),
    youtubeReviewUrl: youtubeUrl.optional(),
    images: z
      .strictObject({
        hero: z.string().min(1).optional(),
        gallery: z.array(z.string().min(1)).optional(),
        credit: z.string().min(1).optional(),
      })
      .optional(),
    sources: z.array(sourceSchema),
    dataStatus: z.enum(['verified', 'needsVerification']),
    lastChecked: isoDate,
  })
  .refine((generation) => generation.yearTo === null || generation.yearTo >= generation.yearFrom, {
    message: 'yearTo darf nicht vor yearFrom liegen',
    path: ['yearTo'],
  })
  .refine(
    (generation) =>
      generation.throttle.available || generation.throttle.throttledPowerKw === undefined,
    {
      message: 'throttledPowerKw ist nur sinnvoll, wenn throttle.available true ist',
      path: ['throttle', 'throttledPowerKw'],
    },
  )
  .refine(
    (generation) =>
      generation.throttle.throttledPowerKw === undefined ||
      generation.throttle.throttledPowerKw < generation.engine.powerKw,
    {
      message: 'Die gedrosselte Leistung muss kleiner als die Serienleistung sein',
      path: ['throttle', 'throttledPowerKw'],
    },
  );

// ---------------------------------------------------------------------------
// Modell
// ---------------------------------------------------------------------------

export const modelSchema = z.strictObject({
  /** z. B. "yamaha-mt-07" – wird auch als URL verwendet (/bikes/yamaha-mt-07) */
  id: slug,
  manufacturerId: slug,
  /** Modellname ohne Hersteller, z. B. "MT-07" */
  name: z.string().min(1),
  category: categorySchema,
  /** Ein Satz auf Deutsch */
  tagline: z.string().min(1).optional(),
  /** Chronologisch: älteste zuerst */
  generations: z.array(generationSchema).min(1),
});

// ---------------------------------------------------------------------------
// Stammdaten
// ---------------------------------------------------------------------------

export const manufacturerSchema = z.strictObject({
  id: slug,
  name: z.string().min(1),
  /** Ländercode nach ISO 3166-1, z. B. "JP" */
  country: z
    .string()
    .regex(/^[A-Z]{2}$/, 'Zweistelliger Ländercode in Grossbuchstaben, z. B. "CH"'),
});

export const FEATURE_GROUPS = [
  'comfort',
  'safety',
  'chassis',
  'electronics',
  'technology',
] as const;

/** Icons aus lucide-react, die für Extras verwendet werden dürfen (siehe FeatureIcon.tsx). */
export const FEATURE_ICONS = [
  'flame',
  'armchair',
  'gauge',
  'wind',
  'key-round',
  'square-parking',
  'usb',
  'shield-check',
  'activity',
  'lightbulb',
  'circle-gauge',
  'sliders-horizontal',
  'cpu',
  'tablet',
  'smartphone',
  'layers',
  'cog',
  'bot',
] as const;

export const featureSchema = z.strictObject({
  key: slug,
  /** Deutsches Label, z. B. «Griffheizung» */
  label: z.string().min(1),
  group: z.enum(FEATURE_GROUPS),
  icon: z.enum(FEATURE_ICONS),
  /** Kurze Erklärung für Einsteiger (Tooltip) */
  description: z.string().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Typen für die App
// ---------------------------------------------------------------------------

export type Category = z.infer<typeof categorySchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type Score = z.infer<typeof scoreSchema>;
export type Estimated = z.infer<typeof estimatedNumber>;
export type Engine = z.infer<typeof engineSchema>;
export type Chassis = z.infer<typeof chassisSchema>;
export type Throttle = z.infer<typeof throttleSchema>;
export type Price = z.infer<typeof priceSchema>;
export type Scores = z.infer<typeof scoresSchema>;
export type ProfileKey = keyof Scores['profile'];
export type Extra = z.infer<typeof extraSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Generation = z.infer<typeof generationSchema>;
export type Model = z.infer<typeof modelSchema>;
export type Manufacturer = z.infer<typeof manufacturerSchema>;
export type FeatureGroup = (typeof FEATURE_GROUPS)[number];
export type FeatureIconName = (typeof FEATURE_ICONS)[number];
export type Feature = z.infer<typeof featureSchema>;

// ---------------------------------------------------------------------------
// Hilfsfunktionen (ohne Abhängigkeiten, auch im Browser nutzbar)
// ---------------------------------------------------------------------------

/**
 * Liest die Video-ID aus einem YouTube-Link.
 * Unterstützt https://www.youtube.com/watch?v=ID und https://youtu.be/ID.
 */
export function getYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const isValidId = (id: string | null): id is string => !!id && /^[A-Za-z0-9_-]{11}$/.test(id);

  if (parsed.hostname === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    return isValidId(id) ? id : null;
  }
  if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(parsed.hostname)) {
    const id = parsed.searchParams.get('v');
    return isValidId(id) ? id : null;
  }
  return null;
}
