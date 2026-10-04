import { Construction } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { t } from '@/i18n';
import { Container } from './Container';
import { PageHeader } from './PageHeader';

/** Platzhalter für Seiten, die in einem späteren Meilenstein entstehen. */
export function ComingSoon({ title, lead }: { title: string; lead: string }) {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader title={title} lead={lead} />
      <div className="mt-10 flex flex-col items-start gap-5 rounded-panel border border-dashed border-line-strong bg-surface p-6 sm:p-8">
        <Construction aria-hidden="true" className="size-6 text-accent-ink" />
        <p className="text-ink-muted">{t.common.comingSoon}</p>
        <ButtonLink to="/bikes" variant="secondary">
          {t.common.toCatalog}
        </ButtonLink>
      </div>
    </Container>
  );
}
