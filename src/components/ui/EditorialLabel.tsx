import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { t } from '@/i18n';

/** Kennzeichnung «Redaktionelle Einschätzung» mit Erklärung (für Wertungen von 1 bis 10). */
export function EditorialLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
      {t.editorial.label}
      <InfoTooltip label={t.editorial.label} align="end">
        {t.editorial.hint}
      </InfoTooltip>
    </span>
  );
}
