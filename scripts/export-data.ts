/**
 * npm run export:data              schreibt die Daten aus Supabase zurück in die JSON-Dateien
 * npm run export:data -- --dry-run zeigt nur, welche Dateien sich ändern würden
 *
 * Das Gegenstück zu npm run seed – für Bikes, die im Supabase-Tabelleneditor gepflegt werden.
 * So bleiben die JSON-Dateien in Git ein Backup mit Datenhistorie.
 * - Prüft alles mit Zod (wie validate:data). Bei Fehlern wird nichts geschrieben.
 * - Schreibt nur Dateien, deren Daten sich ändern (formatiert mit Prettier).
 * - Löscht nie eine Datei: Modelle, die nur noch im JSON stehen, werden gemeldet.
 * - Liest mit dem öffentlichen Schlüssel (Lesen ist für alle erlaubt), kein geheimer nötig.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { createDataApiClient, MODEL_DETAIL_SELECT } from '../src/data/db/client.ts';
import { rowsToFeatures, rowToManufacturer, rowToModel } from '../src/data/db/mapping.ts';
import type { FeatureRow, ManufacturerRow, ModelWithRelations } from '../src/data/db/rows.ts';
import { validateDataset } from '../src/data/validateDataset.ts';
import { DATA_DIR, MODELS_DIR } from './lib/dataset.ts';
import { loadLocalEnv, requireEnv } from './lib/env.ts';

/** Supabase liefert pro Anfrage höchstens so viele Zeilen («Max rows»). */
const ROW_LIMIT = 1000;

const dryRun = process.argv.includes('--dry-run');

loadLocalEnv();
const client = createDataApiClient(
  requireEnv('VITE_SUPABASE_URL'),
  requireEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
);

async function fetchTable<T>(table: string, select: string, order: string): Promise<T[]> {
  const { data, error } = await client.from(table).select(select).order(order).limit(ROW_LIMIT);
  if (error) throw new Error(`${table}: ${error.message}`);
  const rows = data as unknown as T[];
  if (rows.length >= ROW_LIMIT) {
    throw new Error(
      `${table}: Zeilenlimit von ${ROW_LIMIT} erreicht – der Export wäre unvollständig.`,
    );
  }
  return rows;
}

function sameData(json: string, value: unknown): boolean {
  try {
    return JSON.stringify(JSON.parse(json)) === JSON.stringify(value);
  } catch {
    return false;
  }
}

async function formatJson(path: string, value: unknown): Promise<string> {
  const options = await resolveConfig(path);
  return format(JSON.stringify(value), { ...options, filepath: path });
}

async function main(): Promise<number> {
  const [manufacturerRows, featureRows, modelRows] = await Promise.all([
    fetchTable<ManufacturerRow>('manufacturers', '*', 'id'),
    fetchTable<FeatureRow>('features', '*', 'position'),
    fetchTable<ModelWithRelations>('models', MODEL_DETAIL_SELECT, 'id'),
  ]);

  // Gleiche Prüfung wie validate:data; die Zod-Ausgabe hat die Feldreihenfolge der Dateien
  const { errors, data } = validateDataset({
    manufacturers: manufacturerRows
      .map(rowToManufacturer)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    features: rowsToFeatures(featureRows),
    models: Object.fromEntries(modelRows.map((row) => [`${row.id}.json`, rowToModel(row)])),
  });
  if (errors.length > 0 || !data) {
    console.error(
      `✖ ${errors.length} Fehler in den Daten von Supabase – es wird nichts geschrieben:\n`,
    );
    for (const error of errors) console.error(`- ${error}\n`);
    return 1;
  }

  const files = [
    { path: join(DATA_DIR, 'manufacturers.json'), value: data.manufacturers },
    { path: join(DATA_DIR, 'features.json'), value: data.features },
    ...data.models.map((model) => ({ path: join(MODELS_DIR, `${model.id}.json`), value: model })),
  ];

  const changed: string[] = [];
  const created: string[] = [];
  for (const file of files) {
    const exists = existsSync(file.path);
    // Inhaltlich vergleichen: Dateien mit gleichen Daten bleiben unberührt, auch wenn sie
    // anders formatiert sind
    if (exists && sameData(readFileSync(file.path, 'utf8'), file.value)) continue;
    (exists ? changed : created).push(relative(process.cwd(), file.path));
    if (!dryRun) writeFileSync(file.path, await formatJson(file.path, file.value));
  }

  const exported = new Set(data.models.map((model) => `${model.id}.json`));
  const onlyInJson = readdirSync(MODELS_DIR).filter(
    (name) => name.endsWith('.json') && !exported.has(name),
  );

  console.log(dryRun ? 'Trockenlauf – es wird nichts geschrieben.\n' : 'Export aus Supabase\n');
  console.log(
    `  ${data.models.length} Modelle, ${data.manufacturers.length} Hersteller, ` +
      `${data.features.length} Extras gelesen`,
  );
  const verb = dryRun ? 'würde' : 'wurde';
  for (const path of created) console.log(`  + ${path} (${verb} neu angelegt)`);
  for (const path of changed) console.log(`  ~ ${path} (${verb} aktualisiert)`);
  for (const name of onlyInJson) {
    console.log(`  ⚠ ${name} steht nur im JSON, nicht in Supabase (nicht gelöscht)`);
  }
  console.log(
    created.length + changed.length === 0
      ? '\n✔ Die JSON-Dateien entsprechen bereits der Datenbank.'
      : `\n✔ ${created.length + changed.length} Datei(en) ${dryRun ? 'betroffen' : 'geschrieben'}. ` +
          'Danach npm run validate:data und die Änderungen mit git diff prüfen.',
  );
  return 0;
}

// exitCode statt process.exit(): Nach fetch() stürzt Node unter Windows sonst beim Beenden ab
try {
  process.exitCode = await main();
} catch (error) {
  console.error(
    `✖ Export fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
