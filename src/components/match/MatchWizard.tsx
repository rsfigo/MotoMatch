import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import {
  completeAnswers,
  isStepAnswered,
  MATCH_STEPS,
  withStepDefaults,
  type MatchDraft,
  type MatchStep,
} from '@/lib/matchAnswers';
import { duration, ease } from '@/lib/motion';
import { STEP_CONTENT } from './WizardSteps';
import { WizardProgress } from './WizardProgress';

/** Höhe der Kopfzeile: So weit muss beim Schrittwechsel mindestens Platz sein. */
const HEADER_OFFSET_PX = 80;

/** Neue Frage schiebt sich in Laufrichtung herein (vorwärts von rechts, zurück von links). */
const stepVariants: Variants = {
  enter: (direction: number) => ({ x: direction * 40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: (direction: number) => ({
    x: direction * -40,
    opacity: 0,
    transition: { duration: duration.instant, ease: ease.in },
  }),
};

interface MatchWizardProps {
  draft: MatchDraft;
  /** Index der aktuellen Frage */
  view: number;
  onNext: (patch: MatchDraft) => void;
  onBack: () => void;
  onResult: (patch: MatchDraft) => void;
}

/** Eine Frage: Überschrift (bekommt nach dem Wechsel den Fokus) und Antworten. */
function StepPanel({
  step,
  answers,
  onChange,
  focusOnMount,
}: {
  step: MatchStep;
  answers: MatchDraft;
  onChange: (patch: MatchDraft) => void;
  focusOnMount: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const Content = STEP_CONTENT[step];
  const texts = t.match.steps[step];

  useEffect(() => {
    if (!focusOnMount) return;
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    // Liegt die Frage oberhalb des sichtbaren Bereichs (z. B. nach «Weiter» ganz unten), hochscrollen
    const top = heading.getBoundingClientRect().top;
    if (top < HEADER_OFFSET_PX) {
      window.scrollTo({
        top: window.scrollY + top - HEADER_OFFSET_PX - 24,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [focusOnMount, reduceMotion]);

  return (
    <fieldset>
      <legend className="w-full">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">
          {texts.title}
        </h2>
      </legend>
      <p className="mt-2 text-sm text-ink-muted sm:text-base">{texts.hint}</p>
      <div className="mt-6 sm:mt-8">
        <Content answers={answers} onChange={onChange} />
      </div>
    </fieldset>
  );
}

/**
 * Der Fragebogen: Fortschritt, die aktuelle Frage (schiebt animiert herein) und Navigation.
 * Antworten der aktuellen Frage bleiben lokal, bis man weitergeht.
 */
export function MatchWizard({ draft, view, onNext, onBack, onResult }: MatchWizardProps) {
  const step = MATCH_STEPS[view] ?? 'licence';
  const total = MATCH_STEPS.length;

  // Antworten der aktuellen Frage – gehören zur Frage, bei der sie gegeben wurden
  const [local, setLocal] = useState<{ view: number; patch: MatchDraft }>({ view, patch: {} });
  const patch = local.view === view ? local.patch : {};
  const answers = withStepDefaults(step, { ...draft, ...patch });

  // Laufrichtung für die Animation; Fokus erst nach dem ersten Wechsel setzen
  const [previousView, setPreviousView] = useState(view);
  const [direction, setDirection] = useState(1);
  const [navigated, setNavigated] = useState(false);
  if (previousView !== view) {
    setDirection(view > previousView ? 1 : -1);
    setPreviousView(view);
    setNavigated(true);
  }

  const canContinue = isStepAnswered(step, answers);
  const isLast = view === total - 1;
  const allAnswered = completeAnswers(answers) !== null;

  function update(next: MatchDraft) {
    setLocal({ view, patch: { ...patch, ...next } });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (canContinue) onNext(patch);
  }

  return (
    <div className="relative mx-auto mt-10 max-w-2xl sm:mt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-72 rounded-full bg-[radial-gradient(closest-side,var(--mm-accent-soft),transparent)] md:-inset-x-10"
      />
      <form
        onSubmit={submit}
        className="relative overflow-x-clip rounded-panel border border-line bg-surface p-5 shadow-raised sm:p-8"
      >
        <WizardProgress step={view} total={total} />

        <div className="mt-8">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StepPanel step={step} answers={answers} onChange={update} focusOnMount={navigated} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between gap-2">
          {view > 0 ? (
            <Button type="button" variant="ghost" onClick={onBack} className="-ml-2 shrink-0 px-3">
              <ArrowLeft aria-hidden="true" className="size-4" />
              {/* Auf dem Handy nur der Pfeil – so passen beide Knöpfe in eine Zeile */}
              <span className="sr-only xs:not-sr-only">{t.match.back}</span>
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap justify-end gap-2">
            {allAnswered && !isLast && (
              <Button type="button" variant="secondary" onClick={() => onResult(patch)}>
                {t.match.toResult}
              </Button>
            )}
            <Button type="submit" disabled={!canContinue}>
              {isLast ? t.match.showResults : t.match.next}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
