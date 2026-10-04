import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { duration, ease, spring } from '@/lib/motion';
import { Container } from './Container';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/bikes', label: t.nav.bikes },
  { to: '/compare', label: t.nav.compare },
  { to: '/match', label: t.nav.match },
] as const;

/** Kopfzeile: bleibt oben kleben, mit Glas-Effekt (Blur) und animiertem Aktiv-Indikator. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Menü mit Escape oder Klick ausserhalb schliessen
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-line bg-glass backdrop-blur-xl backdrop-saturate-150"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label={t.a11y.homeLink} className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label={t.a11y.mainNavigation} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="relative block rounded-full px-4 py-2 text-sm font-medium"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-surface-3"
                          transition={spring.snappy}
                        />
                      )}
                      <span
                        className={cn(
                          'relative',
                          isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.a11y.mainNavigation}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, y: -8, transition: { duration: duration.instant, ease: ease.in } }}
            className="absolute inset-x-0 top-full border-b border-line bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <Container className="py-3">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-control px-3 py-3 font-display text-xl font-medium',
                          isActive ? 'text-accent-ink' : 'text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
