# MotoMatch

**Finde das Bike, das zu dir passt.** MotoMatch vergleicht Motorräder für den Schweizer Markt:
Leistung, Gewicht, Sitzhöhe, Preis in CHF, Führerausweis-Kategorie und Ausstattung auf einen Blick.

> Status: in Entwicklung. Fertig sind Setup (M0), Datenmodell mit 12 recherchierten Bikes (M1)
> und der Katalog mit Filtern (M2). Detailseite, Vergleich und Match-Wizard folgen.
> Ausführliches README mit Screenshots folgt in M6.

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

## Projektstruktur

```
scripts/validate-data.ts   Prüft alle JSON-Daten (npm run validate:data)
src/
  app/                     App, Routen, Seitenübergänge
  pages/                   Eine Datei pro Seite (lazy geladen)
  components/              ui/, layout/, bike/, catalog/, charts/, home/
  data/                    schema.ts (Zod), manufacturers.json, features.json, models/*.json
  lib/                     Reine Logik mit Tests (Führerausweis, Formatierung, Katalog …)
  hooks/                   React-Hooks (Theme, Filter in der URL, Vergleichsauswahl …)
  i18n/de.ts               Alle Texte der Oberfläche
  styles/                  Tailwind und Design-Tokens (tokens.css)
```

## Neues Bike hinzufügen (Kurzfassung)

1. Neue Datei `src/data/models/<hersteller>-<modell>.json` anlegen – am einfachsten eine bestehende
   Datei kopieren. Der Dateiname muss der `id` entsprechen.
2. Fehlt der Hersteller, ihn in `src/data/manufacturers.json` ergänzen.
3. Werte nur aus offiziellen Quellen übernehmen und in `sources` verlinken. Unsichere Werte
   weglassen oder `"dataStatus": "needsVerification"` setzen.
4. `npm run validate:data` ausführen – das Skript nennt jeden Fehler mit Datei und Feld.

Die Felder sind in `src/data/schema.ts` erklärt.

## Tech-Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS 4 · Motion · Zod · Vitest

Entscheidungen und Annahmen stehen in [DECISIONS.md](DECISIONS.md).
