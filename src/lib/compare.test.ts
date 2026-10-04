import { describe, expect, it } from 'vitest';
import type { Feature } from '@/data/schema';
import { makeGeneration, makeModel } from '@/test/fixtures';
import {
  barFraction,
  bestIndices,
  buildCompareRows,
  buildExtraRows,
  deltaToBest,
  hasDifference,
  resolveCompareItems,
  serializeCompareItems,
} from './compare';
import { formatSigned, formatWeight, NBSP } from './format';
import { SPECS } from './specs';

const plain = (text: string | null | undefined) => text?.replaceAll(NBSP, ' ');

const mt07 = makeModel({
  id: 'yamaha-mt-07',
  generations: [
    makeGeneration({ id: 'yamaha-mt-07-2021', yearFrom: 2021, yearTo: 2024 }),
    makeGeneration({ id: 'yamaha-mt-07-2025', yearFrom: 2025 }),
  ],
});
const z650 = makeModel({
  id: 'kawasaki-z650',
  generations: [makeGeneration({ id: 'kawasaki-z650-2023', yearFrom: 2023 })],
});
const models = [mt07, z650];

describe('resolveCompareItems / serializeCompareItems', () => {
  it('versteht Modell-IDs (neueste Generation) und Generations-IDs', () => {
    const items = resolveCompareItems('yamaha-mt-07-2021,kawasaki-z650', models);
    expect(items.map((item) => item.generation.id)).toEqual([
      'yamaha-mt-07-2021',
      'kawasaki-z650-2023',
    ]);
    expect(resolveCompareItems('yamaha-mt-07', models)[0]?.generation.id).toBe('yamaha-mt-07-2025');
  });

  it('ignoriert Unbekanntes, Duplikate pro Modell und mehr als drei Bikes', () => {
    const items = resolveCompareItems(
      'gibt-es-nicht,yamaha-mt-07,yamaha-mt-07-2021,kawasaki-z650',
      models,
    );
    expect(items.map((item) => item.model.id)).toEqual(['yamaha-mt-07', 'kawasaki-z650']);
    expect(resolveCompareItems(null, models)).toEqual([]);
  });

  it('schreibt die neueste Generation als Modell-ID, ältere als Generations-ID', () => {
    const items = resolveCompareItems('yamaha-mt-07-2021,kawasaki-z650-2023', models);
    expect(serializeCompareItems(items)).toBe('yamaha-mt-07-2021,kawasaki-z650');
  });
});

describe('bestIndices', () => {
  it('höher ist besser (Leistung)', () => {
    expect(bestIndices([54, 70, 50], 'higher')).toEqual(new Set([1]));
  });

  it('tiefer ist besser (Preis, Gewicht)', () => {
    expect(bestIndices([8990, 7700, 9190], 'lower')).toEqual(new Set([1]));
  });

  it('Gleichstand: alle besten werden markiert', () => {
    expect(bestIndices([70, 70, 50], 'higher')).toEqual(new Set([0, 1]));
  });

  it('kein Bestwert bei «none», bei lauter gleichen Werten oder zu wenigen Werten', () => {
    expect(bestIndices([805, 790], 'none')).toEqual(new Set());
    expect(bestIndices([6, 6], 'higher')).toEqual(new Set());
    expect(bestIndices([190, undefined], 'higher')).toEqual(new Set());
  });

  it('fehlende Werte zählen nicht mit', () => {
    expect(bestIndices([undefined, 3.9, 4.2], 'lower')).toEqual(new Set([1]));
  });
});

describe('hasDifference', () => {
  it('erkennt Unterschiede, fehlende Werte zählen als eigener Wert', () => {
    expect(hasDifference(['6', '6'])).toBe(false);
    expect(hasDifference(['6', '5'])).toBe(true);
    expect(hasDifference(['6', null])).toBe(true);
  });
});

describe('buildCompareRows', () => {
  const light = makeGeneration({
    chassis: { weightKg: 180, seatHeightMm: 800, tankL: 14, gears: 6, drive: 'chain' },
  });
  const heavy = makeGeneration({
    chassis: {
      weightKg: 200,
      seatHeightMm: 800,
      tankL: 14,
      consumptionL100km: 4.5,
      gears: 6,
      drive: 'chain',
    },
  });

  it('markiert den besten Wert und liefert ihn für Differenzen', () => {
    const [row] = buildCompareRows([SPECS.weight], [light, heavy]);
    expect(row?.best).toEqual(new Set([0]));
    expect(row?.bestValue).toBe(180);
    expect(plain(formatSigned((row?.values[1] ?? 0) - (row?.bestValue ?? 0), formatWeight))).toBe(
      '+20 kg',
    );
  });

  it('optionale Zeilen nur, wenn mindestens ein Bike einen Wert hat', () => {
    const keys = buildCompareRows([SPECS.consumption, SPECS.noise], [light, heavy]).map(
      (row) => row.spec.key,
    );
    expect(keys).toEqual(['consumption']);
  });

  it('«Nur Unterschiede» blendet gleiche Zeilen aus', () => {
    const all = buildCompareRows([SPECS.weight, SPECS.gears], [light, heavy]);
    const differences = buildCompareRows([SPECS.weight, SPECS.gears], [light, heavy], {
      onlyDifferences: true,
    });
    expect(all.map((row) => row.spec.key)).toEqual(['weight', 'gears']);
    expect(differences.map((row) => row.spec.key)).toEqual(['weight']);
  });
});

