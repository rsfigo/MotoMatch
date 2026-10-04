import { describe, expect, it } from 'vitest';
import { makeGeneration, makeModel } from '@/test/fixtures';
import { getAllModels } from './data';
import {
  budgetFit,
  comfortableSeatMm,
  inseamMm,
  isAllowed,
  matchBikes,
  matchPercent,
  purposeScore,
  RESULT_MAX,
  scoreCriteria,
  seatHeightFit,
  type MatchAnswers,
} from './match';
import { licenceOf } from './specs';

const answers = (overrides: Partial<MatchAnswers> = {}): MatchAnswers => ({
  licence: 'A',
  heightCm: 175,
  budgetChf: 10000,
  purposes: ['city'],
  experience: 'intermediate',
  soundImportance: 1,
  tuningImportance: 1,
  ...overrides,
});

const base = makeGeneration();
const withProfile = (profile: Partial<typeof base.scores.profile>) =>
  makeGeneration({ scores: { ...base.scores, profile: { ...base.scores.profile, ...profile } } });

describe('Sitzhöhe aus der Körpergrösse', () => {
  it('schätzt die Schrittlänge auf 46 % der Körpergrösse', () => {
    expect(inseamMm(175)).toBeCloseTo(805);
    expect(comfortableSeatMm(175)).toBeCloseTo(855);
  });

  it('bis Schrittlänge + 5 cm passt es voll, ab + 10 cm gar nicht, dazwischen linear', () => {
    // 165 cm → Schrittlänge 759 mm → bequem bis 809 mm, zu hoch ab 859 mm
    expect(seatHeightFit(805, 165)).toBe(1);
    expect(seatHeightFit(834, 165)).toBeCloseTo(0.5);
    expect(seatHeightFit(860, 165)).toBe(0);
  });
});

describe('Budget', () => {
  it('im Budget voll, 12.5 % darüber halb, ab 25 % darüber null', () => {
    expect(budgetFit(9000, 10000)).toBe(1);
    expect(budgetFit(10000, 10000)).toBe(1);
    expect(budgetFit(11250, 10000)).toBeCloseTo(0.5);
    expect(budgetFit(12500, 10000)).toBe(0);
    expect(budgetFit(20000, 10000)).toBe(0);
  });
});

describe('Einsatzzweck', () => {
  it('mittelt die Profilwerte der gewählten Zwecke', () => {
    const generation = withProfile({ city: 9, touring: 5 });
    expect(purposeScore(generation, ['city'])).toBe(9);
    expect(purposeScore(generation, ['city', 'touring'])).toBe(7);
    expect(purposeScore(generation, [])).toBe(0);
  });
});

describe('Führerausweis (hartes Kriterium)', () => {
  const a1 = makeGeneration({
    engine: { ...base.engine, displacementCc: 125, powerKw: 11 },
    chassis: { ...base.chassis, weightKg: 140 },
    throttle: { available: false },
  });
  const throttleable = makeGeneration({
    engine: { ...base.engine, powerKw: 54 },
    chassis: { ...base.chassis, weightKg: 184 },
    throttle: { available: true, throttledPowerKw: 35 },
  });
  const big = makeGeneration({
    engine: { ...base.engine, powerKw: 100 },
    throttle: { available: false },
  });

  it('A1 nur mit A1-Bikes, A beschränkt auch gedrosselt, A und «offen» alles', () => {
    expect(isAllowed(a1, 'A1')).toBe(true);
    expect(isAllowed(throttleable, 'A1')).toBe(false);
    expect(isAllowed(throttleable, 'A_LIMITED')).toBe(true);
    expect(isAllowed(big, 'A_LIMITED')).toBe(false);
    expect(isAllowed(big, 'A')).toBe(true);
    expect(isAllowed(big, 'none')).toBe(true);
  });

  it('gedrosselte Bikes zählen bei «A beschränkt» mit ihrer gedrosselten Leistung', () => {
    const power = (licence: MatchAnswers['licence']) =>
      scoreCriteria(throttleable, answers({ licence, experience: 'experienced' })).find(
        (criterion) => criterion.key === 'power',
      )?.fit;
    expect(power('A_LIMITED')).toBe(1); // 35 kW von 35 kW
    expect(power('A')).toBeCloseTo(54 / 80);
  });

  it('bei A1 gibt es kein Leistungskriterium', () => {
    const power = scoreCriteria(a1, answers({ licence: 'A1' })).find(
      (criterion) => criterion.key === 'power',
    );
    expect(power?.weight).toBe(0);
  });
});

