import { FeatureIcon } from '@/components/bike/FeatureIcon';
import { Badge } from '@/components/ui/Badge';
import { Card, Section } from '@/components/ui/Section';
import type { Feature, Generation } from '@/data/schema';
import { t } from '@/i18n';
import { groupExtras } from '@/lib/extras';

interface ExtrasSectionProps {
  generation: Generation;
  features: readonly Feature[];
}

/**
 * Ausstattung: zeigt nur, was das Bike wirklich hat (Serie oder optional).
 * Keine leeren Zeilen, kein «Nein» – ohne Extras verschwindet der ganze Abschnitt.
 */
export function ExtrasSection({ generation, features }: ExtrasSectionProps) {
  const groups = groupExtras(generation.extras, features);
  if (groups.length === 0) return null;

  return (
    <Section title={t.detail.extrasTitle} lead={t.detail.extrasLead}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.group}>
            <h3 className="mb-3 text-lg font-semibold">{t.featureGroups[group.group]}</h3>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item.feature.key} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-muted">
                    <FeatureIcon name={item.feature.icon} className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 font-medium">
                      {item.feature.label}
                      {item.availability === 'optional' && (
                        <Badge tone="accent">{t.detail.optional}</Badge>
                      )}
                    </span>
                    {(item.detail ?? item.feature.description) && (
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {item.detail ?? item.feature.description}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
