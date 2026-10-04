import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Section } from '@/components/ui/Section';
import type { Generation } from '@/data/schema';
import { t } from '@/i18n';
import { fadeUp, staggerContainer, staggerStep } from '@/lib/motion';

/** «Was ist neu?» – nur sichtbar, wenn die Generation Änderungen gegenüber dem Vorgänger hat. */
export function WhatsNew({ generation }: { generation: Generation }) {
  if (!generation.changes?.length) return null;

  return (
    <Section title={t.detail.whatsNew} lead={t.detail.whatsNewLead}>
      <Card>
        {/* key: Beim Generationswechsel erscheint die Liste neu */}
        <motion.ul
          key={generation.id}
          variants={staggerContainer(staggerStep.tight)}
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:grid-cols-2"
        >
          {generation.changes.map((change) => (
            <motion.li key={change} variants={fadeUp} className="flex gap-3 text-sm sm:text-base">
              <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-ink" />
              <span>{change}</span>
            </motion.li>
          ))}
        </motion.ul>
      </Card>
    </Section>
  );
}
