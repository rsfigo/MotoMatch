/**
 * npm run validate:data
 *
 * Liest alle JSON-Dateien aus src/data und prüft sie mit den Zod-Schemas.
 * Bei Fehlern endet das Skript mit Exit-Code 1 (z. B. für CI).
 */
import { validateDataset } from '../src/data/validateDataset.ts';
import { readRawDataset } from './lib/dataset.ts';

const { errors, data } = validateDataset(readRawDataset());

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
