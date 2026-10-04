import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { Card, Section } from '@/components/ui/Section';
import type { Generation } from '@/data/schema';
import { t } from '@/i18n';
import { DETAIL_SPEC_GROUPS, visibleSpecs, type SpecDefinition } from '@/lib/specs';

function SpecRow({ spec, generation }: { spec: SpecDefinition; generation: Generation }) {
  const value = spec.display(generation);
  const detail = spec.detail?.(generation);
  const kind = spec.kind?.(generation);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 border-b border-line py-3 last:border-b-0">
      <dt className="text-sm text-ink-muted">{spec.label}</dt>
      <dd className="flex items-center justify-end gap-1 text-right font-medium tabular-nums">
        {value ?? (
          <span className="text-ink-subtle" title={t.data.notAvailableLong}>
            {t.data.notAvailable}
          </span>
        )}
        {value && kind && (
          <InfoTooltip label={t.data.sourceOf(spec.label)} align="end">
            {t.data.kind[kind]}
          </InfoTooltip>
        )}
      </dd>
      {detail && value && (
        <dd className="col-span-2 text-right text-xs text-ink-subtle">{detail}</dd>
      )}
    </div>
  );
}

/** Technische Daten in Gruppen. Kernfelder immer, optionale nur mit Wert. */
export function SpecList({ generation }: { generation: Generation }) {
  return (
    <Section title={t.detail.techData}>
      <div className="grid gap-4 md:grid-cols-2">
        {DETAIL_SPEC_GROUPS.map((group) => (
          <Card key={group.id}>
            <h3 className="mb-1 text-lg font-semibold">{t.detail.groups[group.id]}</h3>
            <dl>
              {visibleSpecs(group.keys, generation).map((spec) => (
                <SpecRow key={spec.key} spec={spec} generation={generation} />
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </Section>
  );
}
