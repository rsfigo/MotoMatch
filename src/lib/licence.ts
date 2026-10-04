/**
 * Führerausweis-Kategorien für Motorräder in der Schweiz
 * ------------------------------------------------------
 * Die Kategorie wird nie gespeichert, sondern aus Hubraum, Leistung und Gewicht berechnet.
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
    /** Leistungsgewicht, wie in der EU (0.1 kW/kg). */
    maxPowerToWeightKwPerKg: 0.1,
  },
  A_LIMITED: {
    maxPowerKw: 35,
    maxPowerToWeightKwPerKg: 0.2,
    /** Gedrosselte Motorräder dürfen ursprünglich höchstens doppelt so stark sein (70 kW). */
    maxOriginalPowerKw: 70,
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

function fitsA1({ displacementCc, powerKw, weightKg }: LicenceInput): boolean {
  const limits = LICENCE_LIMITS.A1;
  return (
    atMost(displacementCc, limits.maxDisplacementCc) &&
    atMost(powerKw, limits.maxPowerKw) &&
    atMost(powerToWeight(powerKw, weightKg), limits.maxPowerToWeightKwPerKg)
  );
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
 * alle Grenzen einhält. Sonst null.
 */
export function licenceWithThrottle(bike: LicenceInput): LicenceCategory | null {
  const throttledPowerKw = bike.throttle?.available ? bike.throttle.throttledPowerKw : undefined;
  if (throttledPowerKw === undefined) return null;
  if (requiredLicence(bike) !== 'A') return null;
  if (!atMost(bike.powerKw, LICENCE_LIMITS.A_LIMITED.maxOriginalPowerKw)) return null;
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