describe('Gewichtung', () => {
  it('Match-Prozent ist der gewichtete Durchschnitt', () => {
    expect(
      matchPercent([
        { key: 'purpose', fit: 1, weight: 3 },
        { key: 'budget', fit: 0.5, weight: 1 },
      ]),
    ).toBe(88); // (3 + 0.5) / 4
  });

  it('«egal» bei Sound oder Budget fliesst nicht ein', () => {
    const criteria = scoreCriteria(base, answers({ soundImportance: 0, budgetChf: null }));
    expect(criteria.find((criterion) => criterion.key === 'sound')?.weight).toBe(0);
    expect(criteria.find((criterion) => criterion.key === 'budget')?.weight).toBe(0);
  });

  it('für Neulinge zählen Einsteigerfreundlichkeit und Sitzhöhe mehr', () => {
    const weightOf = (experience: MatchAnswers['experience'], key: string) =>
      scoreCriteria(base, answers({ experience })).find((criterion) => criterion.key === key)
        ?.weight;
    expect(weightOf('beginner', 'experience')).toBe(2);
    expect(weightOf('experienced', 'experience')).toBe(0);
    expect(weightOf('beginner', 'seatHeight')).toBeGreaterThan(
      weightOf('experienced', 'seatHeight') ?? 0,
    );
  });
});

describe('matchBikes', () => {
  const cityBike = makeModel({
    id: 'stadt-bike',
    generations: [withProfile({ city: 10, touring: 3 })],
  });
  const tourer = makeModel({
    id: 'reise-bike',
    generations: [withProfile({ city: 4, touring: 10 })],
  });

  it('sortiert nach Match-Prozent', () => {
    const results = matchBikes([tourer, cityBike], answers({ purposes: ['city'] }));
    expect(results.map((result) => result.model.id)).toEqual(['stadt-bike', 'reise-bike']);
    expect(results[0]?.percent).toBeGreaterThan(results[1]?.percent ?? 100);
  });

  it('begründet Treffer und warnt bei Schwächen und Budget', () => {
    const expensive = makeModel({
      id: 'teuer',
      generations: [
        makeGeneration({
          price: { chf: 11000, asOf: '2026-10-04' },
          scores: { ...base.scores, profile: { ...base.scores.profile, city: 9, offroad: 1 } },
        }),
      ],
    });
    const [result] = matchBikes([expensive], answers({ purposes: ['city', 'offroad'] }));
    const kinds = result?.reasons.map((reason) => reason.kind);
    expect(kinds).toContain('overBudget');
    expect(kinds).toContain('purposeWeak');
    expect(result?.reasons.find((reason) => reason.kind === 'overBudget')).toMatchObject({
      overChf: 1000,
    });
  });
});

describe('matchBikes mit den echten Daten', () => {
  const models = getAllModels();

  it('zeigt 3 bis 5 Treffer, wenn der Ausweis genug Bikes erlaubt', () => {
    const results = matchBikes(models, answers({ licence: 'A_LIMITED' }));
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.length).toBeLessThanOrEqual(RESULT_MAX);
  });

  it('mit A1 nur Bikes, die man mit A1 fahren darf', () => {
    const results = matchBikes(models, answers({ licence: 'A1' }));
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) expect(licenceOf(result.generation).required).toBe('A1');
  });

  it('bei «A beschränkt» erscheint der Hinweis auf die Drosselung, wo nötig', () => {
    const results = matchBikes(models, answers({ licence: 'A_LIMITED' }));
    for (const result of results) {
      const needsThrottle = licenceOf(result.generation).required === 'A';
      expect(result.reasons.some((reason) => reason.kind === 'throttle')).toBe(needsThrottle);
    }
  });
});
