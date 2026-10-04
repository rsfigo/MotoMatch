import { describe, expect, it } from 'vitest';
import { kwToPs, powerToWeight, rangeKm } from './units';

describe('kwToPs', () => {
  it('rechnet mit 1 PS = 0.7355 kW', () => {
    expect(kwToPs(0.7355)).toBeCloseTo(1, 10);
    expect(kwToPs(70)).toBeCloseTo(95.17, 2);
    expect(kwToPs(35)).toBeCloseTo(47.59, 2);
    expect(kwToPs(11)).toBeCloseTo(14.96, 2);
  });
});

describe('powerToWeight', () => {
  it('liefert kW pro kg', () => {
    expect(powerToWeight(35, 175)).toBeCloseTo(0.2, 10);
    expect(powerToWeight(54, 184)).toBeCloseTo(0.2935, 4);
  });
});

describe('rangeKm', () => {
  it('berechnet die Reichweite aus Tank und Verbrauch', () => {
    expect(rangeKm(14, 4)).toBe(350);
    expect(rangeKm(14, 4.3)).toBeCloseTo(325.58, 2);
  });
});
