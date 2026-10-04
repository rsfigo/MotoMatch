import { useSyncExternalStore } from 'react';

/**
 * Reagiert auf eine CSS-Media-Query, z. B. '(min-width: 1024px)'.
 * Nützlich, um schwere Effekte nur auf passenden Geräten zu zeigen.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** true, wenn ein Gerät mit Maus bedient wird (Hover-Effekte, Tilt). */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
