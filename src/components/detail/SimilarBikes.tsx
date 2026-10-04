import { BikeCard } from '@/components/bike/BikeCard';
import { Section } from '@/components/ui/Section';
import type { Manufacturer, Model } from '@/data/schema';
import { t } from '@/i18n';
import { toCatalogEntry } from '@/lib/catalog';
import { findSimilarModels } from '@/lib/similar';

interface SimilarBikesProps {
  model: Model;
  models: readonly Model[];
  manufacturers: readonly Manufacturer[];
}

export function SimilarBikes({ model, models, manufacturers }: SimilarBikesProps) {
  const similar = findSimilarModels(model, models, 3);
  if (similar.length === 0) return null;

  return (
    <Section title={t.detail.similarTitle}>
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {similar.map((other) => (
          <li key={other.id}>
            <BikeCard
              entry={toCatalogEntry(
                other,
                manufacturers.find((manufacturer) => manufacturer.id === other.manufacturerId),
                t.categories[other.category],
              )}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
