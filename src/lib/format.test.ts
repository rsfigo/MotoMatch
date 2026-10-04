import { describe, expect, it } from 'vitest';
import {
  formatChf,
  formatCompact,
  formatConsumption,
  formatDate,
  formatKw,
  formatNumber,
  formatPower,
  formatPowerToWeight,
  formatRange,
  formatRpm,
  formatSigned,
  formatWeight,
  formatYearRange,
} from './format';

/** Ersetzt geschützte Leerzeichen durch normale – macht die Erwartungen lesbarer. */
const plain = (text: string) => text.replace(/\u00A0/g, ' ');

describe('formatNumber', () => {
  it('trennt Tausender mit Apostroph', () => {
    expect(formatNumber(990)).toBe('990');
    expect(formatNumber(8690)).toBe('8’690');
    expect(formatNumber(1234567)).toBe('1’234’567');
  });

  it('rundet auf die gewünschten Nachkommastellen (Dezimalpunkt)', () => {
    expect(formatNumber(1234.56, 1)).toBe('1’234.6');
    expect(formatNumber(4.3, 1)).toBe('4.3');
  });

  it('verwendet ein typografisches Minus, aber kein «−0»', () => {
    expect(formatNumber(-12)).toBe('−12');
    expect(formatNumber(-0.004, 2)).toBe('0.00');
  });
});

describe('formatCompact', () => {
  it('lässt überflüssige Nullen weg', () => {
    expect(formatCompact(70)).toBe('70');
    expect(formatCompact(50.2)).toBe('50.2');
    expect(formatCompact(50.25, 1)).toBe('50.3');
  });
});

describe('formatChf', () => {
  it('formatiert ganze Franken als «CHF 12’490.–»', () => {
    expect(plain(formatChf(12490))).toBe('CHF 12’490.–');
    expect(plain(formatChf(8690))).toBe('CHF 8’690.–');
  });

  it('zeigt Rappen mit zwei Stellen', () => {
    expect(plain(formatChf(12490.5))).toBe('CHF 12’490.50');
  });
});

describe('formatPower', () => {
  it('zeigt PS (berechnet) und kW', () => {
    expect(plain(formatPower(70))).toBe('95 PS (70 kW)');
    expect(plain(formatPower(54))).toBe('73 PS (54 kW)');
    expect(plain(formatPower(50.2))).toBe('68 PS (50.2 kW)');
  });

  it('kW mit höchstens einer Nachkommastelle', () => {
    expect(plain(formatKw(87.5))).toBe('87.5 kW');
  });
});

describe('weitere Einheiten', () => {
  it('Drehzahl, Verbrauch, Leistungsgewicht und Reichweite', () => {
    expect(plain(formatRpm(8750))).toBe('8’750 U/min');
    expect(plain(formatConsumption(4.3))).toBe('4.3 l/100 km');
    expect(plain(formatPowerToWeight(0.2))).toBe('0.200 kW/kg');
    expect(plain(formatRange(325.6))).toBe('ca. 330 km');
  });
});

describe('formatYearRange (Generationen-Anzeige)', () => {
  it('zeigt einen Zeitraum mit Halbgeviertstrich', () => {
    expect(formatYearRange(2022, 2024)).toBe('2022–2024');
  });

  it('zeigt «ab …» für aktuelle Generationen', () => {
    expect(plain(formatYearRange(2025, null))).toBe('ab 2025');
  });

  it('zeigt nur ein Jahr, wenn Anfang und Ende gleich sind', () => {
    expect(formatYearRange(2024, 2024)).toBe('2024');
  });
});

describe('formatDate', () => {
  it('wandelt ISO-Daten ins Schweizer Format', () => {
    expect(formatDate('2026-10-04')).toBe('4.10.2026');
  });
});

describe('formatSigned (Differenz-Chips)', () => {
  it('setzt Plus, typografisches Minus oder ±0', () => {
    expect(plain(formatSigned(20, formatWeight))).toBe('+20 kg');
    expect(plain(formatSigned(-5, formatWeight))).toBe('−5 kg');
    expect(plain(formatSigned(0, formatWeight))).toBe('±0 kg');
    expect(plain(formatSigned(-890, formatChf))).toBe('−CHF 890.–');
  });
});
