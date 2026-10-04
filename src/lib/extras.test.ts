import { describe, expect, it } from 'vitest';
import type { Feature } from '@/data/schema';
import { extraAvailability, groupExtras, unionExtras } from './extras';

const features: Feature[] = [
  { key: 'heated-grips', label: 'Griffheizung', group: 'comfort', icon: 'flame' },
  { key: 'cruise-control', label: 'Tempomat', group: 'comfort', icon: 'gauge' },
  { key: 'cornering-abs', label: 'Kurven-ABS', group: 'safety', icon: 'shield-check' },
  { key: 'tft-display', label: 'TFT-Display', group: 'electronics', icon: 'tablet' },
];

describe('groupExtras (Detailseite)', () => {
  it('gruppiert nach Komfort, Sicherheit, … in der Reihenfolge des Katalogs', () => {
    const groups = groupExtras(
      [
        { key: 'tft-display', availability: 'standard' },
        { key: 'cruise-control', availability: 'optional', detail: 'Nur Y-AMT' },
        { key: 'heated-grips', availability: 'standard' },
      ],
      features,
    );
    expect(groups.map((group) => group.group)).toEqual(['comfort', 'electronics']);
    expect(groups[0]?.items.map((item) => item.feature.key)).toEqual([
      'heated-grips',
      'cruise-control',
    ]);
    expect(groups[0]?.items[1]).toMatchObject({ availability: 'optional', detail: 'Nur Y-AMT' });
  });

  it('liefert eine leere Liste ohne Extras – der Abschnitt verschwindet', () => {
    expect(groupExtras(undefined, features)).toEqual([]);
    expect(groupExtras([], features)).toEqual([]);
  });
});

describe('unionExtras (Vergleich)', () => {
  it('vereint die Extras aller Bikes ohne Duplikate', () => {
    const union = unionExtras(
      [
        [{ key: 'tft-display', availability: 'standard' }],
        [
          { key: 'heated-grips', availability: 'optional' },
          { key: 'tft-display', availability: 'standard' },
        ],
        undefined,
      ],
      features,
    );
    expect(union.map((feature) => feature.key)).toEqual(['heated-grips', 'tft-display']);
  });

  it('ist leer, wenn keines der Bikes Extras hat', () => {
    expect(unionExtras([undefined, []], features)).toEqual([]);
  });

  it('meldet pro Bike Serie, Optional oder nichts', () => {
    const extras = [{ key: 'tft-display', availability: 'optional' as const }];
    expect(extraAvailability(extras, 'tft-display')).toBe('optional');
    expect(extraAvailability(extras, 'heated-grips')).toBeNull();
    expect(extraAvailability(undefined, 'heated-grips')).toBeNull();
  });
});
