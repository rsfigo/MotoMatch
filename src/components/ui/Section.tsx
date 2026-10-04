import { motion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { fadeUp } from '@/lib/motion';

interface SectionProps {
  title: string;
  lead?: string;
  /** Element rechts neben dem Titel, z. B. ein Info-Knopf */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Abschnitt mit Überschrift, der beim Hineinscrollen sanft erscheint. */
export function Section({ title, lead, aside, children, className }: SectionProps) {
  const headingId = useId();

  return (
    <motion.section
      aria-labelledby={headingId}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <h2 id={headingId} className="text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          {lead && <p className="mt-1 text-sm text-ink-muted sm:text-base">{lead}</p>}
        </div>
        {aside}
      </div>
      {children}
    </motion.section>
  );
}

/** Karte mit weichem Rahmen – Grundbaustein vieler Abschnitte. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('rounded-card border border-line bg-surface p-5 shadow-card sm:p-6', className)}
    >
      {children}
    </div>
  );
}
