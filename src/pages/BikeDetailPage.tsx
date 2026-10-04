import { useParams } from 'react-router';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function BikeDetailPage() {
  const { slug = '' } = useParams();
  usePageMeta({ title: slug });
  return <ComingSoon title={slug} lead="Detailseite (Meilenstein 3)" />;
}
