/**
 * Liest die JSON-Daten für die Skripte (validate:data, seed).
 * Läuft direkt in Node (über tsx) – deshalb relative Importe mit .ts-Endung.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RawDataset } from '../../src/data/validateDataset.ts';

export const DATA_DIR = join(import.meta.dirname, '..', '..', 'src', 'data');
export const MODELS_DIR = join(DATA_DIR, 'models');

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as unknown;
  } catch (error) {
    console.error(`✖ ${path} ist kein gültiges JSON:\n  ${String(error)}`);
    process.exit(1);
  }
}

/** Liest alle Datendateien (noch ungeprüft – prüfen mit validateDataset). */
export function readRawDataset(): RawDataset {
  if (!existsSync(MODELS_DIR)) {
    console.error(`✖ Ordner ${MODELS_DIR} fehlt – dort liegt pro Modell eine JSON-Datei.`);
    process.exit(1);
  }
  const models: Record<string, unknown> = {};
  for (const file of readdirSync(MODELS_DIR).filter((name) => name.endsWith('.json'))) {
    models[file] = readJson(join(MODELS_DIR, file));
  }
  return {
    manufacturers: readJson(join(DATA_DIR, 'manufacturers.json')),
    features: readJson(join(DATA_DIR, 'features.json')),
    models,
  };
}
