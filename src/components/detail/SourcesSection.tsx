import { ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, Section } from '@/components/ui/Section';
import type { Generation } from '@/data/schema';
import { t } from '@/i18n';
import { formatDate } from '@/lib/format';

/** Datenstand, Preis-Hinweis und Quellen der gewählten Generation. */
export function SourcesSection({ generation }: { generation: Generation }) {
  const verified = generation.dataStatus === 'verified';

  return (
    <Section title={t.detail.sourcesTitle}>
      <Card className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2 font-medium">
            {verified ? (
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-positive" />
            ) : (
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
            )}
            {verified ? t.data.verified : t.data.needsVerification}
          </p>
          {!verified && <p className="text-ink-muted">{t.data.needsVerificationHint}</p>}
          <p className="text-ink-muted">
            {t.detail.lastChecked(formatDate(generation.lastChecked))}
          </p>
          {generation.price.note && (
            <p className="text-ink-muted">
              {t.specs.price}: {generation.price.note}
            </p>
          )}
          <p className="text-xs text-ink-subtle">{t.footer.disclaimer}</p>
        </div>

        {generation.sources.length > 0 && (
          <ul className="space-y-2 text-sm">
            {generation.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-2 text-ink hover:text-accent-ink"
                >
                  <ExternalLink
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-ink-subtle"
                  />
                  <span className="underline decoration-line-strong underline-offset-4 group-hover:decoration-accent">
                    {source.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Section>
  );
}
