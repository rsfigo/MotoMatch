import { Pencil } from 'lucide-react';
import { t } from '@/i18n';
import { formatChf } from '@/lib/format';
import type { MatchAnswers } from '@/lib/match';
import { MATCH_STEPS, type MatchStep } from '@/lib/matchAnswers';

/** Antwort als kurzer Text, z. B. «bis CHF 9’000.–». */
function answerText(step: MatchStep, answers: MatchAnswers): string {
  switch (step) {
    case 'licence':
      return t.match.licenceOptions[answers.licence].label;
    case 'height':
      return t.match.heightValue(answers.heightCm);
    case 'budget':
      return answers.budgetChf === null
        ? t.match.budgetAnyValue
        : t.match.budgetValue(formatChf(answers.budgetChf));
    case 'purpose':
      return t.match.listAnd(answers.purposes.map((purpose) => t.match.purposes[purpose].label));
    case 'experience':
      return t.match.experienceOptions[answers.experience].label;
    case 'preferences':
      return t.match.preferencesValue(
        t.match.importance[answers.soundImportance],
        t.match.importance[answers.tuningImportance],
      );
  }
}

/** Die Antworten als Chips – ein Klick führt zurück zur Frage. */
export function AnswerSummary({
  answers,
  onEdit,
}: {
  answers: MatchAnswers;
  onEdit: (step: number) => void;
}) {
  return (
    <section aria-labelledby="match-answers">
      <h2 id="match-answers" className="text-sm font-semibold text-ink-muted">
        {t.match.results.answersTitle}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {MATCH_STEPS.map((step, index) => {
          const label = t.match.summary[step];
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => onEdit(index)}
                title={t.match.editAnswer(label)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm hover:border-line-strong hover:bg-surface-2"
              >
                <span className="text-ink-muted">{label}:</span>
                <span className="font-medium">{answerText(step, answers)}</span>
                <Pencil
                  aria-hidden="true"
                  className="size-3.5 text-ink-subtle group-hover:text-accent-ink"
                />
                <span className="sr-only">– {t.match.editAnswer(label)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
