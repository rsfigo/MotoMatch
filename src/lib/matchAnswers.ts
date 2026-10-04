/**
 * Antworten des Match-Wizards in der URL
 * --------------------------------------
 * Jede Antwort steht in der URL, z. B.
 * /match?schritt=4&ausweis=a35&groesse=172&budget=9000
 * So funktionieren «Zurück» im Browser, Neuladen und Teilen des Ergebnisses.
 */
import {
  IMPORTANCES,
  PURPOSES,
  type Experience,
  type Importance,
  type LicenceAnswer,
  type MatchAnswers,
  type Purpose,
} from './match';

/** Die Fragen in ihrer Reihenfolge. */
export const MATCH_STEPS = [
  'licence',
  'height',
  'budget',
  'purpose',
  'experience',
  'preferences',
] as const;
export type MatchStep = (typeof MATCH_STEPS)[number];

/** Angezeigte Ansicht: eine Frage (Index) oder das Ergebnis. */
export type MatchView = number | 'result';

/** Antworten, solange der Wizard noch läuft (einzelne können fehlen). */
export type MatchDraft = Partial<MatchAnswers>;

export const HEIGHT_RANGE = { min: 150, max: 205, step: 1, initial: 175 } as const;
export const BUDGET_RANGE = { min: 5000, max: 25000, step: 500, initial: 10000 } as const;
export const DEFAULT_IMPORTANCE: Importance = 1;

const PARAMS = {
  view: 'schritt',
  licence: 'ausweis',
  height: 'groesse',
  budget: 'budget',
  purposes: 'einsatz',
  experience: 'erfahrung',
  sound: 'sound',
  tuning: 'tuning',
} as const;

const RESULT_VALUE = 'ergebnis';
const BUDGET_ANY = 'egal';

const LICENCE_VALUES: Record<LicenceAnswer, string> = {
  A1: 'a1',
  A_LIMITED: 'a35',
  A: 'a',
  none: 'offen',
};
const PURPOSE_VALUES: Record<Purpose, string> = {
  city: 'stadt',
  touring: 'touren',
  sport: 'sport',
  offroad: 'gelaende',
};
const EXPERIENCE_VALUES: Record<Experience, string> = {
  beginner: 'neu',
  intermediate: 'etwas',
  experienced: 'viel',
};

/** Sucht den Schlüssel zu einem URL-Wert, z. B. 'a35' → 'A_LIMITED'. */
function keyOf<K extends string>(values: Record<K, string>, value: string | null): K | undefined {
  return (Object.keys(values) as K[]).find((key) => values[key] === value);
}

