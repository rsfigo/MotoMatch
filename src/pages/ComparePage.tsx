import { ComingSoon } from '@/components/layout/ComingSoon';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

export default function ComparePage() {
  usePageMeta({ title: t.pages.compare.title, description: t.pages.compare.description });
  return <ComingSoon title={t.pages.compare.title} lead={t.pages.compare.description} />;
}
