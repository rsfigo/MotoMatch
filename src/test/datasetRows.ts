/**
 * Testhilfen: der echte Datenbestand – als geprüftes Domain-Modell und so, wie ihn
 * Supabase in eingebetteten Abfragen zurückgeben würde.
 */
import featuresJson from '@/data/features.json';
import manufacturersJson from '@/data/manufacturers.json';
import type { DatasetRows, ModelWithRelations } from '@/data/db/rows';
import { validateDataset, type ValidDataset } from '@/data/validateDataset';

const modelFiles = import.meta.glob<unknown>('/src/data/models/*.json', {
  eager: true,
  import: 'default',
});

export function loadDataset(): ValidDataset {
  const { data, errors } = validateDataset({
    manufacturers: manufacturersJson,
    features: featuresJson,
    models: Object.fromEntries(
      Object.entries(modelFiles).map(([path, json]) => [path.split('/').pop() ?? path, json]),
    ),
  });
  if (!data) throw new Error(errors.join('\n'));
  return data;
}

/** Baut aus den flachen Tabellenzeilen die Antwort einer eingebetteten Abfrage. */
export function embedRows(
  rows: DatasetRows,
  { withSources }: { withSources: boolean },
): ModelWithRelations[] {
  return rows.models.map((model) => ({
    ...model,
    generations: rows.generations
      .filter((generation) => generation.model_id === model.id)
      .map((generation) => ({
        ...generation,
        generation_features: rows.generation_features
          .filter((extra) => extra.generation_id === generation.id)
          .map(({ generation_id, ...extra }) => extra),
        ...(withSources && {
          generation_sources: rows.generation_sources
            .filter((source) => source.generation_id === generation.id)
            .map(({ generation_id, ...source }) => source),
        }),
      })),
  }));
}
