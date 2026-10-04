/**
 * Zeilen der Supabase-Datenbank
 * -----------------------------
 * So sehen die Tabellen aus supabase/migrations aus (Spaltennamen in snake_case).
 * Werte wie Kategorie oder Verfügbarkeit stehen hier als string: Ob sie gültig sind,
 * prüfen nach dem Mapping die Zod-Schemas des Domain-Modells (schema.ts).
 *
 * Die Typen sind von Hand geschrieben. Sobald das Supabase-Projekt existiert, lassen
 * sie sich mit `supabase gen types typescript` aus der Datenbank erzeugen.
 */

export interface ManufacturerRow {
  id: string;
  name: string;
  country: string;
}

export interface FeatureRow {
  key: string;
  label: string;
  feature_group: string;
  icon: string;
  description: string | null;
  /** Reihenfolge wie in features.json */
  position: number;
}

export interface ModelRow {
  id: string;
  manufacturer_id: string;
  name: string;
  category: string;
  tagline: string | null;
}

export interface GenerationRow {
  id: string;
  model_id: string;
  year_from: number;
  year_to: number | null;
  changes: string[] | null;
  colors: string[] | null;
  displacement_cc: number;
  cylinders: number;
  engine_layout: string;
  cooling: string;
  power_kw: number;
  power_rpm: number | null;
  torque_nm: number;
  torque_rpm: number | null;
  top_speed_kmh: number | null;
  top_speed_kind: string | null;
  accel_0_100_s: number | null;
  accel_0_100_kind: string | null;
  weight_kg: number;
  weight_note: string | null;
  seat_height_mm: number;
  tank_l: number;
  consumption_l100km: number | null;
  gears: number;
  drive: string;
  throttle_available: boolean;
  throttled_power_kw: number | null;
  throttle_note: string | null;
  quickshifter: string;
  blipper: string;
  price_chf: number;
  price_as_of: string;
  price_note: string | null;
  score_tuning_visual: number;
  score_tuning_performance: number;
  score_sound: number;
  profile_beginner: number;
  profile_city: number;
  profile_touring: number;
  profile_sport: number;
  profile_offroad: number;
  tuning_note: string;
  sound_description: string;
  sound_audio_src: string | null;
  noise_db_a: number | null;
  youtube_review_url: string | null;
  image_hero: string | null;
  image_gallery: string[] | null;
  image_credit: string | null;
  data_status: string;
  last_checked: string;
}

export interface GenerationFeatureRow {
  generation_id: string;
  feature_key: string;
  availability: string;
  detail: string | null;
  /** Reihenfolge wie im JSON */
  position: number;
}

export interface GenerationSourceRow {
  generation_id: string;
  position: number;
  label: string;
  url: string;
}

/** Antwort der eingebetteten Abfragen (Generationen mit Extras und – auf der Detailseite – Quellen). */
export interface GenerationWithRelations extends GenerationRow {
  generation_features?: Omit<GenerationFeatureRow, 'generation_id'>[] | null;
  generation_sources?: Omit<GenerationSourceRow, 'generation_id'>[] | null;
}

export interface ModelWithRelations extends ModelRow {
  generations?: GenerationWithRelations[] | null;
}

/** Alle Zeilen, die das Seed-Skript schreibt – in der Reihenfolge der Fremdschlüssel. */
export interface DatasetRows {
  manufacturers: ManufacturerRow[];
  features: FeatureRow[];
  models: ModelRow[];
  generations: GenerationRow[];
  generation_features: GenerationFeatureRow[];
  generation_sources: GenerationSourceRow[];
}
