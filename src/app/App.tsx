import { MotionConfig } from 'motion/react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { t } from '@/i18n';
import { AppRoutes } from './AppRoutes';

export function App() {
  return (
    // reducedMotion="user": Bei «Bewegung reduzieren» im System bleiben nur Fades übrig.
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only-focusable fixed top-3 left-3 z-50 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
        >
          {t.a11y.skipToContent}
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
