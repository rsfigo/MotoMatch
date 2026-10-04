import { describe, expect, it } from 'vitest';
import { makeGeneration, makeModel } from '@/test/fixtures';
import { NBSP } from './format';
import {
  findGeneration,
  generationYears,
  isCurrentGeneration,
  latestGeneration,
  olderGenerations,
} from './generations';

const older = makeGeneration({ id: 'testmarke-testbike-2021', yearFrom: 2021, yearTo: 2024 });
const current = makeGeneration({ id: 'testmarke-testbike-2025', yearFrom: 2025, yearTo: null });
const model = makeModel({ generations: [older, current] });

describe('Generationen', () => {
  it('die neueste Generation ist die letzte in der Liste', () => {
    expect(latestGeneration(model).id).toBe('testmarke-testbike-2025');
  });

  it('findet eine Generation per ID, sonst die neueste', () => {
    expect(findGeneration(model, 'testmarke-testbike-2021').id).toBe('testmarke-testbike-2021');
    expect(findGeneration(model, 'gibt-es-nicht').id).toBe('testmarke-testbike-2025');
    expect(findGeneration(model).id).toBe('testmarke-testbike-2025');
  });

  it('listet ältere Generationen, neueste zuerst', () => {
    expect(olderGenerations(model).map((generation) => generation.id)).toEqual([
      'testmarke-testbike-2021',
    ]);
    expect(olderGenerations(makeModel())).toEqual([]);
  });

  it('zeigt Baujahre als Badge-Text', () => {
    expect(generationYears(older)).toBe('2021–2024');
    expect(generationYears(current).replace(NBSP, ' ')).toBe('ab 2025');
  });

  it('erkennt laufende Produktion', () => {
    expect(isCurrentGeneration(current)).toBe(true);
    expect(isCurrentGeneration(older)).toBe(false);
  });
});
