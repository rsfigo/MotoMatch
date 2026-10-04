import { lazy, type ComponentType } from 'react';

/**
 * Wie React.lazy, aber vorladbar.
 *
 * Code-Splitting bleibt erhalten (jede Seite ist ein eigener Chunk). Ist der Code einer
 * Seite schon geladen, wird sie direkt gerendert – ohne kurzes Skeleton. Das ist wichtig
 * für den Seitenwechsel, bei dem das Bike-Bild von der Karte in die Detailseite wandert.
 */
export function lazyPage(factory: () => Promise<{ default: ComponentType }>) {
  let Loaded: ComponentType | undefined;
  let pending: Promise<unknown> | undefined;

  const load = () => {
    pending ??= factory().then((module) => {
      Loaded = module.default;
    });
    return pending;
  };

  const LazyPage = lazy(async () => {
    await load();
    return { default: Loaded as ComponentType };
  });

  function Page() {
    return Loaded ? <Loaded /> : <LazyPage />;
  }
  Page.preload = load;
  return Page;
}

/** Lädt die Seiten im Hintergrund vor, sobald der Browser Zeit hat. */
export function preloadWhenIdle(pages: readonly { preload: () => Promise<unknown> }[]) {
  const run = () => {
    for (const page of pages) void page.preload();
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1500);
}
