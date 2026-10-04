import { ComingSoon } from '@/components/layout/ComingSoon';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

export default function MatchPage() {
  usePageMeta({ title: t.pages.match.title, description: t.pages.match.description });
  return <ComingSoon title={t.pages.match.title} lead={t.pages.match.description} />;
}
