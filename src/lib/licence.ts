/**
 * Führerausweis-Kategorien für Motorräder in der Schweiz
 * ------------------------------------------------------
 * Die Kategorie wird nie gespeichert, sondern aus Hubraum, Leistung und Gewicht berechnet.
 *
 * Rechtsgrundlagen (Stand Oktober 2026, Details und Quellen in DECISIONS.md):
 * - A1: höchstens 125 cm³ und 11 kW (VZV Art. 3 Abs. 2). Eine kW/kg-Grenze wie in der EU
 *   (0.1 kW/kg) kennt das Schweizer Recht für A1 nicht.
 * - A beschränkt: höchstens 35 kW und 0.2 kW/kg, bezogen auf das «Gewicht in fahrbereitem
 *   Zustand» (VZV Art. 15 Abs. 2, VTS Art. 136 Abs. 1): mit mind. 90 % Treibstoff, ohne Fahrer.
 * - Gedrosselte Motorräder: Die Serienleistung darf höchstens doppelt so hoch sein wie die
 *   gedrosselte (VTS Art. 145a). Diese Regel betrifft die Typengenehmigung der gedrosselten
 *   Version. Offizielle 35-kW-Versionen der Hersteller erfüllen sie per Definition – manche
 *   werden dafür von einer schwächeren Variante abgeleitet (z. B. MT-09: 70 kW statt 87.5 kW).
 *   Darum prüfen wir hier nur, ob die offizielle Drosselung die Grenzen von «A beschränkt» einhält.
 *
 * Wichtig: Das Gewicht in den Daten ist ein Richtwert des Herstellers.
 * Verbindlich ist der Fahrzeugausweis. Die Grenzwerte sind vor dem Livegang
 * gegen die Angaben der Strassenverkehrsämter zu prüfen (siehe DECISIONS.md).
 */
import { powerToWeight } from './units';

/** A1 = Leichtmotorräder, A_LIMITED = «A beschränkt» (35 kW), A = unbeschränkt. */
export type LicenceCategory = 'A1' | 'A_LIMITED' | 'A';

/** Von tief nach hoch. Wer eine Kategorie besitzt, darf auch alles darunter fahren. */
export const LICENCE_ORDER: readonly LicenceCategory[] = ['A1', 'A_LIMITED', 'A'];

export const LICENCE_LIMITS = {
  A1: {
    maxDisplacementCc: 125,
    maxPowerKw: 11,
  },
  A_LIMITED: {
    maxPowerKw: 35,
    maxPowerToWeightKwPerKg: 0.2,
  },
} as const;

/**
 * Kleine Toleranz für Rundungsfehler bei Kommazahlen.
 * Beispiel: 35 kW bei 175 kg ergibt genau 0.2 kW/kg und ist damit noch erlaubt.
 */
const EPSILON = 1e-9;

export interface LicenceInput {
  displacementCc: number;
  powerKw: number;
  weightKg: number;
  throttle?: { available: boolean; throttledPowerKw?: number };
}

function atMost(value: number, limit: number): boolean {
  return value <= limit + EPSILON;
}

function fitsA1({ displacementCc, powerKw }: LicenceInput): boolean {
  const limits = LICENCE_LIMITS.A1;
  return atMost(displacementCc, limits.maxDisplacementCc) && atMost(powerKw, limits.maxPowerKw);
}

function fitsALimited(powerKw: number, weightKg: number): boolean {
  const limits = LICENCE_LIMITS.A_LIMITED;
  return (
    atMost(powerKw, limits.maxPowerKw) &&
    atMost(powerToWeight(powerKw, weightKg), limits.maxPowerToWeightKwPerKg)
  );
}

/** Welche Kategorie braucht man für das Bike im Serienzustand? */
export function requiredLicence(bike: LicenceInput): LicenceCategory {
  if (fitsA1(bike)) return 'A1';
  if (fitsALimited(bike.powerKw, bike.weightKg)) return 'A_LIMITED';
  return 'A';
}

/**
 * Reicht mit offizieller Drosselung «A beschränkt»?
 * Liefert 'A_LIMITED', wenn das Bike ohne Drosselung «A» braucht und gedrosselt
 * höchstens 35 kW und 0.2 kW/kg hat. Sonst null.
 */
export function licenceWithThrottle(bike: LicenceInput): LicenceCategory | null {
  const throttledPowerKw = bike.throttle?.available ? bike.throttle.throttledPowerKw : undefined;
  if (throttledPowerKw === undefined) return null;
  if (requiredLicence(bike) !== 'A') return null;
  return fitsALimited(throttledPowerKw, bike.weightKg) ? 'A_LIMITED' : null;
}

export interface LicenceInfo {
  /** Kategorie im Serienzustand */
  required: LicenceCategory;
  /** Kategorie mit Drosselung, falls tiefer – sonst null */
  withThrottle: LicenceCategory | null;
  /** Leistungsgewicht in kW/kg (Serienzustand) */
  powerToWeightKwPerKg: number;
}

export function getLicenceInfo(bike: LicenceInput): LicenceInfo {
  return {
    required: requiredLicence(bike),
    withThrottle: licenceWithThrottle(bike),
    powerToWeightKwPerKg: powerToWeight(bike.powerKw, bike.weightKg),
  };
}

function rank(category: LicenceCategory): number {
  return LICENCE_ORDER.indexOf(category);
}

/**
 * Darf jemand mit dieser Kategorie das Bike fahren?
 * Mit `includeThrottled` zählen auch Bikes, die gedrosselt in die Kategorie passen.
 */
export function canRide(
  licence: LicenceCategory,
  bike: LicenceInput,
  { includeThrottled = false }: { includeThrottled?: boolean } = {},
): boolean {
  if (rank(requiredLicence(bike)) <= rank(licence)) return true;
  if (!includeThrottled) return false;
  const throttled = licenceWithThrottle(bike);
  return throttled !== null && rank(throttled) <= rank(licence);
}
