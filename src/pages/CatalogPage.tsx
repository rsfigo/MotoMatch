import { useMemo, useState } from 'react';
import { BikeGrid } from '@/components/catalog/BikeGrid';
import { CatalogToolbar } from '@/components/catalog/CatalogToolbar';
import { EmptyState } from '@/components/catalog/EmptyState';
import { FilterPanel } from '@/components/catalog/FilterPanel';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useFeatures, useManufacturers, useModels } from '@/hooks/useBikeData';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { applyCatalogFilters, countActiveFilters, toCatalogEntry } from '@/lib/catalog';

export default function CatalogPage() {
  usePageMeta({ title: t.pages.catalog.title, description: t.pages.catalog.description });

  const models = useModels();
  const manufacturers = useManufacturers();
  const features = useFeatures();
  const { filters, updateFilters, resetFilters } = useCatalogFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const entries = useMemo(() => {
    const manufacturersById = new Map(
      manufacturers.map((manufacturer) => [manufacturer.id, manufacturer]),
    );
    return models.map((model) =>
      toCatalogEntry(
        model,
        manufacturersById.get(model.manufacturerId),
        t.categories[model.category],
      ),
    );
  }, [models, manufacturers]);

  const results = useMemo(() => applyCatalogFilters(entries, filters), [entries, filters]);

  const filterPanel = (
    <FilterPanel
      filters={filters}
      onChange={updateFilters}
      onReset={resetFilters}
      entries={entries}
      manufacturers={manufacturers}
      features={features}
    />
  );

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrow={t.catalog.eyebrow}
        title={t.pages.catalog.title}
        lead={t.pages.catalog.description}
      />

      <div className="mt-8">
        <CatalogToolbar
          query={filters.query}
          onQueryChange={(query) => updateFilters({ query })}
          sort={filters.sort}
          onSortChange={(sort) => updateFilters({ sort })}
          activeFilterCount={countActiveFilters(filters)}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-8">
        {/* Filter auf grossen Bildschirmen als Seitenleiste */}
        <aside aria-label={t.catalog.filters} className="hidden lg:block">
          <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain pr-2 pb-6">
            {filterPanel}
          </div>
        </aside>

        <section aria-labelledby="catalog-results">
          <h2 id="catalog-results" className="sr-only">
            {t.catalog.resultsHeading}
          </h2>
          <p aria-live="polite" className="mb-4 text-sm text-ink-muted tabular-nums">
            {t.catalog.resultCount(results.length)}
          </p>
          {results.length > 0 ? (
            <BikeGrid entries={results} />
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </section>
      </div>

      {/* Filter auf kleinen Bildschirmen als Panel von unten */}
      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t.catalog.filters}
        closeLabel={t.catalog.closeFilters}
        footer={
          <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
            {t.catalog.showResults(results.length)}
          </Button>
        }
      >
        {filterPanel}
      </Sheet>
    </Container>
  );
}
