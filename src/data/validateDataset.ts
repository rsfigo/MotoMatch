/**
 * Prüft den ganzen Datenbestand: zuerst jede Datei einzeln mit Zod, danach die
 * Beziehungen zwischen den Dateien (Hersteller vorhanden? Extras bekannt? …).
 *
 * Wird von `npm run validate:data` und von den Tests verwendet.
 * Nur `zod` und relative Importe mit .ts-Endung, damit es auch direkt in Node läuft.
 */
import { z } from 'zod';
import {
  featureSchema,
  manufacturerSchema,
  modelSchema,
  type Feature,
  type Manufacturer,
  type Model,
} from './schema.ts';

export interface RawDataset {
  manufacturers: unknown;
  features: unknown;
  /** Dateiname → Inhalt, z. B. { "yamaha-mt-07.json": {...} } */
  models: Record<string, unknown>;
}

export interface ValidDataset {
  manufacturers: Manufacturer[];
  features: Feature[];
  models: Model[];
}

export interface ValidationResult {
  errors: string[];
  /** Nur gesetzt, wenn alle Dateien dem Schema entsprechen. */
  data: ValidDataset | null;
}

function zodErrors(file: string, error: z.ZodError): string[] {
  return [`${file}:\n${z.prettifyError(error)}`];
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

/** Prüft die Regeln zwischen Dateien. Gibt eine Liste verständlicher Fehlermeldungen zurück. */
export function checkRelations(data: ValidDataset, fileNames: string[] = []): string[] {
  const errors: string[] = [];
  const manufacturerIds = new Set(data.manufacturers.map((m) => m.id));
  const featureKeys = new Set(data.features.map((f) => f.key));

  for (const id of findDuplicates(data.manufacturers.map((m) => m.id))) {
    errors.push(`manufacturers.json: Hersteller-ID "${id}" kommt mehrfach vor`);
  }
  for (const key of findDuplicates(data.features.map((f) => f.key))) {
    errors.push(`features.json: Extra "${key}" kommt mehrfach vor`);
  }
  for (const id of findDuplicates(data.models.map((m) => m.id))) {
    errors.push(`Modell-ID "${id}" kommt mehrfach vor`);
  }
  for (const id of findDuplicates(data.models.flatMap((m) => m.generations.map((g) => g.id)))) {
    errors.push(`Generations-ID "${id}" kommt mehrfach vor`);
  }

  data.models.forEach((model, index) => {
    const file = fileNames[index] ?? model.id;

    if (fileNames[index] && fileNames[index] !== `${model.id}.json`) {
      errors.push(`${file}: Dateiname muss "${model.id}.json" heissen (wie die Modell-ID)`);
    }
    if (!manufacturerIds.has(model.manufacturerId)) {
      errors.push(`${file}: Hersteller "${model.manufacturerId}" fehlt in manufacturers.json`);
    }
    if (!model.id.startsWith(`${model.manufacturerId}-`)) {
      errors.push(`${file}: Modell-ID sollte mit "${model.manufacturerId}-" beginnen`);
    }

    model.generations.forEach((generation, genIndex) => {
      const where = `${file} → ${generation.id}`;
      const expectedId = `${model.id}-${generation.yearFrom}`;
      if (generation.id !== expectedId) {
        errors.push(`${where}: Generations-ID muss "${expectedId}" lauten`);
      }

      const extraKeys = (generation.extras ?? []).map((extra) => extra.key);
      for (const key of extraKeys) {
        if (!featureKeys.has(key)) errors.push(`${where}: Extra "${key}" fehlt in features.json`);
      }
      for (const key of findDuplicates(extraKeys)) {
        errors.push(`${where}: Extra "${key}" ist doppelt eingetragen`);
      }

      const next = model.generations[genIndex + 1];
      if (next) {
        if (generation.yearTo === null) {
          errors.push(`${where}: Nur die neueste Generation darf yearTo = null haben`);
        } else if (next.yearFrom <= generation.yearTo) {
          errors.push(
            `${where}: Baujahre überschneiden sich mit ${next.id} (chronologisch sortieren)`,
          );
        }
      }
    });
  });

  return errors;
}

/** Validiert alle Rohdaten. Ohne Fehler enthält das Ergebnis die typisierten Daten. */
export function validateDataset(raw: RawDataset): ValidationResult {
  const errors: string[] = [];

  const manufacturers = z.array(manufacturerSchema).safeParse(raw.manufacturers);
  if (!manufacturers.success) errors.push(...zodErrors('manufacturers.json', manufacturers.error));

  const features = z.array(featureSchema).safeParse(raw.features);
  if (!features.success) errors.push(...zodErrors('features.json', features.error));

  const fileNames = Object.keys(raw.models).sort();
  const models: Model[] = [];
  for (const fileName of fileNames) {
    const parsed = modelSchema.safeParse(raw.models[fileName]);
    if (parsed.success) models.push(parsed.data);
    else errors.push(...zodErrors(fileName, parsed.error));
  }

  if (errors.length > 0 || !manufacturers.success || !features.success) {
    return { errors, data: null };
  }

  const data = { manufacturers: manufacturers.data, features: features.data, models };
  return { errors: checkRelations(data, fileNames), data };
}
