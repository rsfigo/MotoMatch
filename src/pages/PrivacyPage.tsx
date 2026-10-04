import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

/** Platzhalter – wird in Meilenstein 6 ausformuliert (siehe DECISIONS.md). */
export default function PrivacyPage() {
  usePageMeta({ title: t.pages.privacy.title, description: t.pages.privacy.description });
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader title={t.pages.privacy.title} />
      <div className="mt-8 max-w-2xl space-y-4 text-ink-muted">
        <p>
          MotoMatch verwendet keine Cookies und kein Tracking. Im Browser gespeichert werden nur
          deine Theme-Wahl (hell/dunkel) und deine Vergleichsauswahl.
        </p>
        <p>
          YouTube-Videos werden erst nach einem Klick geladen (youtube-nocookie.com). Vorher wird
          keine Verbindung zu YouTube aufgebaut.
        </p>
      </div>
    </Container>
  );
}
