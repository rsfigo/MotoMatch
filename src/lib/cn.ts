/**
 * Verbindet CSS-Klassen und lässt leere Werte weg.
 *
 * @example cn('rounded-card', isActive && 'bg-accent') // "rounded-card bg-accent"
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