describe('deltaToBest', () => {
  const weak = makeGeneration({ engine: { ...makeGeneration().engine, powerKw: 50 } });
  const strong = makeGeneration({ engine: { ...makeGeneration().engine, powerKw: 70 } });
  const almost = makeGeneration({ engine: { ...makeGeneration().engine, powerKw: 50.2 } });

  it('zeigt den Abstand zum Bestwert, nicht beim Bestwert selbst', () => {
    const [row] = buildCompareRows([SPECS.power], [weak, strong]);
    if (!row) throw new Error('Zeile fehlt');
    expect(plain(deltaToBest(row, 0))).toBe('−27 PS');
    expect(deltaToBest(row, 1)).toBeUndefined();
  });

  it('kein Chip, wenn gerundet kein Unterschied bleibt', () => {
    const [row] = buildCompareRows([SPECS.power], [weak, almost]);
    if (!row) throw new Error('Zeile fehlt');
    expect(row.best).toEqual(new Set([1]));
    expect(deltaToBest(row, 0)).toBeUndefined();
  });

  it('kein Chip bei Feldern ohne «besser» (z. B. Zylinder)', () => {
    const [row] = buildCompareRows([SPECS.cylinders], [weak, strong]);
    if (!row) throw new Error('Zeile fehlt');
    expect(deltaToBest(row, 0)).toBeUndefined();
  });
});

describe('barFraction', () => {
  it('misst am grössten Wert der Zeile', () => {
    const light = makeGeneration({ chassis: { ...makeGeneration().chassis, weightKg: 180 } });
    const heavy = makeGeneration({ chassis: { ...makeGeneration().chassis, weightKg: 200 } });
    const [row] = buildCompareRows([SPECS.weight], [light, heavy]);
    if (!row) throw new Error('Zeile fehlt');
    expect(barFraction(row, 0)).toBeCloseTo(0.9);
    expect(barFraction(row, 1)).toBe(1);
  });

  it('Wertungen messen an der Skala bis 10', () => {
    const scores = makeGeneration().scores;
    const seven = makeGeneration({ scores: { ...scores, tuningVisual: 7 } });
    const five = makeGeneration({ scores: { ...scores, tuningVisual: 5 } });
    const [row] = buildCompareRows([SPECS.tuningVisual], [seven, five]);
    if (!row) throw new Error('Zeile fehlt');
    expect(barFraction(row, 0)).toBeCloseTo(0.7);
    expect(barFraction(row, 1)).toBeCloseTo(0.5);
  });

  it('keine Balken für Zählwerte wie Zylinder', () => {
    const [row] = buildCompareRows([SPECS.cylinders], [makeGeneration(), makeGeneration()]);
    if (!row) throw new Error('Zeile fehlt');
    expect(barFraction(row, 0)).toBeUndefined();
  });
});

describe('buildExtraRows', () => {
  const features: Feature[] = [
    { key: 'heated-grips', label: 'Griffheizung', group: 'comfort', icon: 'flame' },
    { key: 'cruise-control', label: 'Tempomat', group: 'comfort', icon: 'gauge' },
  ];
  const withGrips = makeGeneration({
    extras: [{ key: 'heated-grips', availability: 'standard' }],
  });
  const withOptionalGrips = makeGeneration({
    extras: [{ key: 'heated-grips', availability: 'optional' }],
  });
  const without = makeGeneration({ extras: undefined });

  it('zeigt ein Extra, sobald ein Bike es hat – die anderen mit null', () => {
    const rows = buildExtraRows([withGrips, without], features);
    expect(rows.map((row) => row.feature.key)).toEqual(['heated-grips']);
    expect(rows[0]?.availability).toEqual(['standard', null]);
    expect(rows[0]?.different).toBe(true);
  });

  it('ohne Extras bei allen Bikes: keine Zeilen (Abschnitt entfällt)', () => {
    expect(buildExtraRows([without, without], features)).toEqual([]);
  });

  it('«Nur Unterschiede»: gleiche Verfügbarkeit fällt weg, Serie vs. optional bleibt', () => {
    expect(buildExtraRows([withGrips, withGrips], features, { onlyDifferences: true })).toEqual([]);
    expect(
      buildExtraRows([withGrips, withOptionalGrips], features, { onlyDifferences: true }),
    ).toHaveLength(1);
  });
});

describe('gerundete Anzeige', () => {
  const withRange = (tankL: number, consumptionL100km: number) =>
    makeGeneration({ chassis: { ...makeGeneration().chassis, tankL, consumptionL100km } });
  const a = withRange(14, 4.1); // 341 km → «ca. 340 km»
  const b = withRange(15, 4.4); // 341 km → «ca. 340 km»
  const c = withRange(14, 4.9); // 286 km → «ca. 290 km»

  it('gerundet gleiche Werte sind beide Bestwert, der Chip passt zu den Zahlen', () => {
    const [row] = buildCompareRows([SPECS.range], [a, b, c]);
    if (!row) throw new Error('Zeile fehlt');
    expect(row.best).toEqual(new Set([0, 1]));
    expect(deltaToBest(row, 1)).toBeUndefined();
    // 290 − 340, nicht 286 − 341 (das ergäbe «−60 km»)
    expect(plain(deltaToBest(row, 2))).toBe('−50 km');
  });

  it('sehen alle Werte gleich aus, gibt es keinen Bestwert', () => {
    const [row] = buildCompareRows([SPECS.range], [a, b]);
    expect(row?.best).toEqual(new Set());
  });

  it('ein einzelner Wert bekommt keinen Balken', () => {
    const withTopSpeed = makeGeneration({
      performance: { topSpeedKmh: { value: 190, kind: 'official' } },
    });
    const [row] = buildCompareRows([SPECS.topSpeed], [withTopSpeed, makeGeneration()]);
    if (!row) throw new Error('Zeile fehlt');
    expect(barFraction(row, 0)).toBeUndefined();
  });
});
