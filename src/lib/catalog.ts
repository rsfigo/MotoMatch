/**
 * Katalog-Logik: Suche, Filter und Sortierung – als reine Funktionen (gut testbar).
 * Der Filterzustand steht in der URL, damit man eine Auswahl teilen oder speichern kann.
 *
 * Gefiltert wird immer auf die neueste Generation eines Modells (die auch die Karte zeigt).
 */
import type { Category, Generation, Manufacturer, Model } from '@/data/schema';
import { CATEGORIES } from '@/data/schema';
import { latestGeneration } from './generations';
import { canRide, getLicenceInfo, type LicenceCategory, type LicenceInfo } from './licence';
import { kwToPs } from './units';

// ---------------------------------------------------------------------------
// Katalog-Einträge (abgeleitete Werte pro Modell)
// ---------------------------------------------------------------------------

export interface CatalogEntry {
  model: Model;
  /** Neueste Generation – sie wird auf der Karte gezeigt */
  generation: Generation;
  manufacturer: Manufacturer | undefined;
  /** z. B. «Yamaha MT-07» */
  fullName: string;
  powerPs: number;
  licence: LicenceInfo;
  /** Anzahl älterer Generationen */
  olderGenerationCount: number;
  /** Normalisierter Text für die Suche */
  searchText: string;
}

/**
 * Macht Text suchbar: Kleinbuchstaben, ohne Akzente, nur Buchstaben und Ziffern.
 * So findet «mt07» auch «MT-07» und «aprilia» auch «Aprilia».
 */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function toCatalogEntry(
  model: Model,
  manufacturer: Manufacturer | undefined,
  categoryLabel = '',
): CatalogEntry {
  const generation = latestGeneration(model);
  const fullName = manufacturer ? `${manufacturer.name} ${model.name}` : model.name;
  return {
    model,
    generation,
    manufacturer,
    fullName,
    powerPs: kwToPs(generation.engine.powerKw),
    licence: getLicenceInfo({
      displacementCc: generation.engine.displacementCc,
      powerKw: generation.engine.powerKw,
      weightKg: generation.chassis.weightKg,
      throttle: generation.throttle,
    }),
    olderGenerationCount: model.generations.length - 1,
    searchText: normalizeSearch(`${fullName} ${categoryLabel} ${model.tagline ?? ''}`),
  };
}

// ---------------------------------------------------------------------------
// Filterzustand
// ---------------------------------------------------------------------------

export const SORT_KEYS = [
  'name',
  'price-asc',
  'price-desc',
  'power-desc',
  'power-asc',
  'torque-desc',
  'weight-asc',
  'seat-asc',
] as const;
export type SortKey = (typeof SORT_KEYS)[number];

/** Bereich mit optionalem Minimum und Maximum (jeweils inklusive). */
export interface Range {
  min?: number;
  max?: number;
}

export interface CatalogFilters {
  query: string;
  sort: SortKey;
  manufacturers: string[];
  categories: Category[];
  /** CHF */
  price: Range;
  /** PS */
  power: Range;
  /** cm³ */
  displacement: Range;
  cylinders: number[];
  /** Nur Bikes mit offizieller Drosselung */
  throttleable: boolean;
  /** Quickshifter serienmässig oder optional */
  quickshifter: boolean;
  /** Auto-Blipper serienmässig oder optional */
  blipper: boolean;
  /** Alle gewählten Extras müssen vorhanden sein (Serie oder optional) */
  extras: string[];
  /** «Mein Führerausweis»: zeigt alle Bikes, die man damit fahren darf */
  licence: LicenceCategory | null;
  /** Bei «A beschränkt» auch Bikes zeigen, die gedrosselt passen */
  includeThrottled: boolean;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  query: '',
  sort: 'name',
  manufacturers: [],
  categories: [],
  price: {},
  power: {},
  displacement: {},
  cylinders: [],
  throttleable: false,
  quickshifter: false,
  blipper: false,
  extras: [],
  licence: null,
  includeThrottled: false,
};

