/**
 * Formatierung im Schweizer Stil
 * ------------------------------
 * - Tausendertrennzeichen: Apostroph ’ (z. B. 12’490)
 * - Dezimalpunkt: . (z. B. 4.3)
 * - Preise: «CHF 12’490.–»
 * - Zwischen Zahl und Einheit steht ein geschütztes Leerzeichen (kein Zeilenumbruch).
 *
 * Bewusst ohne Intl.NumberFormat: So ist das Ergebnis in jedem Browser gleich und testbar.
 */
import { kwToPs } from './units';

/** Geschütztes Leerzeichen zwischen Zahl und Einheit. */
export const NBSP = '\u00A0';
const THOUSANDS_SEPARATOR = '’';
const EN_DASH = '–';

/** Fügt Tausendertrennzeichen in eine Ziffernfolge ein: "12490" → "12’490". */
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}

/** Zahl mit fester Anzahl Nachkommastellen, z. B. formatNumber(1234.56, 1) → "1’234.6". */
export function formatNumber(value: number, decimals = 0): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [integerPart = '0', fraction] = fixed.split('.');
  // Typografisches Minus (−), aber kein «−0» bei gerundeten Werten
  const sign = value < 0 && Number(fixed) !== 0 ? '−' : '';
  return `${sign}${groupThousands(integerPart)}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Zahl mit höchstens `maxDecimals` Nachkommastellen, ohne überflüssige Nullen:
 * formatCompact(50.2) → "50.2", formatCompact(70) → "70".
 */
export function formatCompact(value: number, maxDecimals = 1): string {
  const rounded = Number(value.toFixed(maxDecimals));
  const decimals = Number.isInteger(rounded) ? 0 : (rounded.toString().split('.')[1]?.length ?? 0);
  return formatNumber(rounded, Math.min(decimals, maxDecimals));
}

/** Preis in Franken: 12490 → «CHF 12’490.–», 12490.5 → «CHF 12’490.50». */
export function formatChf(amount: number): string {
  const isWhole = Number.isInteger(Math.round(amount * 100) / 100);
  const value = isWhole ? `${formatNumber(amount)}.–` : formatNumber(amount, 2);
  return `CHF${NBSP}${value}`;
}

export function formatPs(kw: number): string {
  return `${formatNumber(kwToPs(kw))}${NBSP}PS`;
}

export function formatKw(kw: number): string {
  return `${formatCompact(kw)}${NBSP}kW`;
}

/** Leistung in beiden Einheiten: «95 PS (70 kW)». */
export function formatPower(kw: number): string {
  return `${formatPs(kw)} (${formatKw(kw)})`;
}

export function formatTorque(nm: number): string {
  return `${formatCompact(nm)}${NBSP}Nm`;
}

export function formatRpm(rpm: number): string {
  return `${formatNumber(rpm)}${NBSP}U/min`;
}

export function formatDisplacement(cc: number): string {
  return `${formatNumber(cc)}${NBSP}cm³`;
}

export function formatWeight(kg: number): string {
  return `${formatCompact(kg)}${NBSP}kg`;
}

export function formatSeatHeight(mm: number): string {
  return `${formatNumber(mm)}${NBSP}mm`;
}

export function formatLitres(litres: number): string {
  return `${formatCompact(litres)}${NBSP}l`;
}

export function formatConsumption(litresPer100km: number): string {
  return `${formatCompact(litresPer100km)}${NBSP}l/100${NBSP}km`;
}

export function formatSpeed(kmh: number): string {
  return `${formatNumber(kmh)}${NBSP}km/h`;
}

export function formatSeconds(seconds: number): string {
  return `${formatCompact(seconds)}${NBSP}s`;
}

export function formatDecibel(db: number): string {
  return `${formatCompact(db)}${NBSP}dB(A)`;
}

/** Leistungsgewicht mit drei Nachkommastellen: «0.200 kW/kg». */
export function formatPowerToWeight(kwPerKg: number): string {
  return `${formatNumber(kwPerKg, 3)}${NBSP}kW/kg`;
}

/** Reichweite, auf 10 km gerundet: «ca. 330 km». */
export function formatRange(km: number): string {
  return `ca.${NBSP}${formatNumber(Math.round(km / 10) * 10)}${NBSP}km`;
}

/**
 * Abstand mit Vorzeichen, z. B. formatSigned(-5, formatWeight) → «−5 kg».
 * Typografisches Minus (−); bei 0 «±0».
 */
export function formatSigned(delta: number, format: (value: number) => string): string {
  if (delta === 0) return `±${format(0)}`;
  return `${delta > 0 ? '+' : '−'}${format(Math.abs(delta))}`;
}

/** Baujahre: «2022–2024», «ab 2022» (noch erhältlich) oder «2024» (nur ein Jahr). */
export function formatYearRange(yearFrom: number, yearTo: number | null): string {
  if (yearTo === null) return `ab${NBSP}${yearFrom}`;
  if (yearTo === yearFrom) return String(yearFrom);
  return `${yearFrom}${EN_DASH}${yearTo}`;
}

/** Datum im Schweizer Format: "2026-10-04" → «4.10.2026». */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}
