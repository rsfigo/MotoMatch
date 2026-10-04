import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import type { Category } from '@/data/schema';
import { useModels } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import { URL_PARAMS } from '@/lib/catalog';
import { fadeUp, staggerContainer, staggerStep } from '@/lib/motion';

/** Kacheln für jede Kategorie, in der es Bikes gibt – führen in den gefilterten Katalog. */
export function CategoryTiles() {
  const models = useModels();
  const counts = new Map<Category, number>();
  for (const model of models) counts.set(model.category, (counts.get(model.category) ?? 0) + 1);
  const categories = [...counts.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));

  return (
    <motion.ul
      variants={staggerContainer(staggerStep.base)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {categories.map((category) => (
        <motion.li key={category} variants={fadeUp}>
          <Link
            to={`/bikes?${URL_PARAMS.categories}=${category}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-4 shadow-card hover:border-line-strong sm:p-5"
          >
            <BikeSilhouette
              category={category}
              className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105"
            />
            <span className="mt-3 flex items-center justify-between gap-2">
              <span className="font-display text-base font-semibold sm:text-lg">
                {t.categories[category]}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-ink-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
              />
            </span>
            <span className="text-xs text-ink-muted">
              {t.home.categoryCount(counts.get(category) ?? 0)}
            </span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
