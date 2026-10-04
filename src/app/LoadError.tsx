import { RotateCcw, WifiOff } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';

/** Verständliche Meldung statt einer leeren Seite – mit «Erneut versuchen». */
export function LoadError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Screenreader und Tastatur landen direkt bei der Meldung
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <Container className="py-16 sm:py-24">
      <div role="alert" className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-line bg-surface-2 text-accent-ink">
          <WifiOff aria-hidden="true" className="size-6" />
        </span>
        <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl font-bold outline-none">
          {t.errors.loadTitle}
        </h1>
        <p className="mt-3 text-ink-muted">{t.errors.loadText}</p>
        <Button size="lg" onClick={onRetry} className="mt-7">
          <RotateCcw aria-hidden="true" className="size-4" />
          {t.errors.retry}
        </Button>
        {import.meta.env.DEV && (
          <details className="mt-8 text-left text-xs text-ink-subtle">
            <summary className="cursor-pointer">{t.errors.details}</summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
      </div>
    </Container>
  );
}
