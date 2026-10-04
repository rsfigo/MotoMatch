/**
 * «Beliebte Vergleiche» auf der Startseite und im leeren Vergleich.
 * Die Titel stehen in src/i18n/de.ts (compare.popular).
 */
export const POPULAR_COMPARISONS = [
  { id: 'a1', bikes: ['yamaha-mt-125', 'ktm-125-duke'] },
  { id: 'a35', bikes: ['ktm-390-duke', 'aprilia-rs-457', 'royal-enfield-interceptor-650'] },
  { id: 'middle', bikes: ['yamaha-mt-07', 'kawasaki-z650', 'triumph-trident-660'] },
  { id: 'character', bikes: ['yamaha-mt-09', 'ducati-monster', 'honda-cb650r'] },
] as const;

export type PopularComparisonId = (typeof POPULAR_COMPARISONS)[number]['id'];
