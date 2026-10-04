import { ArrowRight, Trash2, X } from 'lucide-react';
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useLoadedBikeData } from '@/hooks/useBikeData';
import { useCompareSelection } from '@/hooks/useCompareSelection';
import type { Manufacturer, Model } from '@/data/schema';
import { t } from '@/i18n';
import { compareUrl, MAX_COMPARE, MIN_COMPARE } from '@/lib/compareSelection';
import { compareStore } from '@/lib/compareStore';
import { modelFullName } from '@/lib/data';
import { duration, ease, spring } from '@/lib/motion';

/** Feder für den Flug des Mini-Bilds von der Karte in die Leiste. */
const FLY = { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 } as const;

/**
 * Ein belegter Platz in der Leiste. Wurde das Bike gerade gewählt, startet das Mini-Bild
 * an der Position der Karte und fliegt in seinen Platz: Es wird dort hin versetzt und
 * skaliert und federt dann zurück auf 0.
 */
function CompareSlot({
  model,
  manufacturers,
}: {
  model: Model;
  manufacturers: readonly Manufacturer[];
}) {
  const id = model.id;
  const thumbRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const origin = compareStore.getFlyOrigin(id);
    const thumb = thumbRef.current;
    if (!origin || !thumb || reduceMotion) return;

    const target = thumb.getBoundingClientRect();
    x.set(origin.left + origin.width / 2 - (target.left + target.width / 2));
    y.set(origin.top + origin.height / 2 - (target.top + target.height / 2));
    scale.set(Math.min(origin.width / target.width, 6));

    const controls = [animate(x, 0, FLY), animate(y, 0, FLY), animate(scale, 1, FLY)];
    return () => controls.forEach((control) => control.stop());
  }, [id, reduceMotion, x, y, scale]);

  const name = modelFullName(model, manufacturers);
  const manufacturerName = manufacturers.find((item) => item.id === model.manufacturerId)?.name;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: duration.fast, ease: ease.in } }}
      transition={{ layout: spring.snappy }}
      className="group relative flex min-w-0 items-center gap-2 rounded-control border border-line bg-surface p-1.5 sm:flex-1 sm:pr-8"
    >
      <motion.div
        ref={thumbRef}
        style={{ x, y, scale }}
        className="relative z-10 grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-surface-2"
      >
        <BikeSilhouette category={model.category} className="w-12" />
      </motion.div>
      <span className="hidden min-w-0 leading-tight sm:block">
        <span className="block truncate text-[11px] text-ink-muted">{manufacturerName}</span>
        <span className="block truncate text-sm font-semibold">{model.name}</span>
      </span>
      <button
        type="button"
        onClick={() => compareStore.remove(id)}
        aria-label={t.compareBar.remove(name)}
        className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border border-line-strong bg-canvas text-ink-muted hover:text-ink sm:top-1/2 sm:right-1.5 sm:-translate-y-1/2 sm:border-0 sm:bg-transparent"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </motion.li>
  );
}

function EmptySlot() {
  return (
    <li
      aria-hidden="true"
      className="hidden h-[3.25rem] w-[4.25rem] shrink-0 rounded-control border border-dashed border-line-strong xs:block sm:w-auto sm:flex-1"
    />
  );
}

/** Leiste am unteren Rand: erscheint, sobald ein Bike zum Vergleich gewählt ist. */
export function CompareBar() {
  const { ids, clear } = useCompareSelection();
  const loaded = useLoadedBikeData();
  const { pathname } = useLocation();
  // Erst zeigen, wenn die Modelle geladen sind (Namen und Bilder der Slots)
  const visible = loaded !== undefined && ids.length > 0 && pathname !== '/compare';
  const selected = loaded
    ? ids.flatMap((id) => loaded.models.filter((model) => model.id === id))
    : [];
  const canCompare = ids.length >= MIN_COMPARE;

  return (
    <>
      {/* Platzhalter, damit die Leiste den Seitenfuss nicht verdeckt */}
      {visible && <div aria-hidden="true" className="h-24" />}
      <AnimatePresence>
        {visible && (
          <motion.aside
            aria-label={t.compareBar.label}
            initial={{ y: '130%' }}
            animate={{ y: 0, transition: spring.gentle }}
            exit={{ y: '130%', transition: { duration: duration.base, ease: ease.in } }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
          >
            <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-panel border border-line-strong bg-glass p-2 shadow-raised backdrop-blur-xl backdrop-saturate-150 sm:gap-3 sm:p-2.5">
              <p className="sr-only" aria-live="polite">
                {t.compareBar.title}: {t.compareBar.count(ids.length)}
              </p>
              <ul className="flex min-w-0 flex-1 items-center gap-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {selected.map((model) => (
                    <CompareSlot
                      key={model.id}
                      model={model}
                      manufacturers={loaded?.manufacturers ?? []}
                    />
                  ))}
                </AnimatePresence>
                {Array.from({ length: MAX_COMPARE - ids.length }, (_, index) => (
                  <EmptySlot key={`empty-${index}`} />
                ))}
              </ul>
              <button
                type="button"
                onClick={clear}
                aria-label={t.compareBar.clear}
                title={t.compareBar.clear}
                className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </button>
              {canCompare ? (
                <ButtonLink to={compareUrl(ids)} size="md" className="shrink-0 px-4">
                  {t.compareBar.compareNow}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
              ) : (
                <>
                  <span className="hidden shrink-0 text-xs text-ink-muted md:block">
                    {t.compareBar.needMore}
                  </span>
                  <Button disabled size="md" className="shrink-0 px-4">
                    {t.compareBar.compareNow}
                  </Button>
                </>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
