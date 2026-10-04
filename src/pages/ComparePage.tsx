import { Columns3, Plus } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { AddBikePalette } from '@/components/compare/AddBikePalette';
import { CompareTable } from '@/components/compare/CompareTable';
import { GRID_VARS } from '@/components/compare/compareGrid';
import { PopularComparisons } from '@/components/compare/PopularComparisons';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useCompareItems } from '@/hooks/useCompareItems';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { getModelFullName } from '@/lib/data';

/** Noch kein Bike gewählt: Einstieg über die Suche, den Katalog oder einen beliebten Vergleich. */
function EmptyCompare({ onAdd }: { onAdd: () => void }) {
  return (
    <Container className="pt-10 pb-4 sm:pt-14">
      <div className="relative overflow-hidden rounded-panel border border-line bg-surface px-6 py-12 text-center shadow-card sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)]"
        />
        <div className="relative mx-auto flex max-w-lg flex-col items-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-line bg-surface-2 text-accent-ink">
            <Columns3 aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">{t.compare.emptyTitle}</h2>
          <p className="mt-3 text-ink-muted">{t.compare.emptyText}</p>
          <div className="mt-7 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row">
            <Button size="lg" onClick={onAdd}>
              <Plus aria-hidden="true" className="size-4" />
              {t.compare.addBike}
            </Button>
            <ButtonLink to="/bikes" size="lg" variant="secondary">
              {t.common.toCatalog}
            </ButtonLink>
          </div>
        </div>
      </div>

      <section className="mt-16 sm:mt-24">
        <h2 className="text-2xl font-bold sm:text-3xl">{t.compare.popularTitle}</h2>
        <p className="mt-2 mb-6 text-ink-muted">{t.compare.popularLead}</p>
        <PopularComparisons />
      </section>
    </Container>
  );
}

/** Nach dem Hinzufügen des dritten Bikes ist der Knopf «Bike hinzufügen» weg: Fokus aufs neue Bike. */
function focusLastBike(): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>('[data-compare-name]')].at(-1);
}

/** Titel «Yamaha MT-07 vs. Kawasaki Z650» – das «vs.» gedämpft. */
function CompareTitle({ names }: { names: readonly string[] }) {
  return (
    <header className="max-w-5xl">
      <p className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
        {t.compare.eyebrow}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
        {names.map((name, index) => (
          <Fragment key={name}>
            {index > 0 && <span className="font-medium text-ink-subtle"> {t.compare.vs} </span>}
            {name}
          </Fragment>
        ))}
      </h1>
    </header>
  );
}

export default function ComparePage() {
  const { items, sharePath, canAdd, add, remove, setGeneration } = useCompareItems();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const names = items.map((item) => getModelFullName(item.model));
  const comparing = items.length >= 2;

  usePageMeta(
    comparing
      ? { title: t.compare.titleWith(names), description: t.compare.metaDescription(names) }
      : { title: t.pages.compare.title, description: t.pages.compare.description },
  );

  // Strg+K (Mac: ⌘K) öffnet die Suche «Bike hinzufügen»
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      if (canAdd) setPaletteOpen(true);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canAdd]);

  const openPalette = () => setPaletteOpen(true);

  return (
    <div className={GRID_VARS}>
      <Container className="pt-8 pb-8 sm:pt-12">
        {comparing ? (
          <CompareTitle names={names} />
        ) : (
          <PageHeader title={t.pages.compare.title} lead={t.pages.compare.description} />
        )}
      </Container>

      {items.length === 0 ? (
        <EmptyCompare onAdd={openPalette} />
      ) : (
        <CompareTable
          items={items}
          sharePath={sharePath}
          canAdd={canAdd}
          onAdd={openPalette}
          onRemove={remove}
          onGenerationChange={setGeneration}
        />
      )}

      <AddBikePalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={add}
        excludeIds={items.map((item) => item.model.id)}
        fallbackFocus={focusLastBike}
      />
    </div>
  );
}
