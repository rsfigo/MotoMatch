import { describe, expect, it } from 'vitest';
import type { Manufacturer } from '@/data/schema';
import { makeGeneration, makeModel } from '@/test/fixtures';
import {
  applyCatalogFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  normalizeSearch,
  parseFilters,
  serializeFilters,
  toCatalogEntry,
  type CatalogFilters,
} from './catalog';

const alpha: Manufacturer = { id: 'alpha', name: 'Alpha', country: 'CH' };
const beta: Manufacturer = { id: 'beta', name: 'Beta', country: 'IT' };

// Drei fiktive Bikes: ein A1-Bike, ein drosselbares Mittelklasse-Bike und ein starkes Bike
const entries = [
  toCatalogEntry(
    makeModel({
      id: 'alpha-ein-25',
      manufacturerId: 'alpha',
      name: 'Ein-25',
      generations: [
        makeGeneration({
          id: 'alpha-ein-25-2024',
          engine: {
            displacementCc: 125,
            cylinders: 1,
            layout: 'Einzylinder',
            cooling: 'liquid',
            powerKw: 11,
            torqueNm: 12,
          },
          chassis: { weightKg: 140, seatHeightMm: 800, tankL: 11, gears: 6, drive: 'chain' },
          throttle: { available: false },
          quickshifter: 'none',
          price: { chf: 5490, asOf: '2026-10-04' },
        }),
      ],
    }),
    alpha,
  ),
  toCatalogEntry(
    makeModel({
      id: 'alpha-mt-07',
      manufacturerId: 'alpha',
      name: 'MT-07',
      generations: [
        makeGeneration({ id: 'alpha-mt-07-2021', yearFrom: 2021, yearTo: 2024 }),
        makeGeneration({
          id: 'alpha-mt-07-2025',
          yearFrom: 2025,
          engine: {
            displacementCc: 689,
            cylinders: 2,
            layout: 'Reihen-Zweizylinder',
            cooling: 'liquid',
            powerKw: 54,
            torqueNm: 67,
          },
          chassis: { weightKg: 184, seatHeightMm: 805, tankL: 14, gears: 6, drive: 'chain' },
          throttle: { available: true, throttledPowerKw: 35 },
          quickshifter: 'optional',
          extras: [{ key: 'tft-display', availability: 'standard' }],
          price: { chf: 8990, asOf: '2026-10-04' },
        }),
      ],
    }),
    alpha,
  ),
  toCatalogEntry(
    makeModel({
      id: 'beta-grande',
      manufacturerId: 'beta',
      name: 'Grande',
      category: 'adventure',
      generations: [
        makeGeneration({
          id: 'beta-grande-2024',
          engine: {
            displacementCc: 1300,
            cylinders: 2,
            layout: 'Boxer-Zweizylinder',
            cooling: 'liquid',
            powerKw: 107,
            torqueNm: 149,
          },
          chassis: { weightKg: 237, seatHeightMm: 850, tankL: 19, gears: 6, drive: 'shaft' },
          throttle: { available: false },
          quickshifter: 'optional',
          blipper: 'optional',
          extras: [
            { key: 'tft-display', availability: 'standard' },
            { key: 'cruise-control', availability: 'standard' },
          ],
          price: { chf: 24900, asOf: '2026-10-04' },
        }),
      ],
    }),
    beta,
  ),
];

const ids = (filters: Partial<CatalogFilters>) =>
  applyCatalogFilters(entries, { ...DEFAULT_FILTERS, ...filters }).map((entry) => entry.model.id);

describe('toCatalogEntry', () => {
  it('nimmt die neueste Generation und zählt ältere', () => {
    const mt07 = entries[1];
    expect(mt07?.generation.id).toBe('alpha-mt-07-2025');
    expect(mt07?.olderGenerationCount).toBe(1);
    expect(mt07?.fullName).toBe('Alpha MT-07');
  });
});

describe('Suche', () => {
  it('normalisiert Gross-/Kleinschreibung, Akzente und Zeichen', () => {
    expect(normalizeSearch('MT-07 Café')).toBe('mt07cafe');
  });

  it('findet «mt07» und kombiniert mehrere Wörter', () => {
    expect(ids({ query: 'mt07' })).toEqual(['alpha-mt-07']);
    expect(ids({ query: 'alpha mt' })).toEqual(['alpha-mt-07']);
    expect(ids({ query: 'gibt es nicht' })).toEqual([]);
  });
});

