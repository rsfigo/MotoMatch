/**
 * Datenzugriff
 * ------------
 * Die dünne Schicht zwischen App und Datenquelle. Alle Funktionen geben ein Promise
 * zurück; dahinter steckt je nach VITE_DATA_SOURCE die JsonRepository (Dateien im Repo)
 * oder die SupabaseRepository (Datenbank), siehe repository.ts.
 *
 * Komponenten rufen diese Funktionen nicht direkt auf, sondern nutzen die Hooks in
 * src/hooks/useBikeData.ts (TanStack Query: Laden, Zwischenspeichern, Fehler).
 */
import type { Feature, Manufacturer, Model } from '@/data/schema';
import { getRepository } from './repository';

/** Alle Modelle mit allen Generationen (Quellen je nach Datenquelle nur auf der Detailseite). */
export async function getAllModels(): Promise<Model[]> {
  return (await getRepository()).listModels();
}

/** Ein Modell vollständig, inklusive Quellen. null, wenn es das Modell nicht gibt. */
export async function getModel(id: string): Promise<Model | null> {
  return (await getRepository()).getModel(id);
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  return (await getRepository()).listManufacturers();
}

/** Katalog aller möglichen Extras (Griffheizung, Tempomat, …). */
export async function getFeatures(): Promise<Feature[]> {
  return (await getRepository()).listFeatures();
}
