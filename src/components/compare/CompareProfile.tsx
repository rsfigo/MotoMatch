import {
  RadarChart,
  RadarLegend,
  type RadarSeries,
  type RadarTone,
} from '@/components/charts/RadarChart';
import { EditorialLabel } from '@/components/ui/EditorialLabel';
import { Card, Section } from '@/components/ui/Section';
import { t } from '@/i18n';
import type { CompareItem } from '@/lib/compare';
import { cn } from '@/lib/cn';
import { getModelFullName } from '@/lib/data';
import { PROFILE_AXES, profileValues } from '@/lib/profile';

/** Farbe pro Spalte: erstes Bike Akzent, zweites hell, drittes gestrichelt. */
const TONES: readonly RadarTone[] = ['accent', 'ink', 'muted'];

const DOT: Record<RadarTone, string> = {
  accent: 'bg-accent',
  ink: 'bg-ink',
  muted: 'border border-dashed border-ink-subtle',
};

/** Einsatzprofil aller Bikes übereinander (Radar-Overlay) und als kleine Tabelle. */
export function CompareProfile({ items }: { items: readonly CompareItem[] }) {
  const series: RadarSeries[] = items.map((item, index) => ({
    id: item.model.id,
    name: getModelFullName(item.model),
    values: profileValues(item.generation.scores),
    tone: TONES[index] ?? 'muted',
  }));
  // Neue Generation gewählt → Netz baut sich neu auf
  const animationKey = items.map((item) => item.generation.id).join('|');

  return (
    <Section title={t.compare.profileTitle} aside={<EditorialLabel />}>
      <Card className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div className="mx-auto w-full max-w-[22rem] px-6 sm:px-8">
          <RadarChart
            axes={PROFILE_AXES}
            series={series}
            label={t.compare.profileTitle}
            animationKey={animationKey}
          />
        </div>

        <div className="min-w-0">
          <RadarLegend series={series} />
          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 text-left font-medium text-ink-muted">
                  <span className="sr-only">{t.compare.specColumn}</span>
                </th>
                {items.map((item, index) => (
                  <th key={item.model.id} scope="col" className="px-2 py-2 text-right font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className={cn('size-2 rounded-full', DOT[TONES[index] ?? 'muted'])}
                      />
                      <span className="max-w-[6rem] truncate sm:max-w-none">{item.model.name}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROFILE_AXES.map((axis, axisIndex) => (
                <tr key={axis.key} className="border-b border-line last:border-b-0">
                  <th scope="row" className="py-2 text-left font-normal text-ink-muted">
                    {axis.label}
                  </th>
                  {series.map((item) => (
                    <td key={item.id} className="px-2 py-2 text-right font-semibold tabular-nums">
                      {item.values[axisIndex]}
                      <span className="text-ink-subtle">/10</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}
