import { Suspense, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { RouteFallback } from './RouteFallback';

interface PageFrameProps {
  /** Scrollposition, an die beim Betreten der Seite gesprungen wird (0 = oben). */
  scrollTop: number;
}

/**
 * Rahmen um jede Seite: springt beim Betreten an die richtige Scrollposition und zeigt
 * ein Skeleton, falls der Seiten-Code noch lädt. Die Ein- und Ausblend-Animation steuert
 * AppRoutes.
 */
export function PageFrame({ scrollTop }: PageFrameProps) {
  // Nur der Wert beim Betreten zählt – spätere Änderungen (z. B. Filter in der URL) scrollen nicht.
  const [initialScrollTop] = useState(scrollTop);

  useLayoutEffect(() => {
    window.scrollTo(0, initialScrollTop);
  }, [initialScrollTop]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  );
}
