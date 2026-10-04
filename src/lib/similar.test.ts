import { describe, expect, it } from 'vitest';
import { makeGeneration, makeModel } from '@/test/fixtures';
import { findSimilarModels } from './similar';
import { youTubeEmbedUrl } from './youtube';

function bike(id: string, category: 'naked' | 'adventure', powerKw: number, chf: number) {
  return makeModel({
    id,
    category,
    generations: [
      makeGeneration({
        id: `${id}-2024`,
        engine: {
          displacementCc: 700,
          cylinders: 2,
          layout: 'V2',
          cooling: 'liquid',
          powerKw,
          torqueNm: 70,
        },
        price: { chf, asOf: '2026-10-04' },
      }),
    ],
  });
}

describe('findSimilarModels', () => {
  const current = bike('a-mittel', 'naked', 54, 8900);
  const all = [
    current,
    bike('b-fast-gleich', 'naked', 50, 8500),
    bike('c-naked-stark', 'naked', 90, 12000),
    bike('d-reise', 'adventure', 107, 19800),
    bike('e-reise-mittel', 'adventure', 55, 9000),
  ];

  it('bevorzugt gleiche Kategorie, ähnliche Leistung und ähnlichen Preis', () => {
    const similar = findSimilarModels(current, all, 3).map((model) => model.id);
    expect(similar[0]).toBe('b-fast-gleich');
    expect(similar).not.toContain('a-mittel');
    expect(similar).toHaveLength(3);
    expect(similar.indexOf('d-reise')).toBe(-1);
  });
});

describe('youTubeEmbedUrl', () => {
  it('bettet über youtube-nocookie.com ein', () => {
    expect(youTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
    );
    expect(youTubeEmbedUrl('https://example.com')).toBeNull();
  });
});
