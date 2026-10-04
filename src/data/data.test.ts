/**
 * Prüft den echten Datenbestand (src/data) – zusätzlich zu `npm run validate:data`,
 * damit auch `npm test` bei fehlerhaften Daten fehlschlägt.
 */
import { describe, expect, it } from 'vitest';
import { getLicenceInfo } from '@/lib/licence';
import { POPULAR_COMPARISONS } from '@/lib/popularComparisons';
import featuresJson from './features.json';
import manufacturersJson from './manufacturers.json';
import { validateDataset } from './validateDataset';

const modelFiles = import.meta.glob<unknown>('./models/*.json', { eager: true, import: 'default' });
const models = Object.fromEntries(
  Object.entries(modelFiles).map(([path, data]) => [path.replace('./models/', ''), data]),
);

const result = validateDataset({
  manufacturers: manufacturersJson,
  features: featuresJson,
  models,
});

describe('Datenbestand', () => {
  it('ist gültig (Schema und Querbezüge)', () => {
    expect(result.errors).toEqual([]);
  });

  it('deckt alle Führerausweis-Kategorien ab', () => {
    const categories = new Set(
      (result.data?.models ?? []).map((model) => {
        const generation = model.generations.at(-1);
        if (!generation) return null;
        return getLicenceInfo({
          displacementCc: generation.engine.displacementCc,
          powerKw: generation.engine.powerKw,
          weightKg: generation.chassis.weightKg,
          throttle: generation.throttle,
        }).required;
      }),
    );
    expect(categories).toEqual(new Set(['A1', 'A_LIMITED', 'A']));
  });

  it('enthält Modelle mit mehreren Generationen (für den Generationen-Umschalter)', () => {
    const multiGeneration = (result.data?.models ?? []).filter(
      (model) => model.generations.length > 1,
    );
    expect(multiGeneration.length).toBeGreaterThanOrEqual(2);
  });

  it('«Beliebte Vergleiche» verweisen nur auf vorhandene Modelle', () => {
    const ids = new Set((result.data?.models ?? []).map((model) => model.id));
    for (const comparison of POPULAR_COMPARISONS) {
      for (const bike of comparison.bikes) expect(ids.has(bike)).toBe(true);
    }
  });

  it('enthält Bikes mit und ohne YouTube-Review (für die bedingte Anzeige)', () => {
    const latest = (result.data?.models ?? []).map((model) => model.generations.at(-1));
    expect(latest.some((generation) => generation?.youtubeReviewUrl)).toBe(true);
    expect(latest.some((generation) => !generation?.youtubeReviewUrl)).toBe(true);
  });
});
