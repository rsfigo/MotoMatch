import { ArrowRight, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { CompareToggle } from '@/components/bike/CompareToggle';
import { LicenceBadge } from '@/components/bike/LicenceBadge';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { useManufacturerName } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { formatChf, formatPs, formatSeatHeight, formatWeight } from '@/lib/format';
import { generationYears } from '@/lib/generations';
import type { MatchReason, MatchResult } from '@/lib/match';
import { fadeUp } from '@/lib/motion';
import { licenceOf } from '@/lib/specs';
import { PercentRing } from './PercentRing';
import { reasonText } from './reasonText';

const REASON_STYLE: Record<MatchReason['tone'], { icon: typeof Info; className: string }> = {
  positive: { icon: CircleCheck, className: 'text-positive' },
  warning: { icon: TriangleAlert, className: 'text-warning' },
  info: { icon: Info, className: 'text-ink-muted' },
};

function ReasonList({ reasons }: { reasons: readonly MatchReason[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {reasons.map((reason) => {
        const { icon: Icon, className } = REASON_STYLE[reason.tone];
        return (
          <li key={reason.kind} className="flex gap-2">
            <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', className)} />
            <span>{reasonText(reason)}</span>
          </li>
        );
      })}
    </ul>
  );
}

interface MatchResultCardProps {
  result: MatchResult;
  rank: number;
}

/** Ein Treffer: Match-Prozent, Bike, Begründungen, Eckdaten, Details und Vergleichen. */
export function MatchResultCard({ result, rank }: MatchResultCardProps) {
  const { model, generation, percent, reasons } = result;
  const imageRef = useRef<HTMLDivElement>(null);
  const featured = rank === 1;
  const manufacturerName = useManufacturerName()(model.manufacturerId);
  const facts = [
    formatPs(generation.engine.powerKw),
    formatWeight(generation.chassis.weightKg),
    formatSeatHeight(generation.chassis.seatHeightMm),
    formatChf(generation.price.chf),
  ];

  return (
    <motion.li variants={fadeUp}>
      <article
        className={cn(
          'relative overflow-hidden rounded-panel border bg-surface p-5 sm:p-6',
          featured ? 'border-accent/50 shadow-glow' : 'border-line shadow-card',
        )}
      >
        {featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)]"
          />
        )}
        <div className="relative flex gap-4 sm:gap-6">
          <PercentRing percent={percent} large={featured} delay={0.15 + rank * 0.08} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">
              {t.match.results.rank(rank)}
              <span className="text-ink-subtle"> · </span>
              {manufacturerName}
            </p>
            <h3 className={cn('mt-1 font-bold', featured ? 'text-3xl' : 'text-2xl')}>
              {model.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge>{generationYears(generation)}</Badge>
              <LicenceBadge licence={licenceOf(generation)} />
            </div>
          </div>
          <div
            ref={imageRef}
            aria-hidden="true"
            className="hidden h-24 w-40 shrink-0 place-items-center rounded-card bg-surface-2 sm:grid"
          >
            <BikeSilhouette category={model.category} className="w-32" />
          </div>
        </div>

        <div className="relative mt-5">
          <ReasonList reasons={reasons} />
        </div>

        <p className="relative mt-5 border-t border-line pt-4 text-sm text-ink-muted tabular-nums">
          {facts.join(' · ')}
        </p>

        <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <ButtonLink to={`/bikes/${model.id}`} size="sm" variant="secondary">
            {t.match.results.details}
            <span className="sr-only">: {model.name}</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <CompareToggle
            modelId={model.id}
            getOrigin={() => {
              // Auf dem Handy ist das Bild ausgeblendet – dann ohne Flug-Animation
              const rect = imageRef.current?.getBoundingClientRect();
              return rect && rect.width > 0 ? rect : undefined;
            }}
          />
        </div>
      </article>
    </motion.li>
  );
}
