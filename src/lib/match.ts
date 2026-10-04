/**
 * Match-Wizard: Bewertung
 * -----------------------
 * Reine Funktion: Antworten + Bikes → Treffer mit Match-Prozent und Begründungen.
 *
 * 1. Der Führerausweis ist ein hartes Kriterium (Gesetz): Bikes, die man nicht fahren darf,
 *    fallen weg. Bei «A beschränkt» zählen Bikes mit offizieller Drosselung mit.
 * 2. Alle anderen Antworten sind Kriterien mit einem Wert von 0 bis 1 und einem Gewicht.
 *    Das Match-Prozent ist der gewichtete Durchschnitt.
 *
 * Alle Annahmen (Schrittlänge, Gewichte, Toleranzen) stehen als Konstanten hier und
 * sind in DECISIONS.md begründet. Bewertet wird jeweils die neueste Generation.
 */
import type { Generation, Model } from '@/data/schema';
import { latestGeneration } from './generations';
import { canRide, type LicenceCategory } from './licence';
import { licenceOf } from './specs';

/** «none» = Ausweis noch offen: alle Bikes kommen infrage. */
export type LicenceAnswer = LicenceCategory | 'none';
export type Purpose = 'city' | 'touring' | 'sport' | 'offroad';
export type Experience = 'beginner' | 'intermediate' | 'experienced';
/** 0 = egal, 1 = etwas, 2 = wichtig, 3 = sehr wichtig */
export type Importance = 0 | 1 | 2 | 3;

export const PURPOSES: readonly Purpose[] = ['city', 'touring', 'sport', 'offroad'];
export const EXPERIENCES: readonly Experience[] = ['beginner', 'intermediate', 'experienced'];
export const IMPORTANCES: readonly Importance[] = [0, 1, 2, 3];

export interface MatchAnswers {
  licence: LicenceAnswer;
  heightCm: number;
  /** Höchstbudget in CHF; null = egal */
  budgetChf: number | null;
  purposes: readonly Purpose[];
  experience: Experience;
  soundImportance: Importance;
  tuningImportance: Importance;
}

// ---------------------------------------------------------------------------
// Annahmen
// ---------------------------------------------------------------------------

/** Schrittlänge ≈ 46 % der Körpergrösse (Durchschnitt Erwachsener). */
export const INSEAM_RATIO = 0.46;
/** Bis Schrittlänge + 5 cm erreicht man den Boden meist mit beiden Fussballen: bequem. */
export const SEAT_COMFORT_MARGIN_MM = 50;
/** Ab Schrittlänge + 10 cm nur noch auf Zehenspitzen: zu hoch. Dazwischen linear. */
export const SEAT_LIMIT_MARGIN_MM = 100;
/** Ab 25 % über dem Budget zählt der Preis gar nicht mehr. Dazwischen linear. */
export const BUDGET_TOLERANCE = 0.25;

/**
 * Leistung, die jemand «ausnutzen» möchte (kW). Bei «A beschränkt» sind es die erlaubten
 * 35 kW; sonst hängt es von der Erfahrung ab. Bei A1 gibt es kein Leistungskriterium,
 * weil alle A1-Bikes gleich stark sein dürfen.
 */
export const POWER_REFERENCE_KW: Record<Experience, number> = {
  beginner: 35,
  intermediate: 55,
  experienced: 80,
};
const A_LIMITED_POWER_KW = 35;

/** Gewichte der Kriterien. Sound und Tuning: so wichtig, wie angegeben (0–3). */
export const WEIGHTS = {
  purpose: 3,
  budget: 3,
  seatHeight: { beginner: 3, intermediate: 2, experienced: 1 },
  experience: { beginner: 2, intermediate: 1, experienced: 0 },
  power: 2,
} as const;

/** Angezeigt werden 3 bis 5 Treffer: Platz 4 und 5 nur, wenn sie nah am besten liegen. */
export const RESULT_MIN = 3;
export const RESULT_MAX = 5;
export const RESULT_GAP_POINTS = 20;

// ---------------------------------------------------------------------------
// Einzelne Kriterien (0 = passt nicht, 1 = passt voll)
// ---------------------------------------------------------------------------

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Geschätzte Schrittlänge in mm. */
export function inseamMm(heightCm: number): number {
  return heightCm * 10 * INSEAM_RATIO;
}

/** Bis zu dieser Sitzhöhe (mm) gilt ein Bike als bequem. */
export function comfortableSeatMm(heightCm: number): number {
  return inseamMm(heightCm) + SEAT_COMFORT_MARGIN_MM;
}

export function seatHeightFit(seatHeightMm: number, heightCm: number): number {
  const comfortable = comfortableSeatMm(heightCm);
  const range = SEAT_LIMIT_MARGIN_MM - SEAT_COMFORT_MARGIN_MM;
  return clamp01(1 - (seatHeightMm - comfortable) / range);
}

