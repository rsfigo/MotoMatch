/**
 * Alle Seiten mit ihren Pfaden
 * ----------------------------
 * Jede Seite ist ein eigener Chunk (Code-Splitting pro Route). AppRoutes baut daraus
 * die Routen; main.tsx lädt beim Start den Chunk der aktuellen Seite vor dem ersten
 * Rendern (siehe preloadPageFor).
 */
import { matchPath } from 'react-router';
import { lazyPage } from './lazyPage';

const NotFoundPage = lazyPage(() => import('@/pages/NotFoundPage'));

export const ROUTES = [
  { path: '/', page: lazyPage(() => import('@/pages/HomePage')) },
  { path: '/bikes', page: lazyPage(() => import('@/pages/CatalogPage')) },
  { path: '/bikes/:slug', page: lazyPage(() => import('@/pages/BikeDetailPage')) },
  { path: '/compare', page: lazyPage(() => import('@/pages/ComparePage')) },
  { path: '/match', page: lazyPage(() => import('@/pages/MatchPage')) },
  { path: '/impressum', page: lazyPage(() => import('@/pages/ImprintPage')) },
  { path: '/datenschutz', page: lazyPage(() => import('@/pages/PrivacyPage')) },
  { path: '*', page: NotFoundPage },
] as const;

const ALL_PAGES = ROUTES.map((route) => route.page);

/**
 * Lädt den Code der Seite zu einem Pfad. Wartet main.tsx darauf, erscheint die Seite
 * beim ersten Laden ohne Skeleton – React würde ein einmal gezeigtes Skeleton sonst
 * mindestens 300 ms stehen lassen (das verzögert den grössten Inhalt, LCP).
 */
export function preloadPageFor(pathname: string): Promise<unknown> {
  const route = ROUTES.find(
    (candidate) => candidate.path !== '*' && matchPath(candidate.path, pathname),
  );
  return (route?.page ?? NotFoundPage).preload();
}

/**
 * Lädt alle übrigen Seiten im Hintergrund – erst nach dem Laden der Seite und wenn der
 * Browser Zeit hat, damit es den ersten Aufbau nicht bremst.
 */
export function preloadOtherPagesLater(): void {
  const run = () => {
    for (const page of ALL_PAGES) void page.preload();
  };
  const whenIdle = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 500);
  };
  const afterLoad = () => setTimeout(whenIdle, 1500);
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });
}
