import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

export default function NotFoundPage() {
  usePageMeta({ title: t.notFound.title });
  return (
    <Container className="py-16 sm:py-24">
      <PageHeader eyebrow="404" title={t.notFound.title} lead={t.notFound.text} />
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/bikes">{t.common.toCatalog}</ButtonLink>
        <ButtonLink to="/" variant="secondary">
          {t.common.backToHome}
        </ButtonLink>
      </div>
    </Container>
  );
}
