import { YouTubeCard } from '@/components/detail/YouTubeReview';
import { Section } from '@/components/ui/Section';
import { useModelFullName } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import type { CompareItem } from '@/lib/compare';
import { youTubeEmbedUrl } from '@/lib/youtube';

/**
 * Ganz unten: die Video-Reviews der verglichenen Bikes – nur, wo es einen bestätigten
 * Link gibt. Hat keines ein Video, entfällt der Abschnitt.
 */
export function CompareVideos({ items }: { items: readonly CompareItem[] }) {
  const fullName = useModelFullName();
  const videos = items.flatMap((item) => {
    const url = item.generation.youtubeReviewUrl;
    return url && youTubeEmbedUrl(url) ? [{ item, url }] : [];
  });
  if (videos.length === 0) return null;

  return (
    <Section title={t.compare.videosTitle} lead={t.youtube.privacy}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map(({ item, url }) => (
          <YouTubeCard
            key={item.model.id}
            url={url}
            name={fullName(item.model)}
            category={item.model.category}
          />
        ))}
      </div>
    </Section>
  );
}
