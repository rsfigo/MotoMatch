/**
 * npm run seed              schreibt alle Bikes aus den JSON-Dateien nach Supabase
 * npm run seed -- --dry-run prüft nur und zeigt, was geschrieben würde (ohne Verbindung)
 *
 * - Prüft die Daten zuerst mit Zod (wie npm run validate:data) und bricht bei Fehlern ab.
 * - Schreibt per Upsert: beliebig oft ausführbar, bestehende Zeilen werden aktualisiert.
 * - Löscht nie etwas. Zeilen, die in der Datenbank stehen, aber nicht mehr im JSON,
 *   werden nur gemeldet (entfernen bei Bedarf im Supabase-Tabelleneditor).
 * - Braucht den geheimen Schlüssel (SUPABASE_SECRET_KEY) – nur lokal aus .env.local,
 *   nie mit VITE_-Präfix, nie ins Repository, nie in den Chat.
 */
import { createDataApiClient } from '../src/data/db/client.ts';
import { isSecretKey } from '../src/data/db/keys.ts';
import { datasetToRows } from '../src/data/db/mapping.ts';
import type { DatasetRows } from '../src/data/db/rows.ts';
import { validateDataset } from '../src/data/validateDataset.ts';
import { readRawDataset } from './lib/dataset.ts';
import { loadLocalEnv, requireEnv } from './lib/env.ts';

/** Tabellen in der Reihenfolge der Fremdschlüssel, mit ihren Primärschlüsseln. */
const TABLES: { name: keyof DatasetRows; key: string[] }[] = [
  { name: 'manufacturers', key: ['id'] },
  { name: 'features', key: ['key'] },
  { name: 'models', key: ['id'] },
  { name: 'generations', key: ['id'] },
  { name: 'generation_features', key: ['generation_id', 'feature_key'] },
  { name: 'generation_sources', key: ['generation_id', 'position'] },
];

/** Supabase liefert pro Anfrage höchstens so viele Zeilen («Max rows»). */
const PAGE_SIZE = 1000;

type Row = Record<string, unknown>;

const dryRun = process.argv.includes('--dry-run');

const { errors, data } = validateDataset(readRawDataset());
if (errors.length > 0 || !data) {
  console.error(`✖ ${errors.length} Fehler in den Daten – es wird nichts geschrieben:\n`);
  for (const error of errors) console.error(`- ${error}\n`);
  process.exit(1);
}

const rows = datasetToRows(data) as unknown as Record<keyof DatasetRows, Row[]>;
console.log(dryRun ? 'Trockenlauf – es wird nichts geschrieben.\n' : 'Seed nach Supabase\n');
for (const table of TABLES) {
  console.log(`  ${table.name.padEnd(20)} ${String(rows[table.name].length).padStart(4)} Zeilen`);
}

if (dryRun) {
  console.log('\n✔ Daten gültig. Ohne --dry-run werden diese Zeilen per Upsert geschrieben.');
  process.exit(0);
}

loadLocalEnv();
const url = requireEnv('VITE_SUPABASE_URL');
const secretKey = requireEnv('SUPABASE_SECRET_KEY');
if (!isSecretKey(secretKey)) {
  console.error(
    '✖ SUPABASE_SECRET_KEY ist kein geheimer Schlüssel (erwartet: sb_secret_… oder den alten ' +
      'service_role-Schlüssel). Mit dem öffentlichen Schlüssel ist Schreiben gesperrt.',
  );
  process.exit(1);
}

const client = createDataApiClient(url, secretKey);

/** Schreibt alle Tabellen in der Reihenfolge der Fremdschlüssel; stoppt beim ersten Fehler. */
async function upsertAll(): Promise<boolean> {
  for (const table of TABLES) {
    const tableRows = rows[table.name];
    const { error } = await client
      .from(table.name)
      .upsert(tableRows, { onConflict: table.key.join(',') });
    if (error) {
      console.error(`✖ ${table.name}: ${error.message}`);
      return false;
    }
    console.log(`✔ ${table.name}: ${tableRows.length} Zeilen geschrieben`);
  }
  return true;
}

/** Liest die Schlüssel aller Zeilen einer Tabelle (seitenweise). */
async function existingKeys(table: string, columns: string[]): Promise<string[]> {
  const keys: string[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data: page, error } = await client
      .from(table)
      .select(columns.join(','))
      .order(columns[0] ?? '')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const pageRows = page as unknown as Row[];
    keys.push(...pageRows.map((row) => rowKey(row, columns)));
    if (pageRows.length < PAGE_SIZE) return keys;
  }
}

function rowKey(row: Row, columns: string[]): string {
  return columns.map((column) => String(row[column])).join(' / ');
}

/** Meldet Zeilen, die nur in der Datenbank stehen – das Skript löscht nie etwas. */
async function reportOrphans(): Promise<void> {
  let orphans = 0;
  for (const table of TABLES) {
    try {
      const expected = new Set(rows[table.name].map((row) => rowKey(row, table.key)));
      const extra = (await existingKeys(table.name, table.key)).filter((key) => !expected.has(key));
      if (extra.length > 0) {
        orphans += extra.length;
        console.log(`⚠ ${table.name}: ${extra.length} Zeile(n) nur in der Datenbank:`);
        for (const key of extra) console.log(`    - ${key}`);
      }
    } catch (error) {
      console.log(`⚠ ${table.name}: Abgleich nicht möglich (${String(error)})`);
    }
  }
  console.log(
    orphans === 0
      ? '✔ Datenbank und JSON-Dateien stimmen überein.'
      : `⚠ ${orphans} Zeile(n) stehen nur in der Datenbank. Sie wurden nicht gelöscht.`,
  );
}

// exitCode statt process.exit(): Nach fetch() stürzt Node unter Windows sonst beim Beenden ab
console.log('');
if (await upsertAll()) {
  console.log('');
  await reportOrphans();
} else {
  process.exitCode = 1;
}
