import { motion } from 'motion/react';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { pageVariants } from '@/lib/motion';
import { RouteFallback } from './RouteFallback';

interface PageTransitionProps {
  /** Scrollposition, an die beim Betreten der Seite gesprungen wird (0 = oben). */
  scrollTop: number;
}

/**
 * Hülle um jede Seite: blendet sie animiert ein und aus (gesteuert von AnimatePresence
 * in AppRoutes) und zeigt ein Skeleton, solange der Seiten-Code lädt.
 */
export function PageTransition({ scrollTop }: PageTransitionProps) {
  // Nur der Wert beim Betreten zählt – spätere Änderungen (z. B. Filter in der URL) scrollen nicht.
  const [initialScrollTop] = useState(scrollTop);

  useLayoutEffect(() => {
    window.scrollTo(0, initialScrollTop);
  }, [initialScrollTop]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </motion.div>
  );
}
