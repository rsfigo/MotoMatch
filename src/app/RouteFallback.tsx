import { Container } from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { t } from '@/i18n';

/** Skeleton, solange der Code einer Seite nachgeladen wird. */
export function RouteFallback() {
  return (
    <Container className="py-10 sm:py-14">
      <div role="status">
        <span className="sr-only">{t.common.loading}</span>
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-card" />
          ))}
        </div>
      </div>
    </Container>
  );
}
