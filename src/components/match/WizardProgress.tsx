import { motion } from 'motion/react';
import { t } from '@/i18n';
import { spring } from '@/lib/motion';

/** Fortschrittsbalken über dem Wizard («Frage 2 von 6»). Wächst per scaleX. */
export function WizardProgress({ step, total }: { step: number; total: number }) {
  const text = t.match.progress(step + 1, total);

  return (
    <div>
      <p aria-hidden="true" className="text-xs font-semibold text-ink-muted tabular-nums">
        {text}
      </p>
      <div
        role="progressbar"
        aria-label={t.match.progressLabel}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-valuetext={text}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-accent"
          initial={false}
          animate={{ scaleX: (step + 1) / total }}
          transition={spring.gentle}
        />
      </div>
    </div>
  );
}
