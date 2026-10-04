import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { pageVariants } from '@/lib/motion';
import { lazyPage, preloadWhenIdle } from './lazyPage';
import { PageFrame } from './PageFrame';

// Jede Seite ist ein eigener Chunk (Code-Splitting pro Route) und wird im Leerlauf vorgeladen.
const HomePage = lazyPage(() => import('@/pages/HomePage'));
const CatalogPage = lazyPage(() => import('@/pages/CatalogPage'));
const BikeDetailPage = lazyPage(() => import('@/pages/BikeDetailPage'));
const ComparePage = lazyPage(() => import('@/pages/ComparePage'));
const MatchPage = lazyPage(() => import('@/pages/MatchPage'));
const ImprintPage = lazyPage(() => import('@/pages/ImprintPage'));
const PrivacyPage = lazyPage(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazyPage(() => import('@/pages/NotFoundPage'));

const PAGES = [
  HomePage,
  CatalogPage,
  BikeDetailPage,
  ComparePage,
  MatchPage,
  ImprintPage,
  PrivacyPage,
  NotFoundPage,
];

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

  useEffect(() => preloadWhenIdle(PAGES), []);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route element={<PageFrame scrollTop={scrollTop} />}>
            <Route index element={<HomePage />} />
            <Route path="bikes" element={<CatalogPage />} />
            <Route path="bikes/:slug" element={<BikeDetailPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="match" element={<MatchPage />} />
            <Route path="impressum" element={<ImprintPage />} />
            <Route path="datenschutz" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