describe('Filter', () => {
  it('Hersteller und Kategorie', () => {
    expect(ids({ manufacturers: ['beta'] })).toEqual(['beta-grande']);
    expect(ids({ categories: ['adventure'] })).toEqual(['beta-grande']);
  });

  it('Bereiche für Preis, Leistung (PS) und Hubraum', () => {
    expect(ids({ price: { max: 9000 } })).toEqual(['alpha-ein-25', 'alpha-mt-07']);
    expect(ids({ power: { min: 70 } })).toEqual(['alpha-mt-07', 'beta-grande']);
    expect(ids({ displacement: { min: 126, max: 1000 } })).toEqual(['alpha-mt-07']);
  });

  it('Ausstattung: drosselbar, Quickshifter, Blipper, Extras', () => {
    expect(ids({ throttleable: true })).toEqual(['alpha-mt-07']);
    expect(ids({ quickshifter: true })).toEqual(['alpha-mt-07', 'beta-grande']);
    expect(ids({ blipper: true })).toEqual(['beta-grande']);
    expect(ids({ extras: ['tft-display', 'cruise-control'] })).toEqual(['beta-grande']);
  });

  it('Führerausweis: was darf ich fahren?', () => {
    expect(ids({ licence: 'A1' })).toEqual(['alpha-ein-25']);
    expect(ids({ licence: 'A_LIMITED' })).toEqual(['alpha-ein-25']);
    expect(ids({ licence: 'A_LIMITED', includeThrottled: true })).toEqual([
      'alpha-ein-25',
      'alpha-mt-07',
    ]);
    expect(ids({ licence: 'A' })).toHaveLength(3);
  });

  it('zählt aktive Filter (ohne Suche und Sortierung)', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(countActiveFilters({ ...DEFAULT_FILTERS, query: 'x', sort: 'price-asc' })).toBe(0);
    expect(countActiveFilters({ ...DEFAULT_FILTERS, price: { max: 9000 }, blipper: true })).toBe(2);
  });
});

describe('Sortierung', () => {
  it('nach Preis, Leistung, Gewicht und Name', () => {
    expect(ids({ sort: 'price-desc' })).toEqual(['beta-grande', 'alpha-mt-07', 'alpha-ein-25']);
    expect(ids({ sort: 'power-asc' })).toEqual(['alpha-ein-25', 'alpha-mt-07', 'beta-grande']);
    expect(ids({ sort: 'weight-asc' })[0]).toBe('alpha-ein-25');
    expect(ids({ sort: 'name' })).toEqual(['alpha-ein-25', 'alpha-mt-07', 'beta-grande']);
  });
});

describe('Filter in der URL', () => {
  it('schreibt nur gesetzte Werte und liest sie verlustfrei zurück', () => {
    const filters: CatalogFilters = {
      ...DEFAULT_FILTERS,
      query: 'mt',
      sort: 'price-asc',
      manufacturers: ['alpha', 'beta'],
      categories: ['naked'],
      price: { max: 12000 },
      power: { min: 50, max: 100 },
      cylinders: [2, 3],
      quickshifter: true,
      extras: ['tft-display'],
      licence: 'A_LIMITED',
      includeThrottled: true,
    };
    const params = serializeFilters(filters);
    expect(params.toString()).toBe(
      'q=mt&sort=price-asc&marke=alpha%2Cbeta&kategorie=naked&preis=-12000&ps=50-100&zylinder=2%2C3&quickshifter=1&extras=tft-display&ausweis=a35&gedrosselt=1',
    );
    expect(parseFilters(params)).toEqual(filters);
  });

  it('Standardzustand ergibt eine leere URL', () => {
    expect(serializeFilters(DEFAULT_FILTERS).toString()).toBe('');
  });

  it('ignoriert ungültige Werte', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'sort=quatsch&kategorie=rakete,naked&zylinder=x,2&ausweis=b&preis=abc-9000',
      ),
    );
    expect(filters.sort).toBe('name');
    expect(filters.categories).toEqual(['naked']);
    expect(filters.cylinders).toEqual([2]);
    expect(filters.licence).toBeNull();
    expect(filters.price).toEqual({ max: 9000 });
  });
});
