import { AnimatePresence, motion } from 'motion/react';
import { MatchResults } from '@/components/match/MatchResults';
import { MatchWizard } from '@/components/match/MatchWizard';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMatchWizard } from '@/hooks/useMatchWizard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { completeAnswers } from '@/lib/matchAnswers';
import { duration, ease } from '@/lib/motion';

const crossfade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.instant, ease: ease.in } },
};

export default function MatchPage() {
  const wizard = useMatchWizard();
  const answers = wizard.view === 'result' ? completeAnswers(wizard.draft) : null;

  usePageMeta(
    answers
      ? { title: t.match.results.title, description: t.pages.match.description }
      : { title: t.pages.match.title, description: t.pages.match.description },
  );

  return (
    <Container className="pt-8 pb-16 sm:pt-12 sm:pb-24">
      <AnimatePresence mode="wait" initial={false}>
        {answers ? (
          <motion.div key="results" {...crossfade}>
            <MatchResults answers={answers} onEdit={wizard.goTo} onRestart={wizard.restart} />
          </motion.div>
        ) : (
          <motion.div key="wizard" {...crossfade}>
            <PageHeader
              eyebrow={t.match.eyebrow}
              title={t.match.title}
              lead={t.match.lead}
              className="mx-auto text-center"
            />
            <MatchWizard
              draft={wizard.draft}
              view={typeof wizard.view === 'number' ? wizard.view : 0}
              onNext={wizard.next}
              onBack={wizard.back}
              onResult={wizard.toResult}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
