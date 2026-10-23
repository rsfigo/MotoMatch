import { describe, expect, it } from 'vitest';
import { makeGeneration, makeModel } from '@/test/fixtures';
import { NBSP } from './format';
import { bikePageMeta, pageDescription, pageTitle, STATIC_PAGES } from './pageMeta';

describe('Kopfdaten der Seiten', () => {
  it('hängt den Namen der Website an den Titel, die Startseite trägt den Claim', () => {
    expect(pageTitle({ title: 'Alle Bikes' })).toBe('Alle Bikes · MotoMatch');
    expect(pageTitle({})).toBe('MotoMatch – Finde das Bike, das zu dir passt.');
  });

  it('nimmt ohne eigene Beschreibung die der Website', () => {
    expect(pageDescription({ description: 'Eigene Beschreibung.' })).toBe('Eigene Beschreibung.');
    expect(pageDescription({})).toMatch(/^Motorräder für die Schweiz vergleichen/);
  });

  it('Detailseite: Name mit Baujahren, Tagline und Eckdaten', () => {
    const generation = makeGeneration({ yearFrom: 2021, yearTo: 2024 });
    const model = makeModel({ tagline: 'Leicht und handlich.', generations: [generation] });

    expect(bikePageMeta('Testmarke Testbike', model, generation)).toEqual({
      title: 'Testmarke Testbike (2021–2024)',
      description: `Leicht und handlich. 68${NBSP}PS, 65${NBSP}Nm, CHF${NBSP}9’990.–.`,
    });
  });

  it('Detailseite ohne Tagline: nur die Eckdaten', () => {
    const generation = makeGeneration();
    const model = makeModel({ generations: [generation] });

    expect(bikePageMeta('Testmarke Testbike', model, generation)).toEqual({
      title: `Testmarke Testbike (ab${NBSP}2024)`,
      description: `68${NBSP}PS, 65${NBSP}Nm, CHF${NBSP}9’990.–.`,
    });
  });

  it('jede Seite ohne Daten kommt genau einmal vor, die Startseite ohne eigenen Titel', () => {
    const paths = STATIC_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(STATIC_PAGES.find((page) => page.path === '/')?.meta).toEqual({});
    for (const page of STATIC_PAGES.filter((item) => item.path !== '/')) {
      expect(page.meta.title).toBeTruthy();
      expect(page.meta.description).toBeTruthy();
    }
  });
});
