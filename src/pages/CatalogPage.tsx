import { ComingSoon } from '@/components/layout/ComingSoon';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';

export default function CatalogPage() {
  usePageMeta({ title: t.pages.catalog.title, description: t.pages.catalog.description });
  return <ComingSoon title={t.pages.catalog.title} lead={t.pages.catalog.description} />;
}
