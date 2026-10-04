/**
 * Fiktive Testdaten für Unit-Tests (kein echtes Motorrad).
 * Mit `overrides` lassen sich einzelne Felder gezielt ändern.
 */
import type { Generation, Model } from '@/data/schema';

export function makeGeneration(overrides: Partial<Generation> = {}): Generation {
  return {
    id: 'testmarke-testbike-2024',
    yearFrom: 2024,
    yearTo: null,
    engine: {
      displacementCc: 700,
      cylinders: 2,
      layout: 'Reihen-Zweizylinder',
      cooling: 'liquid',
      powerKw: 50,
      torqueNm: 65,
    },
    performance: {},
    chassis: { weightKg: 190, seatHeightMm: 800, tankL: 14, gears: 6, drive: 'chain' },
    throttle: { available: true, throttledPowerKw: 35 },
    quickshifter: 'optional',
    blipper: 'none',
    price: { chf: 9990, asOf: '2026-10-04' },
    scores: {
      tuningVisual: 7,
      tuningPerformance: 5,
      sound: 6,
      profile: { beginner: 7, city: 8, touring: 5, sport: 6, offroad: 2 },
    },
    tuningNote: 'Nur für Tests.',
    sound: { description: 'Nur für Tests.' },
    sources: [],
    dataStatus: 'verified',
    lastChecked: '2026-10-04',
    ...overrides,
  };
}

export function makeModel(overrides: Partial<Model> = {}): Model {
  return {
    id: 'testmarke-testbike',
    manufacturerId: 'testmarke',
    name: 'Testbike',
    category: 'naked',
    generations: [makeGeneration()],
    ...overrides,
  };
}
