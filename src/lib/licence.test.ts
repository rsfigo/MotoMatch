import { describe, expect, it } from 'vitest';
import { canRide, getLicenceInfo, licenceWithThrottle, requiredLicence } from './licence';

describe('requiredLicence', () => {
  it('A1: bis 125 cm³ und bis 11 kW', () => {
    expect(requiredLicence({ displacementCc: 125, powerKw: 11, weightKg: 140 })).toBe('A1');
  });

  it('mehr als 125 cm³ ist nicht mehr A1', () => {
    expect(requiredLicence({ displacementCc: 126, powerKw: 11, weightKg: 140 })).toBe('A_LIMITED');
  });

  it('mehr als 11 kW ist nicht mehr A1', () => {
    expect(requiredLicence({ displacementCc: 125, powerKw: 11.1, weightKg: 140 })).toBe(
      'A_LIMITED',
    );
  });

  it('A1 verlangt höchstens 0.1 kW/kg', () => {
    // 11 kW bei 100 kg = 0.11 kW/kg
    expect(requiredLicence({ displacementCc: 125, powerKw: 11, weightKg: 100 })).toBe('A_LIMITED');
  });

  it('Grenzfall: genau 35 kW bei 175 kg (= 0.2 kW/kg) ist A beschränkt', () => {
    expect(requiredLicence({ displacementCc: 457, powerKw: 35, weightKg: 175 })).toBe('A_LIMITED');
  });

  it('35 kW bei 174 kg überschreitet 0.2 kW/kg → A', () => {
    expect(requiredLicence({ displacementCc: 457, powerKw: 35, weightKg: 174 })).toBe('A');
  });

  it('mehr als 35 kW → A, auch bei hohem Gewicht', () => {
    expect(requiredLicence({ displacementCc: 650, powerKw: 35.1, weightKg: 250 })).toBe('A');
  });

  it('starkes Bike → A', () => {
    expect(requiredLicence({ displacementCc: 1300, powerKw: 107, weightKg: 237 })).toBe('A');
  });
});

describe('licenceWithThrottle', () => {
  const base = { displacementCc: 689, powerKw: 54, weightKg: 184 };

  it('drosselbar auf 35 kW und schwer genug → A beschränkt möglich', () => {
    expect(
      licenceWithThrottle({ ...base, throttle: { available: true, throttledPowerKw: 35 } }),
    ).toBe('A_LIMITED');
  });

  it('ohne Drosselung → null', () => {
    expect(licenceWithThrottle({ ...base, throttle: { available: false } })).toBeNull();
    expect(licenceWithThrottle(base)).toBeNull();
  });

  it('drosselbar, aber gedrosselte Leistung unbekannt → null', () => {
    expect(licenceWithThrottle({ ...base, throttle: { available: true } })).toBeNull();
  });

  it('zu leicht: 35 kW bei 160 kg wären 0.219 kW/kg → null', () => {
    expect(
      licenceWithThrottle({
        ...base,
        weightKg: 160,
        throttle: { available: true, throttledPowerKw: 35 },
      }),
    ).toBeNull();
  });

  it('Serienleistung über 70 kW → keine Drosselung auf A beschränkt', () => {
    expect(
      licenceWithThrottle({
        displacementCc: 890,
        powerKw: 87.5,
        weightKg: 193,
        throttle: { available: true, throttledPowerKw: 35 },
      }),
    ).toBeNull();
  });

  it('Bike, das schon A beschränkt ist, braucht keine Drosselung → null', () => {
    expect(
      licenceWithThrottle({
        displacementCc: 399,
        powerKw: 33,
        weightKg: 170,
        throttle: { available: true, throttledPowerKw: 25 },
      }),
    ).toBeNull();
  });
});

describe('getLicenceInfo', () => {
  it('liefert Kategorie, Drosselungs-Kategorie und Leistungsgewicht', () => {
    const info = getLicenceInfo({
      displacementCc: 689,
      powerKw: 54,
      weightKg: 180,
      throttle: { available: true, throttledPowerKw: 35 },
    });
    expect(info.required).toBe('A');
    expect(info.withThrottle).toBe('A_LIMITED');
    expect(info.powerToWeightKwPerKg).toBeCloseTo(0.3, 5);
  });
});

describe('canRide', () => {
  const a1Bike = { displacementCc: 125, powerKw: 11, weightKg: 140 };
  const a35Bike = { displacementCc: 457, powerKw: 35, weightKg: 175 };
  const throttleableBike = {
    displacementCc: 689,
    powerKw: 54,
    weightKg: 184,
    throttle: { available: true, throttledPowerKw: 35 },
  };
  const bigBike = { displacementCc: 1300, powerKw: 107, weightKg: 237 };

  it('A darf alles fahren', () => {
    for (const bike of [a1Bike, a35Bike, throttleableBike, bigBike]) {
      expect(canRide('A', bike)).toBe(true);
    }
  });

  it('A beschränkt: A1- und A35-Bikes, drosselbare nur mit Schalter', () => {
    expect(canRide('A_LIMITED', a1Bike)).toBe(true);
    expect(canRide('A_LIMITED', a35Bike)).toBe(true);
    expect(canRide('A_LIMITED', throttleableBike)).toBe(false);
    expect(canRide('A_LIMITED', throttleableBike, { includeThrottled: true })).toBe(true);
    expect(canRide('A_LIMITED', bigBike, { includeThrottled: true })).toBe(false);
  });

  it('A1: nur A1-Bikes – Drosselung hilft nicht', () => {
    expect(canRide('A1', a1Bike)).toBe(true);
    expect(canRide('A1', a35Bike)).toBe(false);
    expect(canRide('A1', throttleableBike, { includeThrottled: true })).toBe(false);
  });
});
