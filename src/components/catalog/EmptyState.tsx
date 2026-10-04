import { SearchX } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { fadeUp } from '@/lib/motion';

/** Anzeige, wenn kein Bike zu Suche und Filtern passt. */
export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center rounded-panel border border-dashed border-line-strong px-6 py-16 text-center"
    >
      <span className="grid size-12 place-items-center rounded-full bg-surface-2">
        <SearchX aria-hidden="true" className="size-6 text-ink-muted" />
      </span>
      <h3 className="mt-4 text-xl font-semibold">{t.catalog.emptyTitle}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{t.catalog.emptyText}</p>
      <Button variant="secondary" className="mt-6" onClick={onReset}>
        {t.catalog.resetFilters}
      </Button>
    </motion.div>
  );
}
