/**
 * Hooks für den Datenzugriff in Komponenten.
 *
 * Heute geben sie die mitgebündelten Daten direkt zurück. Kommt später eine API dazu,
 * werden nur diese Hooks angepasst (z. B. mit React `use()` und Suspense) – die Seiten
 * stecken schon in Suspense-Grenzen mit Skeletons und müssen sich nicht ändern.
 */
import type { Feature, Manufacturer, Model } from '@/data/schema';
import { getAllModels, getFeatures, getManufacturers, getModel } from '@/lib/data';

export function useModels(): readonly Model[] {
  return getAllModels();
}

export function useModel(id: string | undefined): Model | undefined {
  return id ? getModel(id) : undefined;
}

export function useManufacturers(): readonly Manufacturer[] {
  return getManufacturers();
}

export function useFeatures(): readonly Feature[] {
  return getFeatures();
}