export function budgetFit(priceChf: number, budgetChf: number): number {
  if (priceChf <= budgetChf) return 1;
  const overshoot = (priceChf - budgetChf) / budgetChf;
  return clamp01(1 - overshoot / BUDGET_TOLERANCE);
}

/** Durchschnitt der Profilwerte (1–10) für die gewählten Einsatzzwecke. */
export function purposeScore(generation: Generation, purposes: readonly Purpose[]): number {
  if (purposes.length === 0) return 0;
  const total = purposes.reduce((sum, purpose) => sum + generation.scores.profile[purpose], 0);
  return total / purposes.length;
}

/** Leistung, mit der man das Bike fährt: bei «A beschränkt» und Drosselung die gedrosselte. */
export function effectivePowerKw(generation: Generation, licence: LicenceAnswer): number {
  const info = licenceOf(generation);
  if (licence === 'A_LIMITED' && info.required === 'A' && generation.throttle.throttledPowerKw) {
    return generation.throttle.throttledPowerKw;
  }
  return generation.engine.powerKw;
}

function powerReferenceKw(answers: MatchAnswers): number {
  return answers.licence === 'A_LIMITED'
    ? A_LIMITED_POWER_KW
    : POWER_REFERENCE_KW[answers.experience];
}

// ---------------------------------------------------------------------------
// Gesamtbewertung
// ---------------------------------------------------------------------------

export type CriterionKey =
  'purpose' | 'budget' | 'seatHeight' | 'experience' | 'power' | 'sound' | 'tuning';

export interface Criterion {
  key: CriterionKey;
  /** 0 bis 1 */
  fit: number;
  weight: number;
}

/** Begründungen als Daten – die Texte dazu stehen in i18n/de.ts. */
export type MatchReason =
  | { kind: 'purpose'; tone: 'positive'; purposes: Purpose[]; score: number }
  | { kind: 'purposeWeak'; tone: 'warning'; purpose: Purpose; score: number }
  | { kind: 'withinBudget'; tone: 'positive'; priceChf: number }
  | { kind: 'overBudget'; tone: 'warning'; overChf: number }
  | { kind: 'seatFits'; tone: 'positive'; seatHeightMm: number }
  | { kind: 'seatHigh'; tone: 'warning'; seatHeightMm: number }
  | { kind: 'beginnerFriendly'; tone: 'positive'; score: number }
  | { kind: 'forExperienced'; tone: 'warning'; score: number }
  | { kind: 'power'; tone: 'positive'; powerKw: number }
  | { kind: 'sound'; tone: 'positive'; score: number }
  | { kind: 'tuning'; tone: 'positive'; score: number }
  | { kind: 'throttle'; tone: 'info'; throttledPowerKw: number };

export interface MatchResult {
  model: Model;
  generation: Generation;
  /** 0 bis 100, gerundet */
  percent: number;
  criteria: Criterion[];
  reasons: MatchReason[];
}

/** Darf man das Bike mit diesem Ausweis fahren (bei «A beschränkt» auch gedrosselt)? */
export function isAllowed(generation: Generation, licence: LicenceAnswer): boolean {
  if (licence === 'none') return true;
  return canRide(
    licence,
    {
      displacementCc: generation.engine.displacementCc,
      powerKw: generation.engine.powerKw,
      weightKg: generation.chassis.weightKg,
      throttle: generation.throttle,
    },
    { includeThrottled: true },
  );
}

export function scoreCriteria(generation: Generation, answers: MatchAnswers): Criterion[] {
  const { scores } = generation;
  const criteria: Criterion[] = [
    {
      key: 'purpose',
      fit: purposeScore(generation, answers.purposes) / 10,
      weight: answers.purposes.length > 0 ? WEIGHTS.purpose : 0,
    },
    {
      key: 'budget',
      fit: answers.budgetChf === null ? 1 : budgetFit(generation.price.chf, answers.budgetChf),
      weight: answers.budgetChf === null ? 0 : WEIGHTS.budget,
    },
    {
      key: 'seatHeight',
      fit: seatHeightFit(generation.chassis.seatHeightMm, answers.heightCm),
      weight: WEIGHTS.seatHeight[answers.experience],
    },
    {
      key: 'experience',
      // Neu dabei: so einsteigerfreundlich wie möglich; etwas Erfahrung: halb so streng
      fit:
        answers.experience === 'beginner'
          ? scores.profile.beginner / 10
          : 0.5 + scores.profile.beginner / 20,
      weight: WEIGHTS.experience[answers.experience],
    },
    {
      key: 'power',
      fit: clamp01(effectivePowerKw(generation, answers.licence) / powerReferenceKw(answers)),
      weight: answers.licence === 'A1' ? 0 : WEIGHTS.power,
    },
    { key: 'sound', fit: scores.sound / 10, weight: answers.soundImportance },
    {
      key: 'tuning',
      fit: (scores.tuningVisual + scores.tuningPerformance) / 20,
      weight: answers.tuningImportance,
    },
  ];
  return criteria;
}

