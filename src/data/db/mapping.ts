/**
 * Mapping zwischen Domain-Modell (schema.ts) und Datenbankzeilen (rows.ts)
 * ------------------------------------------------------------------------
 * - toRows: für das Seed-Skript (JSON → Datenbank)
 * - fromRows: für die SupabaseRepository (Datenbank → App)
 *
 * Verschachtelte Felder werden zu Spalten, Estimated<T> zu Wert und Art, fehlende
 * optionale Werte zu NULL. Rückwärts fallen NULL-Werte wieder weg, damit die Objekte
 * genau so aussehen wie in den JSON-Dateien. Berechnete Werte (PS, Führerausweis …)
 * gibt es in der Datenbank nicht.
 *
 * Nur relative Importe mit .ts-Endung, damit das Seed-Skript es direkt in Node nutzt.
 */
import type { ValidDataset } from '../validateDataset.ts';
import type {
  Estimated,
  Extra,
  Feature,
  Generation,
  Manufacturer,
  Model,
  Source,
} from '../schema.ts';
import type {
  DatasetRows,
  FeatureRow,
  GenerationFeatureRow,
  GenerationRow,
  GenerationSourceRow,
  GenerationWithRelations,
  ManufacturerRow,
  ModelRow,
  ModelWithRelations,
} from './rows.ts';

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

/** undefined → NULL (für die Datenbank) */
const orNull = <T>(value: T | undefined): T | null => (value === undefined ? null : value);

/** Entfernt Felder ohne Wert, damit die Objekte wie im JSON aussehen. */
function withoutEmpty<T extends object>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== null && value !== undefined),
  ) as T;
}

function estimated(value: number | null, kind: string | null): Estimated | undefined {
  return value === null || kind === null ? undefined : ({ value, kind } as Estimated);
}

// ---------------------------------------------------------------------------
// Domain → Zeilen (Seed)
// ---------------------------------------------------------------------------

export function manufacturerToRow(manufacturer: Manufacturer): ManufacturerRow {
  return { id: manufacturer.id, name: manufacturer.name, country: manufacturer.country };
}

export function featureToRow(feature: Feature, position: number): FeatureRow {
  return {
    key: feature.key,
    label: feature.label,
    feature_group: feature.group,
    icon: feature.icon,
    description: orNull(feature.description),
    position,
  };
}

export function modelToRow(model: Model): ModelRow {
  return {
    id: model.id,
    manufacturer_id: model.manufacturerId,
    name: model.name,
    category: model.category,
    tagline: orNull(model.tagline),
  };
}

export function generationToRow(modelId: string, generation: Generation): GenerationRow {
  const { engine, performance, chassis, throttle, price, scores, sound, images } = generation;
  return {
    id: generation.id,
    model_id: modelId,
    year_from: generation.yearFrom,
    year_to: generation.yearTo,
    changes: orNull(generation.changes),
    colors: orNull(generation.colors),
    displacement_cc: engine.displacementCc,
    cylinders: engine.cylinders,
    engine_layout: engine.layout,
    cooling: engine.cooling,
    power_kw: engine.powerKw,
    power_rpm: orNull(engine.powerRpm),
    torque_nm: engine.torqueNm,
    torque_rpm: orNull(engine.torqueRpm),
    top_speed_kmh: orNull(performance.topSpeedKmh?.value),
    top_speed_kind: orNull(performance.topSpeedKmh?.kind),
    accel_0_100_s: orNull(performance.accel0to100s?.value),
    accel_0_100_kind: orNull(performance.accel0to100s?.kind),
    weight_kg: chassis.weightKg,
    weight_note: orNull(chassis.weightNote),
    seat_height_mm: chassis.seatHeightMm,
    tank_l: chassis.tankL,
    consumption_l100km: orNull(chassis.consumptionL100km),
    gears: chassis.gears,
    drive: chassis.drive,
    throttle_available: throttle.available,
    throttled_power_kw: orNull(throttle.throttledPowerKw),
    throttle_note: orNull(throttle.note),
    quickshifter: generation.quickshifter,
    blipper: generation.blipper,
    price_chf: price.chf,
    price_as_of: price.asOf,
    price_note: orNull(price.note),
    score_tuning_visual: scores.tuningVisual,
    score_tuning_performance: scores.tuningPerformance,
    score_sound: scores.sound,
    profile_beginner: scores.profile.beginner,
    profile_city: scores.profile.city,
    profile_touring: scores.profile.touring,
    profile_sport: scores.profile.sport,
    profile_offroad: scores.profile.offroad,
    tuning_note: generation.tuningNote,
    sound_description: sound.description,
    sound_audio_src: orNull(sound.audioSrc),
    noise_db_a: orNull(sound.noiseDbA),
    youtube_review_url: orNull(generation.youtubeReviewUrl),
    image_hero: orNull(images?.hero),
    image_gallery: orNull(images?.gallery),
    image_credit: orNull(images?.credit),
    data_status: generation.dataStatus,
    last_checked: generation.lastChecked,
  };
}

export function extrasToRows(generation: Generation): GenerationFeatureRow[] {
  return (generation.extras ?? []).map((extra, position) => ({
    generation_id: generation.id,
    feature_key: extra.key,
    availability: extra.availability,
    detail: orNull(extra.detail),
    position,
  }));
}

