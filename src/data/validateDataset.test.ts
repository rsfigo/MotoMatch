import { describe, expect, it } from 'vitest';
import { makeGeneration, makeModel } from '@/test/fixtures';
import { getYouTubeVideoId } from './schema';
import { validateDataset } from './validateDataset';

const manufacturers = [{ id: 'testmarke', name: 'Testmarke', country: 'CH' }];
const features = [
  { key: 'tft-display', label: 'TFT-Display', group: 'electronics', icon: 'tablet' },
];

function validate(model: unknown, fileName = 'testmarke-testbike.json') {
  return validateDataset({ manufacturers, features, models: { [fileName]: model } });
}

describe('validateDataset', () => {
  it('akzeptiert ein gültiges Modell', () => {
    expect(validate(makeModel()).errors).toEqual([]);
  });

  it('lehnt unbekannte Felder ab (Tippfehler-Schutz)', () => {
    const model = { ...makeModel(), colour: 'rot' };
    expect(validate(model).errors.join('\n')).toContain('colour');
  });

  it('lehnt Wertungen ausserhalb von 1–10 ab', () => {
    const generation = makeGeneration();
    const broken = { ...generation, scores: { ...generation.scores, sound: 11 } };
    expect(validate({ ...makeModel(), generations: [broken] }).errors).not.toEqual([]);
  });

  it('meldet unbekannte Hersteller und Extras', () => {
    const model = makeModel({
      generations: [
        makeGeneration({ extras: [{ key: 'raketenantrieb', availability: 'standard' }] }),
      ],
    });
    const errors = validate(
      { ...model, manufacturerId: 'unbekannt', id: 'unbekannt-testbike' },
      'unbekannt-testbike.json',
    ).errors;
    expect(errors.join('\n')).toContain('Hersteller "unbekannt"');
    expect(errors.join('\n')).toContain('Extra "raketenantrieb"');
  });

  it('verlangt chronologische Generationen ohne Überschneidung', () => {
    const model = makeModel({
      generations: [
        makeGeneration({ id: 'testmarke-testbike-2021', yearFrom: 2021, yearTo: 2025 }),
        makeGeneration({ id: 'testmarke-testbike-2025', yearFrom: 2025, yearTo: null }),
      ],
    });
    expect(validate(model).errors.join('\n')).toContain('überschneiden');
  });

  it('verlangt die Generations-ID <modell-id>-<yearFrom>', () => {
    const model = makeModel({ generations: [makeGeneration({ id: 'testmarke-testbike-neu' })] });
    expect(validate(model).errors.join('\n')).toContain('testmarke-testbike-2024');
  });

  it('verlangt, dass der Dateiname der Modell-ID entspricht', () => {
    expect(validate(makeModel(), 'falscher-name.json').errors.join('\n')).toContain('Dateiname');
  });
});

describe('getYouTubeVideoId', () => {
  it('erkennt watch- und Kurzlinks', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('lehnt andere Links ab', () => {
    expect(getYouTubeVideoId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(getYouTubeVideoId('kein link')).toBeNull();
  });
});
