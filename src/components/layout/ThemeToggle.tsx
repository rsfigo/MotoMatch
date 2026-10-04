import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/i18n';
import { duration, ease, spring } from '@/lib/motion';

/**
 * Umschalter zwischen dunklem und hellem Design.
 * Wo der Browser es kann (View Transitions API), breitet sich das neue Design
 * kreisförmig vom Knopf aus. Sonst (oder bei reduzierter Bewegung) wechselt es sofort.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const canAnimate = typeof document.startViewTransition === 'function' && !reduceMotion;
    if (!canAnimate) {
      setTheme(nextTheme);
      return;
    }

    // Mittelpunkt des Knopfs = Startpunkt des Kreises
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: duration.slow * 1000,
            easing: `cubic-bezier(${ease.out.join(',')})`,
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // Übergang wurde übersprungen – das Theme ist trotzdem gewechselt.
      });
  }

  const label = theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={spring.snappy}
      className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink-muted hover:text-ink"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={spring.bouncy}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
