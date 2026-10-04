import { IdCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { t } from '@/i18n';
import type { LicenceInfo } from '@/lib/licence';

/** Benötigter Führerausweis, bei drosselbaren Bikes mit Hinweis auf «A beschränkt». */
export function LicenceBadge({ licence }: { licence: LicenceInfo }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <Badge
        icon={<IdCard aria-hidden="true" className="size-3.5" />}
        title={`${t.licence.long[licence.required]} – ${t.licence.disclaimer}`}
      >
        <span className="sr-only">{t.licence.label}: </span>
        {t.licence.short[licence.required]}
      </Badge>
      {licence.withThrottle && (
        <span className="text-xs text-ink-muted" title={t.licence.withThrottle}>
          {t.licence.throttleShort}
        </span>
      )}
    </span>
  );
}