export function sourcesToRows(generation: Generation): GenerationSourceRow[] {
  return generation.sources.map((source, position) => ({
    generation_id: generation.id,
    position,
    label: source.label,
    url: source.url,
  }));
}

/** Der ganze, bereits geprüfte Datenbestand als Tabellenzeilen. */
export function datasetToRows(dataset: ValidDataset): DatasetRows {
  const generations = dataset.models.flatMap((model) =>
    model.generations.map((generation) => ({ modelId: model.id, generation })),
  );
  return {
    manufacturers: dataset.manufacturers.map(manufacturerToRow),
    features: dataset.features.map(featureToRow),
    models: dataset.models.map(modelToRow),
    generations: generations.map(({ modelId, generation }) => generationToRow(modelId, generation)),
    generation_features: generations.flatMap(({ generation }) => extrasToRows(generation)),
    generation_sources: generations.flatMap(({ generation }) => sourcesToRows(generation)),
  };
}

// ---------------------------------------------------------------------------
// Zeilen → Domain (App)
// ---------------------------------------------------------------------------

export function rowToManufacturer(row: ManufacturerRow): Manufacturer {
  return { id: row.id, name: row.name, country: row.country };
}

/** Extras-Katalog in der Reihenfolge von features.json (Spalte position). */
export function rowsToFeatures(rows: readonly FeatureRow[]): Feature[] {
  return [...rows]
    .sort((a, b) => a.position - b.position)
    .map(
      (row) =>
        withoutEmpty({
          key: row.key,
          label: row.label,
          group: row.feature_group,
          icon: row.icon,
          description: row.description,
        }) as Feature,
    );
}

function rowsToExtras(rows: GenerationWithRelations['generation_features']): Extra[] | undefined {
  if (!rows || rows.length === 0) return undefined;
  return [...rows]
    .sort((a, b) => a.position - b.position)
    .map(
      (row) =>
        withoutEmpty({
          key: row.feature_key,
          availability: row.availability,
          detail: row.detail,
        }) as Extra,
    );
}

function rowsToSources(rows: GenerationWithRelations['generation_sources']): Source[] {
  return [...(rows ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((row) => ({ label: row.label, url: row.url }));
}

/**
 * Eine Generation aus ihrer Zeile. Ohne eingebettete Quellen (schlanke Listenabfrage)
 * ist `sources` leer – die Detailseite lädt sie separat.
 */
export function rowToGeneration(row: GenerationWithRelations): Generation {
  const images = withoutEmpty({
    hero: row.image_hero,
    gallery: row.image_gallery,
    credit: row.image_credit,
  });

  const generation = withoutEmpty({
    id: row.id,
    yearFrom: row.year_from,
    changes: row.changes,
    colors: row.colors,
    engine: withoutEmpty({
      displacementCc: row.displacement_cc,
      cylinders: row.cylinders,
      layout: row.engine_layout,
      cooling: row.cooling,
      powerKw: row.power_kw,
      powerRpm: row.power_rpm,
      torqueNm: row.torque_nm,
      torqueRpm: row.torque_rpm,
    }),
    performance: withoutEmpty({
      topSpeedKmh: estimated(row.top_speed_kmh, row.top_speed_kind),
      accel0to100s: estimated(row.accel_0_100_s, row.accel_0_100_kind),
    }),
    chassis: withoutEmpty({
      weightKg: row.weight_kg,
      weightNote: row.weight_note,
      seatHeightMm: row.seat_height_mm,
      tankL: row.tank_l,
      consumptionL100km: row.consumption_l100km,
      gears: row.gears,
      drive: row.drive,
    }),
    throttle: withoutEmpty({
      available: row.throttle_available,
      throttledPowerKw: row.throttled_power_kw,
      note: row.throttle_note,
    }),
    quickshifter: row.quickshifter,
    blipper: row.blipper,
    price: withoutEmpty({ chf: row.price_chf, asOf: row.price_as_of, note: row.price_note }),
    scores: {
      tuningVisual: row.score_tuning_visual,
      tuningPerformance: row.score_tuning_performance,
      sound: row.score_sound,
      profile: {
        beginner: row.profile_beginner,
        city: row.profile_city,
        touring: row.profile_touring,
        sport: row.profile_sport,
        offroad: row.profile_offroad,
      },
    },
    tuningNote: row.tuning_note,
    sound: withoutEmpty({
      description: row.sound_description,
      audioSrc: row.sound_audio_src,
      noiseDbA: row.noise_db_a,
    }),
    extras: rowsToExtras(row.generation_features),
    youtubeReviewUrl: row.youtube_review_url,
    images: Object.keys(images).length > 0 ? images : undefined,
    sources: rowsToSources(row.generation_sources),
    dataStatus: row.data_status,
    lastChecked: row.last_checked,
  });
  // yearTo ist Pflicht und darf null sein (= aktuell erhältlich) – darum nach dem Aufräumen setzen
  return { ...generation, yearTo: row.year_to } as unknown as Generation;
}

/** Ein Modell mit seinen Generationen, älteste zuerst. */
export function rowToModel(row: ModelWithRelations): Model {
  const generations = [...(row.generations ?? [])]
    .sort((a, b) => a.year_from - b.year_from)
    .map(rowToGeneration);
  return withoutEmpty({
    id: row.id,
    manufacturerId: row.manufacturer_id,
    name: row.name,
    category: row.category,
    tagline: row.tagline,
    generations,
  }) as unknown as Model;
}
