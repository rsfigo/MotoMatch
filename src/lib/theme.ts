/**
 * Theme-Verwaltung (dunkel / hell)
 * --------------------------------
 * Das Theme steht als `data-theme` auf dem <html>-Element. Ein kleines Skript in
 * index.html setzt es schon vor dem ersten Rendern, damit nichts aufblitzt.
 * Die Wahl wird in localStorage gemerkt.
 */

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'motomatch-theme';
const THEME_COLORS: Record<Theme, string> = { dark: '#0B0C0F', light: '#F6F6F3' };

const listeners = new Set<() => void>();

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // z. B. privater Modus ohne Speicher – das Theme gilt dann nur für diese Sitzung.
  }
  listeners.forEach((listener) => listener());
}

/** Für useSyncExternalStore: meldet jede Theme-Änderung. */
export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
