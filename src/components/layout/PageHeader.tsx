import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
  children?: ReactNode;
}

/** Einheitlicher Seitenkopf: kleine Dachzeile, grosse Überschrift, Einleitung. */
export function PageHeader({ eyebrow, title, lead, className, children }: PageHeaderProps) {
  return (
    <header className={cn('max-w-3xl', className)}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
      {lead && <p className="mt-4 text-base text-ink-muted sm:text-lg">{lead}</p>}
      {children}
    </header>
  );
}
