import { IdCard, Info } from 'lucide-react';
import { Card, Section } from '@/components/ui/Section';
import type { Generation } from '@/data/schema';
import { t } from '@/i18n';
import { formatKw, formatPowerToWeight } from '@/lib/format';
import { licenceOf } from '@/lib/specs';

/** Welcher Führerausweis reicht? Inkl. Drosselung und Hinweis zum Fahrzeugausweis. */
export function LicenceCard({ generation }: { generation: Generation }) {
  const licence = licenceOf(generation);
  const throttledKw = generation.throttle.throttledPowerKw;

  return (
    <Section title={t.detail.licenceTitle}>
      <Card className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-ink">
            <IdCard aria-hidden="true" className="size-8" />
          </span>
          <div>
            <p className="text-xs font-medium text-ink-muted">{t.licence.label}</p>
            <p className="font-display text-3xl font-semibold">
              {t.licence.short[licence.required]}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm sm:text-base">
          <p>{t.detail.licenceText[licence.required]}</p>
          {licence.withThrottle && throttledKw && (
            <p className="font-medium text-accent-ink">
              {t.detail.licenceThrottle(formatKw(throttledKw))}
            </p>
          )}
          <p className="text-ink-muted">
            {t.specs.powerToWeight}: {formatPowerToWeight(licence.powerToWeightKwPerKg)}
          </p>
          {generation.throttle.note && <p className="text-ink-muted">{generation.throttle.note}</p>}
          <p className="flex gap-2 text-xs text-ink-subtle">
            <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>
              {t.licence.disclaimer}
              {licence.withThrottle && <> {t.detail.licenceThrottleRule}</>}
            </span>
          </p>
        </div>
      </Card>
    </Section>
  );
}
