/**
 * Datenquelle «Supabase»: liest die Tabellen über die Supabase-API (PostgREST).
 *
 * - Eingebettete Abfragen: Modelle mit Generationen und Extras in einer Anfrage.
 * - Die Liste lädt keine Quellen (schlank), die Detailseite fragt ein Modell samt Quellen ab.
 * - Jede Antwort wird nach dem Mapping mit den Zod-Schemas aus schema.ts geprüft. Ein ungültiges
 *   Modell (z. B. im Tabelleneditor falsch erfasst) fehlt in der Liste, statt den ganzen Katalog
 *   lahmzulegen; die Konsole nennt den Fehler. Sind alle ungültig, gibt es eine Fehlermeldung.
 * - Zod und der Daten-API-Client stecken nur in diesem Modul, das nur im Supabase-Modus geladen
 *   wird.
 * - Nur der öffentliche Schlüssel (publishable bzw. anon); Schreiben verhindert Row Level Security.
 */
import { z } from 'zod';
import { createDataApiClient, MODEL_DETAIL_SELECT, MODEL_LIST_SELECT } from '@/data/db/client';
import { rowsToFeatures, rowToManufacturer, rowToModel } from '@/data/db/mapping';
import type { FeatureRow, ManufacturerRow, ModelWithRelations } from '@/data/db/rows';
import { featureSchema, manufacturerSchema, modelSchema, type Model } from '@/data/schema';
import type { BikeRepository } from './repository';

/**
 * Supabase liefert pro Abfrage standardmässig höchstens 1000 Zeilen (Data-API-Einstellung
 * «Max rows»). Der Katalog liegt weit darunter; wird die Grenze erreicht, warnen wir.
 */
export const ROW_LIMIT = 1000;

export interface SupabaseConfig {
  url: string | undefined;
  /** Öffentlicher Schlüssel (publishable bzw. anon) – nie der geheime Schlüssel */
  key: string | undefined;
  /** Nur für Tests: eigene fetch-Funktion */
  fetch?: typeof fetch;
}

/** Fehler beim Laden – die Meldung erscheint (in der Entwicklung) unter «Erneut versuchen». */
export class DataLoadError extends Error {
  override name = 'DataLoadError';
}

function validate<T>(schema: z.ZodType<T>, value: unknown, what: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new DataLoadError(
      `Ungültige Daten von Supabase (${what}):\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

function checkLimit(rows: readonly unknown[], table: string): void {
  if (rows.length >= ROW_LIMIT) {
    console.warn(
      `Supabase: ${table} hat das Zeilenlimit von ${ROW_LIMIT} erreicht – es fehlen evtl. Einträge.`,
    );
  }
}

export function createSupabaseRepository(config: SupabaseConfig): BikeRepository {
  if (!config.url || !config.key) {
    throw new DataLoadError(
      'Supabase ist nicht eingerichtet: VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY fehlen (siehe .env.example).',
    );
  }

  const client = createDataApiClient(config.url, config.key, config.fetch);

  async function select<T>(
    request: PromiseLike<{ data: unknown; error: { message: string } | null }>,
    what: string,
  ): Promise<T> {
    const { data, error } = await request;
    if (error)
      throw new DataLoadError(`Supabase-Abfrage fehlgeschlagen (${what}): ${error.message}`);
    return data as T;
  }

  return {
    async listModels() {
      const rows = await select<ModelWithRelations[]>(
        client.from('models').select(MODEL_LIST_SELECT).limit(ROW_LIMIT),
        'Modelle',
      );
      checkLimit(rows, 'models');
      const models: Model[] = [];
      for (const row of rows) {
        const result = modelSchema.safeParse(rowToModel(row));
        if (result.success) models.push(result.data);
        else
          console.error(`Supabase: Modell ${row.id} ist ungültig und wird ausgelassen:
${z.prettifyError(result.error)}`);
      }
      if (rows.length > 0 && models.length === 0) {
        throw new DataLoadError('Ungültige Daten von Supabase: Kein Modell entspricht dem Schema.');
      }
      return models;
    },

    async getModel(id) {
      const row = await select<ModelWithRelations | null>(
        client.from('models').select(MODEL_DETAIL_SELECT).eq('id', id).maybeSingle(),
        `Modell ${id}`,
      );
      return row ? validate(modelSchema, rowToModel(row), `Modell ${id}`) : null;
    },

    async listManufacturers() {
      const rows = await select<ManufacturerRow[]>(
        client.from('manufacturers').select('*').limit(ROW_LIMIT),
        'Hersteller',
      );
      checkLimit(rows, 'manufacturers');
      return rows.map((row) =>
        validate(manufacturerSchema, rowToManufacturer(row), `Hersteller ${row.id}`),
      );
    },

    async listFeatures() {
      const rows = await select<FeatureRow[]>(
        client.from('features').select('*').limit(ROW_LIMIT),
        'Extras',
      );
      checkLimit(rows, 'features');
      return rowsToFeatures(rows).map((feature) =>
        validate(featureSchema, feature, `Extra ${feature.key}`),
      );
    },
  };
}
