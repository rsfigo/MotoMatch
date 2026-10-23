/**
 * Angaben zum Betreiber in Impressum und Datenschutz
 * --------------------------------------------------
 * Name, Postadresse und E-Mail erscheinen öffentlich auf der Website, stehen aber bewusst nicht
 * im öffentlichen Repository (sonst blieben sie für immer in der Git-Historie). Sie kommen beim
 * Build aus den Umgebungsvariablen VITE_OPERATOR_* (siehe .env.example). Fehlt ein Wert, bleibt
 * der Platzhalter stehen und wird auf der Seite markiert.
 */

export interface OperatorDetails {
  name?: string;
  address?: string;
  email?: string;
}

const PLACEHOLDER_FIELDS = {
  '[NAME]': 'name',
  '[ADRESSE]': 'address',
  '[E-MAIL]': 'email',
} as const satisfies Record<string, keyof OperatorDetails>;

/** Angaben aus den Umgebungsvariablen des Builds. */
export const OPERATOR: OperatorDetails = {
  name: import.meta.env.VITE_OPERATOR_NAME,
  address: import.meta.env.VITE_OPERATOR_ADDRESS,
  email: import.meta.env.VITE_OPERATOR_EMAIL,
};

/** Ersetzt [NAME], [ADRESSE] und [E-MAIL], soweit die Angaben vorhanden sind. */
export function fillOperatorDetails(text: string, details: OperatorDetails): string {
  return text.replace(/\[(?:NAME|ADRESSE|E-MAIL)\]/g, (placeholder) => {
    const field = PLACEHOLDER_FIELDS[placeholder as keyof typeof PLACEHOLDER_FIELDS];
    return details[field]?.trim() || placeholder;
  });
}

/** Steht im Text noch ein Platzhalter in eckigen Klammern? */
export function hasPlaceholder(text: string): boolean {
  return /\[[^\]]+\]/.test(text);
}
