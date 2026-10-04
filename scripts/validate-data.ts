/**
 * npm run validate:data
 *
 * Liest alle JSON-Dateien aus src/data und prüft sie mit den Zod-Schemas.
 * Bei Fehlern endet das Skript mit Exit-Code 1 (z. B. für CI).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateDataset } from '../src/data/validateDataset.ts';

const dataDir = join(import.meta.dirname, '..', 'src', 'data');
const modelsDir = join(dataDir, 'models');

if (!existsSync(modelsDir)) {
  console.error(`✖ Ordner ${modelsDir} fehlt – dort liegt pro Modell eine JSON-Datei.`);
  process.exit(1);
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as unknown;
  } catch (error) {
    console.error(`✖ ${path} ist kein gültiges JSON:\n  ${String(error)}`);
    process.exit(1);
  }
}

const models: Record<string, unknown> = {};
for (const file of readdirSync(modelsDir).filter((name) => name.endsWith('.json'))) {
  models[file] = readJson(join(modelsDir, file));
}

const { errors, data } = validateDataset({
  manufacturers: readJson(join(dataDir, 'manufacturers.json')),
  features: readJson(join(dataDir, 'features.json')),
  models,
});

if (errors.length > 0 || !data) {
  console.error(`✖ ${errors.length} Fehler in den Daten:\n`);
  for (const error of errors) console.error(`- ${error}\n`);
  process.exit(1);
}

const generations = data.models.flatMap((model) => model.generations);
const unverified = generations.filter(
  (generation) => generation.dataStatus === 'needsVerification',
);

console.log('✔ Alle Daten sind gültig.');
console.log(
  `  ${data.models.length} Modelle, ${generations.length} Generationen, ` +
    `${data.manufacturers.length} Hersteller, ${data.features.length} Extras`,
);
if (unverified.length > 0) {
  console.log(`  ⚠ ${unverified.length} Generation(en) mit dataStatus "needsVerification":`);
  for (const generation of unverified) console.log(`    - ${generation.id}`);
}
