import { Columns3, Info, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useModels } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import { compareUrl, MIN_COMPARE } from '@/lib/compareSelection';
import { matchBikes, RESULT_MIN, type MatchAnswers } from '@/lib/match';
import { staggerContainer } from '@/lib/motion';
import { AnswerSummary } from './AnswerSummary';
import { MatchResultCard } from './MatchResultCard';

interface MatchResultsProps {
  answers: MatchAnswers;
  onEdit: (step: number) => void;
  onRestart: () => void;
}

/** Ergebnis: 3–5 Bikes mit Match-Prozent, Begründungen und dem Weg in den Vergleich. */
export function MatchResults({ answers, onEdit, onRestart }: MatchResultsProps) {
  const models = useModels();
  const results = matchBikes(models, answers);
  const top = results.slice(0, 3).map((result) => result.model.id);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={t.match.results.eyebrow}
        title={t.match.results.title}
        lead={t.match.results.lead}
      />

      <div className="mt-8">
        <AnswerSummary answers={answers} onEdit={onEdit} />
      </div>

      {results.length < RESULT_MIN && (
        <p className="mt-8 flex gap-3 rounded-card border border-line bg-surface-2 p-4 text-sm">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-ink" />
          {results.length === 0
            ? t.match.results.noResults
            : t.match.results.fewResults(results.length)}
        </p>
      )}

      <motion.ol
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
        className="mt-8 space-y-4"
      >
        {results.map((result, index) => (
          <MatchResultCard key={result.model.id} result={result} rank={index + 1} />
        ))}
      </motion.ol>

      <div className="mt-8 flex flex-col gap-3 xs:flex-row">
        {top.length >= MIN_COMPARE && (
          <ButtonLink to={compareUrl(top)} size="lg">
            <Columns3 aria-hidden="true" className="size-4" />
            {t.match.results.compareTop(top.length)}
          </ButtonLink>
        )}
        <Button size="lg" variant="secondary" onClick={onRestart}>
          <RotateCcw aria-hidden="true" className="size-4" />
          {t.match.results.restart}
        </Button>
      </div>

      <p className="mt-8 text-sm text-ink-muted">{t.match.results.disclaimer}</p>

      <details className="group mt-6 rounded-card border border-line bg-surface p-5 open:pb-6">
        <summary className="cursor-pointer list-none font-semibold marker:hidden">
          <span className="inline-flex items-center gap-2">
            <Info aria-hidden="true" className="size-4 text-accent-ink" />
            {t.match.results.howTitle}
          </span>
        </summary>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {t.match.results.how.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
