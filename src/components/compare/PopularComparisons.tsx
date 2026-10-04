import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import type { Model } from '@/data/schema';
import { t } from '@/i18n';
import { compareUrl } from '@/lib/compareSelection';
import { getModel, getModelFullName } from '@/lib/data';
import { fadeUp, spring, staggerContainer } from '@/lib/motion';
import { POPULAR_COMPARISONS } from '@/lib/popularComparisons';

/** Kacheln «Beliebte Vergleiche» – auf der Startseite und im leeren Vergleich. */
export function PopularComparisons() {
  return (
    <motion.ul
      variants={staggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {POPULAR_COMPARISONS.map((comparison) => {
        const models = comparison.bikes
          .map((id) => getModel(id))
          .filter((model): model is Model => model !== undefined);
        const names = models.map(getModelFullName).join(` ${t.compare.vs} `);

        return (
          <motion.li key={comparison.id} variants={fadeUp}>
            <motion.div whileHover={{ y: -4 }} transition={spring.snappy} className="h-full">
              <Link
                to={compareUrl(models.map((model) => model.id))}
                className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-5 shadow-card transition-colors hover:border-line-strong sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -bottom-20 size-56 rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div aria-hidden="true" className="flex">
                  {models.map((model, index) => (
                    <span
                      key={model.id}
                      className="grid h-12 w-[4.5rem] place-items-center rounded-xl border-2 border-surface bg-surface-2"
                      style={{
                        marginLeft: index === 0 ? 0 : '-0.75rem',
                        zIndex: models.length - index,
                      }}
                    >
                      <BikeSilhouette category={model.category} className="w-14" />
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">
                  {t.compare.popular[comparison.id]}
                </p>
                <p className="mt-1 pr-8 font-display text-lg leading-snug font-semibold text-balance">
                  {names}
                </p>
                <ArrowRight
                  aria-hidden="true"
                  className="absolute top-6 right-5 size-5 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-ink sm:right-6"
                />
              </Link>
            </motion.div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
