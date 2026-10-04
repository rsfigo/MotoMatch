import { Plus } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useFeatures } from '@/hooks/useBikeData';
import { useScrollSync } from '@/hooks/useScrollSync';
import { t } from '@/i18n';
import { buildCompareRows, buildExtraRows, type CompareItem } from '@/lib/compare';
import { getModelFullName } from '@/lib/data';
import { spring } from '@/lib/motion';
import { COMPARE_SECTIONS, SPECS } from '@/lib/specs';
import { CompareHeader } from './CompareHeader';
import { CompareProfile } from './CompareProfile';
import { ExtraRows, SpecRows } from './CompareRows';
import { CompareSection } from './CompareSection';
import { CompareVideos } from './CompareVideos';
import { rowColumns, tableWidth } from './compareGrid';
import { ShareButton } from './ShareButton';

/** Die Extras folgen auf diesen Abschnitt (Eckdaten, Motor, Fahrwerk, Extras, Tuning, Preis). */
const EXTRAS_AFTER = 'chassis';

interface CompareTableProps {
  items: readonly CompareItem[];
  /** Teilbarer Pfad des Vergleichs */
  sharePath: string;
  canAdd: boolean;
  onAdd: () => void;
  onRemove: (modelId: string) => void;
  onGenerationChange: (modelId: string, generationId: string) => void;
}

/**
 * Punkte zum Einrasten beim Wischen: je einer am Anfang jeder Bike-Spalte.
 * 1 px hoch, weil manche Browser leere Flächen beim Einrasten ignorieren.
 */
function SnapPoints({ count }: { count: number }) {
  return (
    <div aria-hidden="true" className="grid h-px" style={rowColumns(count)}>
      <span />
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="snap-start" />
      ))}
    </div>
  );
}

/** Mit nur einem Bike gibt es noch nichts zu vergleichen. */
function AddSecondBike({ onAdd }: { onAdd: () => void }) {
  return (
    <Container className="pt-8">
      <div className="flex flex-col items-center rounded-panel border border-dashed border-line-strong px-6 py-12 text-center">
        <p className="max-w-md text-ink-muted">{t.compare.addMore}</p>
        <Button onClick={onAdd} className="mt-5">
          <Plus aria-hidden="true" className="size-4" />
          {t.compare.addBike}
        </Button>
      </div>
    </Container>
  );
}

/**
 * Der eigentliche Vergleich: Werkzeugleiste, Sticky-Kopf, aufklappbare Abschnitte,
 * Radar-Overlay und Video-Reviews.
 *
 * Kopf und Tabelle teilen sich das Spaltenraster (compareGrid.ts). Auf dem Handy scrollt
 * die Tabelle seitlich mit Einrasten; der Kopf läuft mit (useScrollSync).
 */
export function CompareTable({
  items,
  sharePath,
  canAdd,
  onAdd,
  onRemove,
  onGenerationChange,
}: CompareTableProps) {
  const features = useFeatures();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [headerViewport, setHeaderViewport] = useState<HTMLDivElement | null>(null);
  const edges = useScrollSync(scroller, headerViewport);

  const comparing = items.length >= 2;
  const generations = items.map((item) => item.generation);
  const names = items.map((item) => getModelFullName(item.model));
  // Der Abschnitt «Extras» erscheint, sobald eines der Bikes Extras hat
  const hasExtras = buildExtraRows(generations, features).length > 0;
  const extraRows = buildExtraRows(generations, features, { onlyDifferences });

  const extrasSection = (
    <CompareSection
      key="extras"
      title={t.compare.sections.extras}
      columnNames={names}
      empty={extraRows.length === 0}
    >
      <ExtraRows rows={extraRows} items={items} />
    </CompareSection>
  );

  return (
    <LayoutGroup>
      {comparing && (
        <Container className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-6">
          <div className="w-full sm:w-auto sm:min-w-80">
            <Switch
              label={t.compare.onlyDifferences}
              hint={t.compare.onlyDifferencesHint}
              checked={onlyDifferences}
              onChange={setOnlyDifferences}
            />
          </div>
          <ShareButton path={sharePath} />
        </Container>
      )}

      <CompareHeader
        items={items}
        canAdd={canAdd}
        onAdd={onAdd}
        onRemove={onRemove}
        onGenerationChange={onGenerationChange}
        viewportRef={setHeaderViewport}
        edges={edges}
      />

      {comparing ? (
        <Container>
          <motion.div
            ref={setScroller}
            layoutScroll
            data-scrolled={!edges.atStart}
            className="group/scroll no-scrollbar @container snap-x snap-mandatory scroll-pl-(--label-w) overflow-x-auto overscroll-x-contain"
          >
            <div style={{ width: tableWidth(items.length) }}>
              <SnapPoints count={items.length} />
              {COMPARE_SECTIONS.flatMap((section) => {
                const rows = buildCompareRows(
                  section.keys.map((key) => SPECS[key]),
                  generations,
                  { onlyDifferences },
                );
                const node = (
                  <CompareSection
                    key={section.id}
                    title={t.compare.sections[section.id]}
                    columnNames={names}
                    empty={rows.length === 0}
                  >
                    <SpecRows rows={rows} items={items} />
                  </CompareSection>
                );
                return section.id === EXTRAS_AFTER && hasExtras ? [node, extrasSection] : [node];
              })}
            </div>
          </motion.div>
        </Container>
      ) : (
        <AddSecondBike onAdd={onAdd} />
      )}

      {comparing && (
        <motion.div layout="position" transition={{ layout: spring.layout }}>
          <Container className="space-y-16 py-16 sm:space-y-24 sm:py-24">
            <CompareProfile items={items} />
            <CompareVideos items={items} />
          </Container>
        </motion.div>
      )}
    </LayoutGroup>
  );
}
