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
