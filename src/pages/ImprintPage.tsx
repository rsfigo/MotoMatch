import { LegalPage } from '@/components/layout/LegalPage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

/** Impressum – Platzhalter in [eckigen Klammern] vor dem Livegang ergänzen (siehe DECISIONS.md). */
export default function ImprintPage() {
  usePageMeta({ title: t.pages.imprint.title, description: t.pages.imprint.description });
  return (
    <LegalPage
      title={t.pages.imprint.title}
      lead={t.legal.imprint.lead}
      sections={t.legal.imprint.sections}
    />
  );
}
