import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

/** Platzhalter – vor dem Livegang mit echten Angaben füllen (siehe DECISIONS.md). */
export default function ImprintPage() {
  usePageMeta({ title: t.pages.imprint.title, description: t.pages.imprint.description });
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader title={t.pages.imprint.title} />
      <div className="mt-8 max-w-2xl space-y-4 text-ink-muted">
        <p>[Vorname Nachname]</p>
        <p>
          [Strasse Nr.]
          <br />
          [PLZ Ort]
          <br />
          Schweiz
        </p>
        <p>E-Mail: [adresse@example.ch]</p>
        <p className="text-sm text-ink-subtle">{t.footer.disclaimer}</p>
      </div>
    </Container>
  );
}
