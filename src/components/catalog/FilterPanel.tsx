import { RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Switch } from '@/components/ui/Switch';
import type { Category, Feature, Manufacturer } from '@/data/schema';
import { t } from '@/i18n';
import { valueBounds, type CatalogEntry, type CatalogFilters } from '@/lib/catalog';
import { formatChf, formatDisplacement, formatNumber, NBSP } from '@/lib/format';
import type { LicenceCategory } from '@/lib/licence';

interface FilterPanelProps {
  filters: CatalogFilters;
  onChange: (update: Partial<CatalogFilters>) => void;
  onReset: () => void;
  /** Alle Einträge (ungefiltert) – daraus ergeben sich Optionen und Grenzen. */
  entries: readonly CatalogEntry[];
  manufacturers: readonly Manufacturer[];
  features: readonly Feature[];
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/** Fügt einen Wert hinzu oder entfernt ihn aus einer Liste. */
function toggleValue<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value];
}

/** Rundet Grenzen auf «schöne» Werte, damit der Regler in sinnvollen Schritten läuft. */
function roundedBounds(bounds: { min: number; max: number }, step: number) {
  return { min: Math.floor(bounds.min / step) * step, max: Math.ceil(bounds.max / step) * step };
}

type LicenceOption = LicenceCategory | 'all';

const LICENCE_OPTIONS: readonly { value: LicenceOption; label: string }[] = [
  { value: 'all', label: t.catalog.filter.licenceAll },
  { value: 'A1', label: t.licence.short.A1 },
  { value: 'A_LIMITED', label: t.licence.short.A_LIMITED },
  { value: 'A', label: t.licence.short.A },
];

/** Alle Filter des Katalogs. Optionen erscheinen nur, wenn es passende Bikes gibt. */
export function FilterPanel({
  filters,
  onChange,
  onReset,
  entries,
  manufacturers,
  features,
}: FilterPanelProps) {
  const usedManufacturerIds = new Set(entries.map((entry) => entry.model.manufacturerId));
  const usedCategories = [...new Set(entries.map((entry) => entry.model.category))].sort();
  const usedCylinders = [
    ...new Set(entries.map((entry) => entry.generation.engine.cylinders)),
  ].sort((a, b) => a - b);
  const usedExtraKeys = new Set(
    entries.flatMap((entry) => (entry.generation.extras ?? []).map((extra) => extra.key)),
  );

  const price = roundedBounds(
    valueBounds(entries, (entry) => entry.generation.price.chf),
    500,
  );
  const power = roundedBounds(
    valueBounds(entries, (entry) => entry.powerPs),
    5,
  );
  const displacement = roundedBounds(
    valueBounds(entries, (entry) => entry.generation.engine.displacementCc),
    25,
  );

  return (
    <div className="space-y-7">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-ink">{t.catalog.filter.licence}</legend>
        <SegmentedControl
          label={t.catalog.filter.licence}
          options={LICENCE_OPTIONS}
          value={filters.licence ?? 'all'}
          onChange={(value) => onChange({ licence: value === 'all' ? null : value })}
        />
        <Switch
          label={t.catalog.filter.includeThrottled}
          hint={t.catalog.filter.includeThrottledHint}
          checked={filters.includeThrottled}
          disabled={filters.licence !== 'A_LIMITED'}
          onChange={(includeThrottled) => onChange({ includeThrottled })}
        />
      </fieldset>

      <FilterSection title={t.catalog.filter.manufacturers}>
        {manufacturers
          .filter((manufacturer) => usedManufacturerIds.has(manufacturer.id))
          .map((manufacturer) => (
            <Chip
              key={manufacturer.id}
              selected={filters.manufacturers.includes(manufacturer.id)}
              onClick={() =>
                onChange({ manufacturers: toggleValue(filters.manufacturers, manufacturer.id) })
              }
            >
              {manufacturer.name}
            </Chip>
          ))}
      </FilterSection>

      <FilterSection title={t.catalog.filter.categories}>
        {usedCategories.map((category: Category) => (
          <Chip
            key={category}
            selected={filters.categories.includes(category)}
            onClick={() => onChange({ categories: toggleValue(filters.categories, category) })}
          >
            {t.categories[category]}
          </Chip>
        ))}
      </FilterSection>

      <RangeSlider
        label={t.catalog.filter.price}
        min={price.min}
        max={price.max}
        step={500}
        value={filters.price}
        onChange={(range) => onChange({ price: range })}
        format={formatChf}
      />
      <RangeSlider
        label={t.catalog.filter.power}
        min={power.min}
        max={power.max}
        step={5}
        value={filters.power}
        onChange={(range) => onChange({ power: range })}
        format={(ps) => `${formatNumber(ps)}${NBSP}PS`}
      />
      <RangeSlider
        label={t.catalog.filter.displacement}
        min={displacement.min}
        max={displacement.max}
        step={25}
        value={filters.displacement}
        onChange={(range) => onChange({ displacement: range })}
        format={formatDisplacement}
      />

      <FilterSection title={t.catalog.filter.cylinders}>
        {usedCylinders.map((cylinders) => (
          <Chip
            key={cylinders}
            selected={filters.cylinders.includes(cylinders)}
            onClick={() => onChange({ cylinders: toggleValue(filters.cylinders, cylinders) })}
            className="min-w-11 justify-center"
          >
            {cylinders}
          </Chip>
        ))}
      </FilterSection>

      <fieldset className="space-y-1">
        <legend className="text-sm font-semibold text-ink">{t.catalog.filter.equipment}</legend>
        <p className="pb-1 text-xs text-ink-muted">{t.catalog.filter.equipmentHint}</p>
        <Switch
          label={t.catalog.filter.throttleable}
          checked={filters.throttleable}
          onChange={(throttleable) => onChange({ throttleable })}
        />
        <Switch
          label={t.catalog.filter.quickshifter}
          checked={filters.quickshifter}
          onChange={(quickshifter) => onChange({ quickshifter })}
        />
        <Switch
          label={t.catalog.filter.blipper}
          checked={filters.blipper}
          onChange={(blipper) => onChange({ blipper })}
        />
      </fieldset>

      {usedExtraKeys.size > 0 && (
        <FilterSection title={t.catalog.filter.extras}>
          {features
            .filter((feature) => usedExtraKeys.has(feature.key))
            .map((feature) => (
              <Chip
                key={feature.key}
                selected={filters.extras.includes(feature.key)}
                onClick={() => onChange({ extras: toggleValue(filters.extras, feature.key) })}
                title={feature.description}
              >
                {feature.label}
              </Chip>
            ))}
        </FilterSection>
      )}

      <Button variant="ghost" size="sm" onClick={onReset} className="-ml-2">
        <RotateCcw aria-hidden="true" className="size-4" />
        {t.catalog.resetFilters}
      </Button>
    </div>
  );
}
