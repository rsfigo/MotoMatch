import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/Badge';
import { useCompareSelection } from '@/hooks/useCompareSelection';
import { useTilt } from '@/hooks/useTilt';
import { t } from '@/i18n';
import type { CatalogEntry } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { formatChf, formatPs, formatTorque } from '@/lib/format';
import { generationYears } from '@/lib/generations';
import { bikeImageLayoutId } from '@/lib/layoutIds';
import { spring } from '@/lib/motion';
import { BikeSilhouette } from './BikeSilhouette';
import { CompareToggle } from './CompareToggle';
import { LicenceBadge } from './LicenceBadge';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * Karte im Katalog. Die ganze Karte ist klickbar (Link über dem Titel, gestreckt),
 * die Checkbox «Vergleichen» liegt darüber und bleibt separat bedienbar.
 */
export function BikeCard({ entry }: { entry: CatalogEntry }) {
  const { model, generation, manufacturer, licence, olderGenerationCount } = entry;
  const { isSelected } = useCompareSelection();
  const imageRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt();
  const selected = isSelected(model.id);

  return (
    <motion.article
      {...tilt.handlers}
      style={tilt.style}
      whileHover={tilt.enabled ? { y: -4 } : undefined}
      transition={spring.gentle}
      className={cn(
        'group relative flex h-full flex-col rounded-card border bg-surface shadow-card',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent',
        selected ? 'border-accent/70' : 'border-line',
      )}
    >
      {/* Glow beim Hover – nur die Deckkraft wird animiert */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-card opacity-0 shadow-glow transition-opacity duration-300 group-hover:opacity-100"
      />

      <div
        ref={imageRef}
        className="relative aspect-[16/10] overflow-hidden rounded-t-card bg-[radial-gradient(120%_90%_at_50%_100%,var(--mm-surface-3),transparent_70%)]"
      >
        <motion.div
          layoutId={bikeImageLayoutId(model.id)}
          className="absolute inset-0 grid place-items-center px-6 pt-8"
        >
          <BikeSilhouette
            category={model.category}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </motion.div>
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge>{t.categories[model.category]}</Badge>
          <Badge>{generationYears(generation)}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
            {manufacturer?.name}
          </p>
          <h3 className="mt-1 text-2xl leading-tight font-semibold">
            <Link
              to={`/bikes/${model.id}`}
              className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {model.name}
            </Link>
          </h3>
          {olderGenerationCount > 0 && (
            <p className="mt-1 text-xs text-ink-muted">
              {t.card.moreGenerations(olderGenerationCount)}
            </p>
          )}
        </div>

        <dl className="grid grid-cols-[1fr_1fr_1.45fr] gap-3 border-y border-line py-3">
          <Stat label={t.card.power} value={formatPs(generation.engine.powerKw)} />
          <Stat label={t.card.torque} value={formatTorque(generation.engine.torqueNm)} />
          <Stat label={t.card.price} value={formatChf(generation.price.chf)} />
        </dl>

        <LicenceBadge licence={licence} />

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <CompareToggle
            modelId={model.id}
            getOrigin={() => imageRef.current?.getBoundingClientRect()}
          />
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted group-hover:text-accent-ink"
          >
            {t.card.detailsHint}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
