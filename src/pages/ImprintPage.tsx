import { LegalPage } from '@/components/layout/LegalPage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

/**
 * Impressum – Name, Adresse und E-Mail kommen aus VITE_OPERATOR_* (siehe src/lib/legal.ts);
 * ohne Werte erscheinen die Platzhalter in [eckigen Klammern].
 */
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
