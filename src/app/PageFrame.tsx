import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadError } from './LoadError';
import { RouteFallback } from './RouteFallback';

interface PageFrameProps {
  /** Scrollposition, an die beim Betreten der Seite gesprungen wird (0 = oben). */
  scrollTop: number;
}

/**
 * Rahmen um jede Seite: springt beim Betreten an die richtige Scrollposition, zeigt
 * ein Skeleton, solange Code oder Daten laden, und eine Meldung mit «Erneut versuchen»,
 * wenn etwas schiefgeht. Die Ein- und Ausblend-Animation steuert AppRoutes.
 */
export function PageFrame({ scrollTop }: PageFrameProps) {
  const { pathname } = useLocation();
  // Nur der Wert beim Betreten zählt – spätere Änderungen (z. B. Filter in der URL) scrollen nicht.
  const [initialScrollTop] = useState(scrollTop);

  useLayoutEffect(() => {
    window.scrollTo(0, initialScrollTop);
  }, [initialScrollTop]);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          resetKey={pathname}
          onReset={reset}
          fallback={(error, retry) => <LoadError error={error} onRetry={retry} />}
        >
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
