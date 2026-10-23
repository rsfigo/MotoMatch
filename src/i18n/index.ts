// Relativer Import mit .ts-Endung: Die Texte braucht auch der Build (scripts/seoPlugin.ts).
import { de } from './de.ts';

/**
 * Aktive Sprache. Heute gibt es nur Deutsch (Schweiz).
 * Verwendung: `import { t } from '@/i18n'` und dann z. B. `t.nav.bikes`.
 */
export const t = de;

/** Sprach- und Regionscode für Intl-APIs (Zahlen, Länder). */
export const locale = 'de-CH';
