import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
// Schriften selbst gehostet (kein Google-Fonts-CDN)
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './styles/index.css';
import { App } from './app/App';
import { preloadPageFor } from './app/pages';

// Scrollpositionen verwaltet die App selbst (siehe useScrollMemory).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Element #root fehlt in index.html');

/**
 * Erst den Code der aktuellen Seite laden, dann rendern: So erscheint der Inhalt ohne
 * Skeleton (React liesse ein einmal gezeigtes Skeleton mindestens 300 ms stehen).
 * Schlägt das Laden fehl, wird trotzdem gerendert – die Seite versucht es dann erneut.
 */
void preloadPageFor(window.location.pathname)
  .catch(() => undefined)
  .then(() => render(rootElement));

function render(root: HTMLElement) {
  createRoot(root).render(
    <StrictMode>
      {/*
        useTransitions={false}: URL-Änderungen werden sofort gerendert. Nötig, weil Suchfeld
        und Filter ihren Zustand direkt aus der URL lesen (sonst flackern Eingabefelder).
      */}
      <BrowserRouter useTransitions={false}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
