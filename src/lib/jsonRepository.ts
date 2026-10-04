/**
 * Datenquelle «JSON»: die Dateien in src/data, beim Build mitgebündelt.
 * Geprüft werden sie vorher mit Zod (npm run validate:data und die Tests) – deshalb reicht
 * hier eine Typ-Zusicherung, und Zod muss nicht in den Browser.
 */
import featuresJson from '@/data/features.json';
import manufacturersJson from '@/data/manufacturers.json';
import type { Feature, Manufacturer, Model } from '@/data/schema';
import type { BikeRepository } from './repository';

// Alle Dateien in src/data/models werden automatisch eingelesen.
const modelFiles = import.meta.glob<Model>('/src/data/models/*.json', {
  eager: true,
  import: 'default',
});
const models = Object.values(modelFiles);

export const jsonRepository: BikeRepository = {
  listModels: () => Promise.resolve(models),
  getModel: (id) => Promise.resolve(models.find((model) => model.id === id) ?? null),
  listManufacturers: () => Promise.resolve(manufacturersJson as Manufacturer[]),
  listFeatures: () => Promise.resolve(featuresJson as Feature[]),
};
