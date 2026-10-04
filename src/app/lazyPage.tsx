import { use, type ComponentType } from 'react';

/**
 * Wie React.lazy, aber vorladbar und wiederholbar.
 *
 * Code-Splitting bleibt erhalten (jede Seite ist ein eigener Chunk). Ist der Code einer
 * Seite schon geladen, wird sie direkt gerendert – ohne kurzes Skeleton. Das ist wichtig
 * für den Seitenwechsel, bei dem das Bike-Bild von der Karte in die Detailseite wandert.
 * Scheitert der Download (z. B. Netzwerk), lädt «Erneut versuchen» den Code neu –
 * React.lazy würde sich den Fehler für immer merken.
 */
export function lazyPage(factory: () => Promise<{ default: ComponentType }>) {
  let Loaded: ComponentType | undefined;
  let pending: Promise<void> | undefined;

  const load = (): Promise<void> => {
    pending ??= factory().then(
      (module) => {
        Loaded = module.default;
      },
      (error: unknown) => {
        pending = undefined;
        throw error;
      },
    );
    return pending;
  };

  function Page() {
    // Wartet (Suspense), bis der Code da ist; ein Fehler geht an die Fehlergrenze
    if (!Loaded) use(load());
    return Loaded ? <Loaded /> : null;
  }
  Page.preload = load;
  return Page;
}
