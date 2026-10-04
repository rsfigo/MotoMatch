import { describe, expect, it } from 'vitest';
import { makeGeneration } from '@/test/fixtures';
import { NBSP } from './format';
import { rangeOf, SPECS, visibleSpecs } from './specs';

const plain = (text: string | null) => text?.replaceAll(NBSP, ' ') ?? null;

describe('SPECS', () => {
  it('zeigt Schätzwerte mit «ca.» und nennt die Art der Quelle', () => {
    const generation = makeGeneration({
      performance: {
        topSpeedKmh: { value: 190, kind: 'estimate' },
        accel0to100s: { value: 3.9, kind: 'tested' },
      },
    });
    expect(plain(SPECS.topSpeed.display(generation))).toBe('ca. 190 km/h');
    expect(SPECS.topSpeed.kind?.(generation)).toBe('estimate');
    expect(plain(SPECS.accel.display(generation))).toBe('3.9 s');
  });

  it('fehlende Werte ergeben null (Anzeige «k. A.»)', () => {
    const generation = makeGeneration({ performance: {} });
    expect(SPECS.topSpeed.display(generation)).toBeNull();
    expect(SPECS.topSpeed.value(generation)).toBeUndefined();
  });

  it('Quickshifter: Serie > Optional > Nein', () => {
    expect(SPECS.quickshifter.display(makeGeneration({ quickshifter: 'standard' }))).toBe('Serie');
    expect(SPECS.quickshifter.value(makeGeneration({ quickshifter: 'standard' }))).toBeGreaterThan(
      SPECS.quickshifter.value(makeGeneration({ quickshifter: 'optional' })) ?? 0,
    );
  });

  it('Drosselung: «Ja, auf 35 kW» oder «Nein»', () => {
    expect(plain(SPECS.throttle.display(makeGeneration()))).toBe('Ja, auf 35 kW');
    expect(SPECS.throttle.display(makeGeneration({ throttle: { available: false } }))).toBe('Nein');
  });

  it('Preis ist tiefer besser, Leistung höher besser', () => {
    expect(SPECS.price.betterWhen).toBe('lower');
    expect(SPECS.power.betterWhen).toBe('higher');
    expect(SPECS.seatHeight.betterWhen).toBe('none');
  });
});

describe('visibleSpecs', () => {
  it('zeigt Kernfelder immer, optionale nur mit Wert', () => {
    const withoutConsumption = makeGeneration({
      chassis: { weightKg: 190, seatHeightMm: 800, tankL: 14, gears: 6, drive: 'chain' },
      performance: {},
    });
    const keys = visibleSpecs(['topSpeed', 'consumption', 'range', 'tank'], withoutConsumption).map(
      (spec) => spec.key,
    );
    expect(keys).toEqual(['topSpeed', 'tank']);
  });
});

describe('rangeOf', () => {
  it('berechnet die Reichweite nur mit bekanntem Verbrauch', () => {
    expect(
      rangeOf(
        makeGeneration({
          chassis: {
            weightKg: 190,
            seatHeightMm: 800,
            tankL: 14,
            consumptionL100km: 4,
            gears: 6,
            drive: 'chain',
          },
        }),
      ),
    ).toBe(350);
    expect(rangeOf(makeGeneration())).toBeUndefined();
  });
});