function integerIn(value: string | null, min: number, max: number): number | undefined {
  if (value === null || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return number >= min && number <= max ? number : undefined;
}

function parseDraft(params: URLSearchParams): MatchDraft {
  const draft: MatchDraft = {};

  const licence = keyOf(LICENCE_VALUES, params.get(PARAMS.licence));
  if (licence) draft.licence = licence;

  const height = integerIn(params.get(PARAMS.height), HEIGHT_RANGE.min, HEIGHT_RANGE.max);
  if (height !== undefined) draft.heightCm = height;

  const budget = params.get(PARAMS.budget);
  if (budget === BUDGET_ANY) draft.budgetChf = null;
  else {
    const chf = integerIn(budget, BUDGET_RANGE.min, BUDGET_RANGE.max);
    if (chf !== undefined) draft.budgetChf = chf;
  }

  const purposes = (params.get(PARAMS.purposes) ?? '')
    .split(',')
    .map((value) => keyOf(PURPOSE_VALUES, value))
    .filter((purpose): purpose is Purpose => purpose !== undefined);
  if (purposes.length > 0)
    draft.purposes = PURPOSES.filter((purpose) => purposes.includes(purpose));

  const experience = keyOf(EXPERIENCE_VALUES, params.get(PARAMS.experience));
  if (experience) draft.experience = experience;

  const sound = integerIn(params.get(PARAMS.sound), 0, 3);
  if (sound !== undefined) draft.soundImportance = IMPORTANCES[sound];
  const tuning = integerIn(params.get(PARAMS.tuning), 0, 3);
  if (tuning !== undefined) draft.tuningImportance = IMPORTANCES[tuning];

  return draft;
}

/**
 * Vorgaben für Fragen mit Regler oder Auswahl: Sie gelten als beantwortet, sobald man
 * «Weiter» drückt – auch ohne etwas zu verändern.
 */
export function stepDefaults(step: MatchStep): MatchDraft {
  switch (step) {
    case 'height':
      return { heightCm: HEIGHT_RANGE.initial };
    case 'budget':
      return { budgetChf: BUDGET_RANGE.initial };
    case 'preferences':
      return { soundImportance: DEFAULT_IMPORTANCE, tuningImportance: DEFAULT_IMPORTANCE };
    default:
      return {};
  }
}

/** Antworten inklusive der Vorgaben der aktuellen Frage. */
export function withStepDefaults(step: MatchStep, draft: MatchDraft): MatchDraft {
  const defaults = stepDefaults(step);
  const merged: MatchDraft = { ...draft };
  for (const key of Object.keys(defaults) as (keyof MatchDraft)[]) {
    if (merged[key] === undefined) Object.assign(merged, { [key]: defaults[key] });
  }
  return merged;
}

/** Ist die Frage beantwortet? */
export function isStepAnswered(step: MatchStep, draft: MatchDraft): boolean {
  switch (step) {
    case 'licence':
      return draft.licence !== undefined;
    case 'height':
      return draft.heightCm !== undefined;
    case 'budget':
      return draft.budgetChf !== undefined;
    case 'purpose':
      return (draft.purposes?.length ?? 0) > 0;
    case 'experience':
      return draft.experience !== undefined;
    case 'preferences':
      return draft.soundImportance !== undefined && draft.tuningImportance !== undefined;
  }
}

/** Index der ersten offenen Frage – oder MATCH_STEPS.length, wenn alles beantwortet ist. */
export function firstOpenStep(draft: MatchDraft): number {
  const index = MATCH_STEPS.findIndex((step) => !isStepAnswered(step, draft));
  return index === -1 ? MATCH_STEPS.length : index;
}

/** Alle Antworten komplett? Dann als MatchAnswers, sonst null. */
export function completeAnswers(draft: MatchDraft): MatchAnswers | null {
  if (firstOpenStep(draft) < MATCH_STEPS.length) return null;
  const { licence, heightCm, budgetChf, purposes, experience, soundImportance, tuningImportance } =
    draft;
  if (
    licence === undefined ||
    heightCm === undefined ||
    budgetChf === undefined ||
    purposes === undefined ||
    experience === undefined ||
    soundImportance === undefined ||
    tuningImportance === undefined
  ) {
    return null;
  }
  return { licence, heightCm, budgetChf, purposes, experience, soundImportance, tuningImportance };
}

/**
 * Liest Antworten und Ansicht aus der URL. Überspringen geht nicht: Wer eine spätere
 * Frage oder das Ergebnis aufruft, landet bei der ersten offenen Frage.
 */
export function parseMatchParams(params: URLSearchParams): { draft: MatchDraft; view: MatchView } {
  const draft = parseDraft(params);
  const open = firstOpenStep(draft);
  const viewParam = params.get(PARAMS.view);

  if (viewParam === RESULT_VALUE) {
    return { draft, view: open === MATCH_STEPS.length ? 'result' : open };
  }
  const requested = (integerIn(viewParam, 1, MATCH_STEPS.length) ?? 1) - 1;
  return { draft, view: Math.min(requested, open) };
}

/** Schreibt Antworten und Ansicht als Suchstring, z. B. «?schritt=2&ausweis=a35». */
export function serializeMatchParams(draft: MatchDraft, view: MatchView): string {
  const params = new URLSearchParams();
  params.set(PARAMS.view, view === 'result' ? RESULT_VALUE : String(view + 1));
  if (draft.licence) params.set(PARAMS.licence, LICENCE_VALUES[draft.licence]);
  if (draft.heightCm !== undefined) params.set(PARAMS.height, String(draft.heightCm));
  if (draft.budgetChf !== undefined) {
    params.set(PARAMS.budget, draft.budgetChf === null ? BUDGET_ANY : String(draft.budgetChf));
  }
  if (draft.purposes?.length) {
    params.set(PARAMS.purposes, draft.purposes.map((purpose) => PURPOSE_VALUES[purpose]).join(','));
  }
  if (draft.experience) params.set(PARAMS.experience, EXPERIENCE_VALUES[draft.experience]);
  if (draft.soundImportance !== undefined) params.set(PARAMS.sound, String(draft.soundImportance));
  if (draft.tuningImportance !== undefined) {
    params.set(PARAMS.tuning, String(draft.tuningImportance));
  }
  // Kommas lesbar lassen (URLSearchParams würde sie als %2C schreiben)
  return `?${params.toString().replaceAll('%2C', ',')}`;
}
