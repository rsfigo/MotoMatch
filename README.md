# MotoMatch

**Finde das Bike, das zu dir passt.** MotoMatch vergleicht Motorräder für den Schweizer Markt:
Leistung, Gewicht, Sitzhöhe, Preis in CHF, Führerausweis-Kategorie und Ausstattung auf einen Blick.

> Status: in Entwicklung (Meilenstein 0 – Setup). Ausführliches README mit Screenshots folgt.

## Schnellstart

Voraussetzung: [Node.js](https://nodejs.org/) 22.22 oder neuer (empfohlen: 24).

```bash
git clone https://github.com/rsfigo/MotoMatch.git
cd MotoMatch
npm install
npm run dev
```

Danach läuft die Seite auf <http://localhost:5173>.

## Skripte

| Befehl                  | Zweck                                         |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Entwicklungsserver mit Hot Reload             |
| `npm run build`         | Typprüfung und Produktions-Build nach `dist/` |
| `npm run test`          | Unit-Tests (Vitest)                           |
| `npm run validate:data` | Prüft alle Bike-Daten (JSON) mit Zod          |
| `npm run lint`          | ESLint                                        |
| `npm run format`        | Code mit Prettier formatieren                 |

## Tech-Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS 4 · Motion · Zod · Vitest

Entscheidungen und Annahmen stehen in [DECISIONS.md](DECISIONS.md).
