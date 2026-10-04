import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { pageVariants } from '@/lib/motion';
import { preloadOtherPagesLater, ROUTES } from './pages';
import { PageFrame } from './PageFrame';

/**
 * Alle Routen mit Seitenübergang.
 *
 * mode="popLayout": Die alte Seite blendet aus, während die neue schon einblendet.
 * So existieren beide kurz gleichzeitig – nötig, damit das Bike-Bild (layoutId) von der
 * Karte in die Detailseite wandern kann. Der Schlüssel ist nur der Pfad: Filter in der
 * URL (?…) lösen keinen Seitenwechsel aus.
 */
export function AppRoutes() {
  const location = useLocation();
  const scrollTop = useScrollMemory();

  useEffect(() => preloadOtherPagesLater(), []);

  return (
    // initial={false}: Beim ersten Laden steht die Seite sofort da (schnelleres LCP),
    // die Übergänge gelten nur beim Wechsel zwischen Seiten.
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route element={<PageFrame scrollTop={scrollTop} />}>
            {ROUTES.map(({ path, page: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
