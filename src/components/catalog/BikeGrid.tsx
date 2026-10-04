import { AnimatePresence, motion } from 'motion/react';
import { BikeCard } from '@/components/bike/BikeCard';
import type { CatalogEntry } from '@/lib/catalog';
import { duration, ease, enterTransition, spring, staggerStep } from '@/lib/motion';

/** Höchstens so viele Karten erscheinen gestaffelt, der Rest ohne zusätzliche Wartezeit. */
const MAX_STAGGERED = 9;

/**
 * Raster der Bike-Karten. Beim Filtern und Sortieren ordnen sich die Karten per
 * Layout-Animation neu an; neue Karten blenden gestaffelt ein, entfernte aus.
 */
export function BikeGrid({ entries }: { entries: CatalogEntry[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.li
            key={entry.model.id}
            layout="position"
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                ...enterTransition,
                delay: Math.min(index, MAX_STAGGERED) * staggerStep.base,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              transition: { duration: duration.fast, ease: ease.in },
            }}
            transition={{ layout: spring.layout }}
          >
            <BikeCard entry={entry} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