/** Wie viele Filter sind aktiv? (ohne Suche und Sortierung) – für das Badge am Filter-Knopf */
export function countActiveFilters(filters: CatalogFilters): number {
  const isSet = (range: Range) => range.min !== undefined || range.max !== undefined;
  return [
    filters.manufacturers.length > 0,
    filters.categories.length > 0,
    isSet(filters.price),
    isSet(filters.power),
    isSet(filters.displacement),
    filters.cylinders.length > 0,
    filters.throttleable,
    filters.quickshifter,
    filters.blipper,
    filters.extras.length > 0,
    filters.licence !== null,
  ].filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Filtern und Sortieren
// ---------------------------------------------------------------------------

function inRange(value: number, range: Range): boolean {
  return (
    (range.min === undefined || value >= range.min) &&
    (range.max === undefined || value <= range.max)
  );
}

function hasAvailability(value: Generation['quickshifter']): boolean {
  return value === 'standard' || value === 'optional';
}

function matchesQuery(entry: CatalogEntry, query: string): boolean {
  const tokens = query.split(/\s+/).map(normalizeSearch).filter(Boolean);
  return tokens.every((token) => entry.searchText.includes(token));
}

export function matchesFilters(entry: CatalogEntry, filters: CatalogFilters): boolean {
  const { model, generation } = entry;
  const extraKeys = new Set((generation.extras ?? []).map((extra) => extra.key));

  return (
    matchesQuery(entry, filters.query) &&
    (filters.manufacturers.length === 0 || filters.manufacturers.includes(model.manufacturerId)) &&
    (filters.categories.length === 0 || filters.categories.includes(model.category)) &&
    inRange(generation.price.chf, filters.price) &&
    inRange(entry.powerPs, filters.power) &&
    inRange(generation.engine.displacementCc, filters.displacement) &&
    (filters.cylinders.length === 0 || filters.cylinders.includes(generation.engine.cylinders)) &&
    (!filters.throttleable || generation.throttle.available) &&
    (!filters.quickshifter || hasAvailability(generation.quickshifter)) &&
    (!filters.blipper || hasAvailability(generation.blipper)) &&
    filters.extras.every((key) => extraKeys.has(key)) &&
    (filters.licence === null ||
      canRide(
        filters.licence,
        {
          displacementCc: generation.engine.displacementCc,
          powerKw: generation.engine.powerKw,
          weightKg: generation.chassis.weightKg,
          throttle: generation.throttle,
        },
        { includeThrottled: filters.includeThrottled },
      ))
  );
}

const byName = (a: CatalogEntry, b: CatalogEntry) => a.fullName.localeCompare(b.fullName, 'de-CH');

const COMPARATORS: Record<SortKey, (a: CatalogEntry, b: CatalogEntry) => number> = {
  name: byName,
  'price-asc': (a, b) => a.generation.price.chf - b.generation.price.chf,
  'price-desc': (a, b) => b.generation.price.chf - a.generation.price.chf,
  'power-desc': (a, b) => b.generation.engine.powerKw - a.generation.engine.powerKw,
  'power-asc': (a, b) => a.generation.engine.powerKw - b.generation.engine.powerKw,
  'torque-desc': (a, b) => b.generation.engine.torqueNm - a.generation.engine.torqueNm,
  'weight-asc': (a, b) => a.generation.chassis.weightKg - b.generation.chassis.weightKg,
  'seat-asc': (a, b) => a.generation.chassis.seatHeightMm - b.generation.chassis.seatHeightMm,
};

/** Sortiert eine Kopie; bei Gleichstand alphabetisch. */
export function sortEntries(entries: readonly CatalogEntry[], sort: SortKey): CatalogEntry[] {
  const compare = COMPARATORS[sort];
  return [...entries].sort((a, b) => compare(a, b) || byName(a, b));
}

/** Suche + Filter + Sortierung in einem Schritt. */
export function applyCatalogFilters(
  entries: readonly CatalogEntry[],
  filters: CatalogFilters,
): CatalogEntry[] {
  return sortEntries(
    entries.filter((entry) => matchesFilters(entry, filters)),
    filters.sort,
  );
}

/** Kleinster und grösster Wert einer Kennzahl – für die Grenzen der Schieberegler. */
export function valueBounds(
  entries: readonly CatalogEntry[],
  getValue: (entry: CatalogEntry) => number,
): { min: number; max: number } {
  const values = entries.map(getValue);
  if (values.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

// ---------------------------------------------------------------------------
// Filter ↔ URL
// ---------------------------------------------------------------------------

/** Namen der URL-Parameter, z. B. /bikes?marke=yamaha,ktm&ausweis=a35 */
export const URL_PARAMS = {
  query: 'q',
  sort: 'sort',
  manufacturers: 'marke',
  categories: 'kategorie',
  price: 'preis',
  power: 'ps',
  displacement: 'hubraum',
  cylinders: 'zylinder',
  throttleable: 'drosselbar',
  quickshifter: 'quickshifter',
  blipper: 'blipper',
  extras: 'extras',
  licence: 'ausweis',
  includeThrottled: 'gedrosselt',
} as const satisfies Record<keyof CatalogFilters, string>;

const LICENCE_URL_VALUES: Record<LicenceCategory, string> = { A1: 'a1', A_LIMITED: 'a35', A: 'a' };

function parseList(value: string | null): string[] {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

/** "5000-12000" → { min: 5000, max: 12000 }, "-12000" → { max: 12000 } */
function parseRange(value: string | null): Range {
  if (!value) return {};
  const [min, max] = value.split('-');
  const range: Range = {};
  const parsedMin = parseNumber(min);
  const parsedMax = parseNumber(max);
  if (parsedMin !== undefined) range.min = parsedMin;
  if (parsedMax !== undefined) range.max = parsedMax;
  return range;
}

function serializeRange(range: Range): string | null {
  if (range.min === undefined && range.max === undefined) return null;
  return `${range.min ?? ''}-${range.max ?? ''}`;
}

/** Liest den Filterzustand aus der URL. Ungültige Werte werden ignoriert. */
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const flag = (name: string) => params.get(name) === '1';
  const sort = params.get(URL_PARAMS.sort);
  const licenceValue = params.get(URL_PARAMS.licence);
  const licence = (Object.keys(LICENCE_URL_VALUES) as LicenceCategory[]).find(
    (category) => LICENCE_URL_VALUES[category] === licenceValue,
  );

  return {
    query: params.get(URL_PARAMS.query) ?? '',
    sort: SORT_KEYS.find((key) => key === sort) ?? DEFAULT_FILTERS.sort,
    manufacturers: parseList(params.get(URL_PARAMS.manufacturers)),
    categories: parseList(params.get(URL_PARAMS.categories)).filter((value): value is Category =>
      (CATEGORIES as readonly string[]).includes(value),
    ),
    price: parseRange(params.get(URL_PARAMS.price)),
    power: parseRange(params.get(URL_PARAMS.power)),
    displacement: parseRange(params.get(URL_PARAMS.displacement)),
    cylinders: parseList(params.get(URL_PARAMS.cylinders))
      .map(Number)
      .filter((value) => Number.isInteger(value) && value > 0),
    throttleable: flag(URL_PARAMS.throttleable),
    quickshifter: flag(URL_PARAMS.quickshifter),
    blipper: flag(URL_PARAMS.blipper),
    extras: parseList(params.get(URL_PARAMS.extras)),
    licence: licence ?? null,
    includeThrottled: flag(URL_PARAMS.includeThrottled),
  };
}

/** Schreibt den Filterzustand in URL-Parameter. Standardwerte werden weggelassen. */
export function serializeFilters(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  const set = (name: string, value: string | null) => {
    if (value) params.set(name, value);
  };
  const list = (values: readonly (string | number)[]) =>
    values.length > 0 ? values.join(',') : null;

  set(URL_PARAMS.query, filters.query.trim() || null);
  set(URL_PARAMS.sort, filters.sort === DEFAULT_FILTERS.sort ? null : filters.sort);
  set(URL_PARAMS.manufacturers, list(filters.manufacturers));
  set(URL_PARAMS.categories, list(filters.categories));
  set(URL_PARAMS.price, serializeRange(filters.price));
  set(URL_PARAMS.power, serializeRange(filters.power));
  set(URL_PARAMS.displacement, serializeRange(filters.displacement));
  set(URL_PARAMS.cylinders, list(filters.cylinders));
  set(URL_PARAMS.throttleable, filters.throttleable ? '1' : null);
  set(URL_PARAMS.quickshifter, filters.quickshifter ? '1' : null);
  set(URL_PARAMS.blipper, filters.blipper ? '1' : null);
  set(URL_PARAMS.extras, list(filters.extras));
  set(URL_PARAMS.licence, filters.licence ? LICENCE_URL_VALUES[filters.licence] : null);
  set(URL_PARAMS.includeThrottled, filters.includeThrottled ? '1' : null);
  return params;
}
