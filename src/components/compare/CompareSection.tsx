import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { t } from '@/i18n';
import { duration, ease, spring } from '@/lib/motion';

interface CompareSectionProps {
  title: string;
  /** Spaltenköpfe für Screenreader (Namen der Bikes) */
  columnNames: readonly string[];
  /** Keine Zeilen übrig, z. B. bei «Nur Unterschiede», wenn alles gleich ist */
  empty: boolean;
  children: ReactNode;
}

/**
 * Aufklappbarer Abschnitt der Vergleichstabelle (z. B. «Motor & Leistung»).
 *
 * Auf- und Zuklappen bewegt nur transform und opacity: Der Inhalt blendet ein bzw. aus,
 * die folgenden Abschnitte gleiten per Layout-Animation an ihren neuen Platz
 * (dafür stecken alle Abschnitte in einer gemeinsamen LayoutGroup).
 */
export function CompareSection({ title, columnNames, empty, children }: CompareSectionProps) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();

  return (
    <motion.section
      layout="position"
      transition={{ layout: spring.layout }}
      className="relative bg-canvas"
    >
      {/* 100cqw = sichtbare Breite: Der Titel bleibt beim seitlichen Wischen stehen */}
      <h2 className="sticky left-0 w-[100cqw]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-3 border-b border-line-strong pt-10 pb-3 text-left text-xl font-bold sm:text-2xl"
        >
          {title}
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 0 : -90 }}
            transition={spring.snappy}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-muted"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>
      </h2>

      <AnimatePresence initial={false} mode="popLayout">
        {open && (
          <motion.div
            key="body"
            id={bodyId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: duration.instant, ease: ease.in } }}
          >
            {empty ? (
              <p className="sticky left-0 w-[100cqw] py-4 text-sm text-ink-muted">
                {t.compare.noDifferences}
              </p>
            ) : (
              <div role="table" aria-label={title}>
                <div role="rowgroup" className="sr-only">
                  <div role="row">
                    <span role="columnheader">{t.compare.specColumn}</span>
                    {columnNames.map((name) => (
                      <span key={name} role="columnheader">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div role="rowgroup" className="relative">
                  {children}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
