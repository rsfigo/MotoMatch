import { AnimatePresence } from 'motion/react';
import { lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { PageTransition } from './PageTransition';

// Jede Seite wird erst geladen, wenn sie gebraucht wird (Code-Splitting pro Route).
const HomePage = lazy(() => import('@/pages/HomePage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const BikeDetailPage = lazy(() => import('@/pages/BikeDetailPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const MatchPage = lazy(() => import('@/pages/MatchPage'));
const ImprintPage = lazy(() => import('@/pages/ImprintPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/**
 * Alle Routen. AnimatePresence lässt die alte Seite ausblenden, bevor die neue erscheint.
 * Der Schlüssel ist nur der Pfad: Filter in der URL (?…) lösen keinen Seitenwechsel aus.
 */
export function AppRoutes() {
  const location = useLocation();
  const scrollTop = useScrollMemory();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PageTransition scrollTop={scrollTop} />}>
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
    </AnimatePresence>
  );
}
