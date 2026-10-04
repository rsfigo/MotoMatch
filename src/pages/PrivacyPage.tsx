import { LegalPage } from '@/components/layout/LegalPage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

/**
 * Datenschutz – beschreibt, was die App tatsächlich tut (keine Cookies, localStorage,
 * YouTube erst nach Klick). Platzhalter in [eckigen Klammern] vor dem Livegang ergänzen.
 */
export default function PrivacyPage() {
  usePageMeta({ title: t.pages.privacy.title, description: t.pages.privacy.description });
  return (
    <LegalPage
      title={t.pages.privacy.title}
      lead={t.legal.privacy.lead}
      sections={t.legal.privacy.sections}
      asOf={t.legal.privacy.asOf}
    />
  );
}
