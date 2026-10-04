import { describe, expect, it } from 'vitest';
import { embedRows as embed, loadDataset } from '@/test/datasetRows';
import { modelSchema } from '../schema';
import {
  datasetToRows,
  generationToRow,
  rowsToFeatures,
  rowToGeneration,
  rowToModel,
} from './mapping';
import type { GenerationWithRelations } from './rows';

describe('Mapping Datenbank ↔ Domain-Modell', () => {
  const dataset = loadDataset();
  const rows = datasetToRows(dataset);

  it('alle echten Bikes überstehen den Weg in die Datenbank und zurück unverändert', () => {
    const models = embed(rows, { withSources: true }).map(rowToModel);
    expect(models).toEqual(dataset.models);
    for (const model of models) expect(modelSchema.safeParse(model).success).toBe(true);
  });

  it('die schlanke Listenabfrage liefert alles ausser den Quellen', () => {
    const models = embed(rows, { withSources: false }).map(rowToModel);
    for (const model of models) {
      for (const generation of model.generations) expect(generation.sources).toEqual([]);
      expect(modelSchema.safeParse(model).success).toBe(true);
    }
  });

  it('Extras-Katalog behält die Reihenfolge aus features.json', () => {
    const shuffled = [...rows.features].reverse();
    expect(rowsToFeatures(shuffled)).toEqual(dataset.features);
  });

  it('zählt die Zeilen pro Tabelle', () => {
    const generations = dataset.models.flatMap((model) => model.generations);
    expect(rows.models).toHaveLength(dataset.models.length);
    expect(rows.generations).toHaveLength(generations.length);
    expect(rows.generation_features).toHaveLength(
      generations.reduce((sum, generation) => sum + (generation.extras?.length ?? 0), 0),
    );
    expect(rows.generation_sources).toHaveLength(
      generations.reduce((sum, generation) => sum + generation.sources.length, 0),
    );
  });
});

describe('Mapping einer Beispielzeile', () => {
  /** Eine Generation, wie Supabase sie liefert – mit NULL in allen optionalen Spalten. */
  const row: GenerationWithRelations = {
    id: 'testmarke-testbike-2024',
    model_id: 'testmarke-testbike',
    year_from: 2024,
    year_to: null,
    changes: null,
    colors: null,
    displacement_cc: 689,
    cylinders: 2,
    engine_layout: 'Reihen-Zweizylinder',
    cooling: 'liquid',
    power_kw: 54,
    power_rpm: null,
    torque_nm: 67,
    torque_rpm: null,
    top_speed_kmh: 205,
    top_speed_kind: 'estimate',
    accel_0_100_s: null,
    accel_0_100_kind: null,
    weight_kg: 184,
    weight_note: null,
    seat_height_mm: 805,
    tank_l: 14,
    consumption_l100km: null,
    gears: 6,
    drive: 'chain',
    throttle_available: true,
    throttled_power_kw: 35,
    throttle_note: null,
    quickshifter: 'optional',
    blipper: 'none',
    price_chf: 8590,
    price_as_of: '2026-10-04',
    price_note: null,
    score_tuning_visual: 9,
    score_tuning_performance: 6,
    score_sound: 7,
    profile_beginner: 9,
    profile_city: 9,
    profile_touring: 5,
    profile_sport: 7,
    profile_offroad: 1,
    tuning_note: 'Nur für Tests.',
    sound_description: 'Nur für Tests.',
    sound_audio_src: null,
    noise_db_a: null,
    youtube_review_url: null,
    image_hero: null,
    image_gallery: null,
    image_credit: null,
    data_status: 'verified',
    last_checked: '2026-10-04',
    generation_features: [
      { feature_key: 'tft-display', availability: 'standard', detail: null, position: 1 },
      { feature_key: 'heated-grips', availability: 'optional', detail: 'Zubehör', position: 0 },
    ],
  };

  it('NULL-Werte fallen weg, Schätzwerte werden zu Wert und Art', () => {
    const generation = rowToGeneration(row);
    expect(generation.yearTo).toBeNull();
    expect(generation.engine).toEqual({
      displacementCc: 689,
      cylinders: 2,
      layout: 'Reihen-Zweizylinder',
      cooling: 'liquid',
      powerKw: 54,
      torqueNm: 67,
    });
    expect(generation.performance).toEqual({ topSpeedKmh: { value: 205, kind: 'estimate' } });
    expect(generation.throttle).toEqual({ available: true, throttledPowerKw: 35 });
    expect(generation).not.toHaveProperty('changes');
    expect(generation).not.toHaveProperty('images');
    expect(generation).not.toHaveProperty('youtubeReviewUrl');
    expect(generation.sources).toEqual([]);
  });

  it('Extras kommen in der gespeicherten Reihenfolge, ohne leere Details', () => {
    expect(rowToGeneration(row).extras).toEqual([
      { key: 'heated-grips', availability: 'optional', detail: 'Zubehör' },
      { key: 'tft-display', availability: 'standard' },
    ]);
  });

  it('ohne Extras fehlt das Feld ganz (wie im JSON)', () => {
    expect(rowToGeneration({ ...row, generation_features: [] })).not.toHaveProperty('extras');
  });

  it('Generationen werden chronologisch sortiert', () => {
    const newer = { ...row, id: 'testmarke-testbike-2026', year_from: 2026 };
    const model = rowToModel({
      id: 'testmarke-testbike',
      manufacturer_id: 'testmarke',
      name: 'Testbike',
      category: 'naked',
      tagline: null,
      generations: [newer, { ...row, year_to: 2025 }],
    });
    expect(model.generations.map((generation) => generation.yearFrom)).toEqual([2024, 2026]);
    expect(model).not.toHaveProperty('tagline');
  });

  it('der Weg zurück setzt fehlende Werte auf NULL', () => {
    const generation = rowToGeneration(row);
    const back = generationToRow('testmarke-testbike', generation);
    const { generation_features: _extras, generation_sources: _sources, ...flat } = row;
    expect(back).toEqual(flat);
  });
});
