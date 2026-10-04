import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
// Schriften selbst gehostet (kein Google-Fonts-CDN)
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './styles/index.css';
import { App } from './app/App';
import { preloadPageFor } from './app/pages';
import { createQueryClient, prefetchForPath } from './lib/queries';

// Scrollpositionen verwaltet die App selbst (siehe useScrollMemory).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Element #root fehlt in index.html');

const queryClient = createQueryClient();

/**
 * Höchstens so lange warten wir vor dem ersten Rendern auf Code und Daten. Danach
 * erscheint die Seite trotzdem – mit Skeleton, bis der Rest da ist.
 */
const MAX_INITIAL_WAIT_MS = 1200;

/**
 * Erst den Code der aktuellen Seite und ihre Daten laden (parallel), dann rendern: So
 * erscheint der Inhalt ohne Skeleton (React liesse ein einmal gezeigtes Skeleton mindestens
 * 300 ms stehen). Mit den JSON-Daten geht das praktisch sofort, mit Supabase so schnell wie
 * die Datenbank antwortet. Fehler zeigt danach die Seite selbst an.
 */
const ready = Promise.allSettled([
  preloadPageFor(window.location.pathname),
  prefetchForPath(queryClient, window.location.pathname),
]);
const timeout = new Promise((resolve) => setTimeout(resolve, MAX_INITIAL_WAIT_MS));
void Promise.race([ready, timeout]).then(() => render(rootElement));

function render(root: HTMLElement) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/*
          useTransitions={false}: URL-Änderungen werden sofort gerendert. Nötig, weil Suchfeld
          und Filter ihren Zustand direkt aus der URL lesen (sonst flackern Eingabefelder).
        */}
        <BrowserRouter useTransitions={false}>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}
