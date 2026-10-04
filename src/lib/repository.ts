/**
 * Datenquelle hinter der App
 * --------------------------
 * Die App spricht nur mit diesem Interface. Es gibt zwei Umsetzungen:
 * - JsonRepository: die JSON-Dateien im Repo (Entwicklung, Tests, Standard)
 * - SupabaseRepository: die Supabase-Datenbank (VITE_DATA_SOURCE=supabase)
 *
 * Die Wahl fällt beim Build: Vite ersetzt import.meta.env durch feste Werte, und der
 * nicht gewählte Zweig samt seinem Code (z. B. supabase-js) landet nicht im Bundle.
 */
import type { Feature, Manufacturer, Model } from '@/data/schema';

export interface BikeRepository {
  /**
   * Alle Modelle mit allen Generationen – für Katalog, Vergleich und Match-Wizard.
   * Die Quellen dürfen fehlen (schlanke Listenabfrage); die Detailseite lädt sie mit getModel.
   */
  listModels(): Promise<Model[]>;
  /** Ein Modell vollständig, inklusive Quellen. null, wenn es das Modell nicht gibt. */
  getModel(id: string): Promise<Model | null>;
  listManufacturers(): Promise<Manufacturer[]>;
  /** Extras-Katalog in der Reihenfolge von features.json */
  listFeatures(): Promise<Feature[]>;
}

export type DataSource = 'json' | 'supabase';

export const DATA_SOURCE: DataSource =
  import.meta.env.VITE_DATA_SOURCE === 'supabase' ? 'supabase' : 'json';

let repository: Promise<BikeRepository> | undefined;

/** Die gewählte Datenquelle (wird beim ersten Aufruf geladen). */
export function getRepository(): Promise<BikeRepository> {
  if (!repository) {
    const loading: Promise<BikeRepository> =
      import.meta.env.VITE_DATA_SOURCE === 'supabase'
        ? import('./supabaseRepository').then((module) =>
            module.createSupabaseRepository({
              url: import.meta.env.VITE_SUPABASE_URL,
              key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            }),
          )
        : import('./jsonRepository').then((module) => module.jsonRepository);
    // Klappt das Laden nicht (z. B. Netzwerk), versucht es der nächste Aufruf erneut
    loading.catch(() => {
      if (repository === loading) repository = undefined;
    });
    repository = loading;
  }
  return repository;
}
