import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeToTheme, type Theme } from '@/lib/theme';

/** Liefert das aktuelle Theme und eine Funktion zum Wechseln. */
export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => 'dark' as const);
  return { theme, setTheme };
}
