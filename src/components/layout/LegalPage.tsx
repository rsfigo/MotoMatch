import { ExternalLink, FilePen } from 'lucide-react';
import { Fragment, useId } from 'react';
import { t } from '@/i18n';
import { Container } from './Container';
import { PageHeader } from './PageHeader';

export interface LegalSection {
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  link?: { label: string; href: string };
}

interface LegalPageProps {
  title: string;
  lead: string;
  sections: readonly LegalSection[];
  /** z. B. «Stand: Oktober 2026» */
  asOf?: string;
}

/** Hebt Platzhalter wie «[PLZ Ort]» hervor, damit sie vor dem Livegang auffallen. */
function WithPlaceholders({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\])/).map((part, index) =>
    part.startsWith('[') ? (
      <mark key={index} className="rounded bg-warning/15 px-1 text-ink">
        {part}
      </mark>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function SectionBlock({ section }: { section: LegalSection }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-bold sm:text-2xl">
        {section.title}
      </h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3 leading-relaxed text-ink-muted">
          <WithPlaceholders text={paragraph} />
        </p>
      ))}
      {section.list && (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-ink-muted">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.link && (
        <a
          href={section.link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-medium text-accent-ink underline underline-offset-4 hover:text-ink"
        >
          {section.link.label}
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">({t.legal.externalLink})</span>
        </a>
      )}
    </section>
  );
}

/** Gemeinsamer Aufbau von Impressum und Datenschutz. */
export function LegalPage({ title, lead, sections, asOf }: LegalPageProps) {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <PageHeader title={title} lead={lead} />
        <p className="mt-6 flex items-start gap-2 rounded-control border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <FilePen aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
          {/* Eigenes Element, sonst würde jeder Textteil zu einer Flex-Spalte */}
          <span>
            <WithPlaceholders text={t.legal.draftNotice} />
          </span>
        </p>
        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <SectionBlock key={section.title} section={section} />
          ))}
        </div>
        {asOf && <p className="mt-12 text-sm text-ink-subtle">{asOf}</p>}
      </div>
    </Container>
  );
}
