/**
 * npm run check:rls
 *
 * Prüft mit dem öffentlichen Schlüssel – genau dem, der im Browser steckt –, dass man
 * alle Tabellen lesen, aber nichts schreiben kann. Jeder Schreibversuch muss mit
 * «permission denied» (PostgreSQL-Code 42501) scheitern. Scheitert er nicht oder aus einem
 * anderen Grund, endet das Skript mit Exit-Code 1.
 *
 * Die Versuche sind harmlos: Sie zielen auf einen Schlüssel, den es nicht gibt
 * («zz-rls-check»), und die Probezeilen sind absichtlich unvollständig. Selbst bei falsch
 * gesetzten Rechten würde nichts geschrieben – die Prüfung schlüge trotzdem Alarm.
 */
import { createDataApiClient } from '../src/data/db/client.ts';
import { isSecretKey } from '../src/data/db/keys.ts';
import { loadLocalEnv, requireEnv } from './lib/env.ts';

const PROBE = 'zz-rls-check';
const PERMISSION_DENIED = '42501';

/** Pro Tabelle die Schlüsselspalte: Sie dient als Filter und als Probezeile. */
const TABLES = [
  { name: 'manufacturers', key: 'id' },
  { name: 'features', key: 'key' },
  { name: 'models', key: 'id' },
  { name: 'generations', key: 'id' },
  { name: 'generation_features', key: 'generation_id' },
  { name: 'generation_sources', key: 'generation_id' },
];

loadLocalEnv();
const url = requireEnv('VITE_SUPABASE_URL');
const publicKey = requireEnv('VITE_SUPABASE_PUBLISHABLE_KEY');
if (isSecretKey(publicKey)) {
  console.error(
    '✖ VITE_SUPABASE_PUBLISHABLE_KEY enthält den GEHEIMEN Schlüssel. Er gehört nie in eine ' +
      'VITE_-Variable, denn diese landen im Browser. Ersetze ihn durch den öffentlichen ' +
      'Schlüssel und erzeuge den geheimen im Supabase-Dashboard neu.',
  );
  process.exit(1);
}

const client = createDataApiClient(url, publicKey);
let failures = 0;

function report(table: string, action: string, ok: boolean, detail: string) {
  if (!ok) failures += 1;
  console.log(`  ${ok ? '✔' : '✖'} ${table.padEnd(20)} ${action.padEnd(9)} ${detail}`);
}

function expectDenied(
  table: string,
  action: string,
  error: { code?: string; message: string } | null,
) {
  if (!error) {
    report(table, action, false, 'kein Fehler – das Schreibrecht ist nicht entzogen!');
  } else if (error.code === PERMISSION_DENIED) {
    report(table, action, true, 'gesperrt');
  } else {
    report(table, action, false, `unerwartet (${error.code || 'ohne Code'}): ${error.message}`);
  }
}

console.log('Row Level Security mit dem öffentlichen Schlüssel prüfen\n');
for (const { name, key } of TABLES) {
  const probe: Record<string, unknown> = { [key]: PROBE };

  const read = await client.from(name).select('*').limit(1);
  report(name, 'lesen', !read.error, read.error ? `Fehler: ${read.error.message}` : 'erlaubt');

  const inserted = await client.from(name).insert(probe);
  expectDenied(name, 'einfügen', inserted.error);

  const updated = await client.from(name).update(probe).eq(key, PROBE);
  expectDenied(name, 'ändern', updated.error);

  const deleted = await client.from(name).delete().eq(key, PROBE);
  expectDenied(name, 'löschen', deleted.error);
}

// exitCode statt process.exit(): Nach fetch() stürzt Node unter Windows sonst beim Beenden ab
if (failures > 0) {
  console.error(`\n✖ ${failures} Prüfung(en) fehlgeschlagen. Migration und Policies prüfen.`);
  process.exitCode = 1;
} else {
  console.log('\n✔ Lesen erlaubt, Schreiben überall gesperrt.');
}
