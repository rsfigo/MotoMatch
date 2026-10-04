import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { Section } from '@/components/ui/Section';
import type { Category } from '@/data/schema';
import { t } from '@/i18n';
import { spring } from '@/lib/motion';
import { youTubeEmbedUrl } from '@/lib/youtube';

interface YouTubeReviewProps {
  url: string;
  /** Name des Bikes für Titel und Beschriftungen */
  name: string;
  category: Category;
}

/**
 * Video-Review als Karte. YouTube wird erst nach dem Klick geladen
 * (youtube-nocookie.com) – vorher geht keine Anfrage an YouTube, auch kein Vorschaubild.
 */
export function YouTubeReview({ url, name, category }: YouTubeReviewProps) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = youTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <Section title={t.youtube.sectionTitle}>
      <div className="relative aspect-video overflow-hidden rounded-panel border border-line bg-surface shadow-raised">
        {playing ? (
          <iframe
            src={embedUrl}
            title={t.youtube.iframeTitle(name)}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t.youtube.play(name)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(90%_80%_at_50%_100%,var(--mm-surface-3),var(--mm-surface)_70%)] p-6 text-center"
          >
            <BikeSilhouette
              category={category}
              className="pointer-events-none absolute inset-x-[15%] bottom-0 w-[70%] opacity-40"
            />
            <motion.span
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={spring.snappy}
              className="relative grid size-16 place-items-center rounded-full bg-accent text-on-accent shadow-glow sm:size-20"
            >
              <Play aria-hidden="true" className="ml-1 size-7 fill-current sm:size-8" />
            </motion.span>
            <span className="relative font-display text-xl font-semibold sm:text-2xl">
              {t.youtube.title(name)}
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-ink-subtle">{t.youtube.privacy}</p>
    </Section>
  );
}