/** Gewichteter Durchschnitt in Prozent (0–100, gerundet). */
export function matchPercent(criteria: readonly Criterion[]): number {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = criteria.reduce((sum, criterion) => sum + criterion.fit * criterion.weight, 0);
  return Math.round((weighted / totalWeight) * 100);
}

/** Kurze Begründungen: zuerst, was passt, dann Hinweise. */
export function buildReasons(
  generation: Generation,
  answers: MatchAnswers,
  criteria: readonly Criterion[],
): MatchReason[] {
  const fitOf = (key: CriterionKey) => criteria.find((criterion) => criterion.key === key);
  const positives: MatchReason[] = [];
  const warnings: MatchReason[] = [];
  const { scores } = generation;

  const purpose = purposeScore(generation, answers.purposes);
  if (answers.purposes.length > 0 && purpose >= 7) {
    positives.push({
      kind: 'purpose',
      tone: 'positive',
      purposes: [...answers.purposes],
      score: Math.round(purpose),
    });
  }
  const weakest = [...answers.purposes].sort((a, b) => scores.profile[a] - scores.profile[b])[0];
  if (weakest && scores.profile[weakest] <= 4) {
    warnings.push({
      kind: 'purposeWeak',
      tone: 'warning',
      purpose: weakest,
      score: scores.profile[weakest],
    });
  }

  if (answers.budgetChf !== null) {
    if (generation.price.chf <= answers.budgetChf) {
      positives.push({ kind: 'withinBudget', tone: 'positive', priceChf: generation.price.chf });
    } else {
      warnings.push({
        kind: 'overBudget',
        tone: 'warning',
        overChf: generation.price.chf - answers.budgetChf,
      });
    }
  }

  const seat = fitOf('seatHeight')?.fit ?? 1;
  const seatHeightMm = generation.chassis.seatHeightMm;
  if (seat >= 1) positives.push({ kind: 'seatFits', tone: 'positive', seatHeightMm });
  else if (seat < 0.6) warnings.push({ kind: 'seatHigh', tone: 'warning', seatHeightMm });

  if (answers.experience !== 'experienced') {
    const beginner = scores.profile.beginner;
    if (beginner >= 8)
      positives.push({ kind: 'beginnerFriendly', tone: 'positive', score: beginner });
    else if (beginner <= 5)
      warnings.push({ kind: 'forExperienced', tone: 'warning', score: beginner });
  }

  if (answers.experience === 'experienced' && answers.licence !== 'A1') {
    const power = fitOf('power')?.fit ?? 0;
    if (power >= 1) {
      positives.push({
        kind: 'power',
        tone: 'positive',
        powerKw: effectivePowerKw(generation, answers.licence),
      });
    }
  }

  if (answers.soundImportance >= 2 && scores.sound >= 8) {
    positives.push({ kind: 'sound', tone: 'positive', score: scores.sound });
  }
  const tuning = Math.round((scores.tuningVisual + scores.tuningPerformance) / 2);
  if (answers.tuningImportance >= 2 && tuning >= 7) {
    positives.push({ kind: 'tuning', tone: 'positive', score: tuning });
  }

  const info: MatchReason[] = [];
  const throttledPowerKw = generation.throttle.throttledPowerKw;
  if (
    answers.licence === 'A_LIMITED' &&
    licenceOf(generation).required === 'A' &&
    throttledPowerKw
  ) {
    info.push({ kind: 'throttle', tone: 'info', throttledPowerKw });
  }

  return [...positives.slice(0, 3), ...warnings.slice(0, 2), ...info];
}

/**
 * Die besten Treffer, sortiert nach Match-Prozent (bei Gleichstand der günstigere zuerst).
 * Es sind 3 bis 5: Platz 4 und 5 nur, wenn sie höchstens 20 Punkte hinter Platz 1 liegen.
 * Erlaubt der Ausweis weniger als 3 Bikes, sind es entsprechend weniger.
 */
export function matchBikes(models: readonly Model[], answers: MatchAnswers): MatchResult[] {
  const ranked = models
    .map((model) => ({ model, generation: latestGeneration(model) }))
    .filter(({ generation }) => isAllowed(generation, answers.licence))
    .map(({ model, generation }) => {
      const criteria = scoreCriteria(generation, answers);
      return {
        model,
        generation,
        percent: matchPercent(criteria),
        criteria,
        reasons: buildReasons(generation, answers, criteria),
      };
    })
    .sort(
      (a, b) =>
        b.percent - a.percent ||
        a.generation.price.chf - b.generation.price.chf ||
        a.model.id.localeCompare(b.model.id),
    );

  const best = ranked[0]?.percent ?? 0;
  return ranked
    .slice(0, RESULT_MAX)
    .filter((result, index) => index < RESULT_MIN || best - result.percent <= RESULT_GAP_POINTS);
}
