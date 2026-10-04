# MotoMatch

**Finde das Bike, das zu dir passt.** MotoMatch vergleicht Motorräder für den Schweizer Markt:
Leistung, Gewicht, Sitzhöhe, Preis in CHF, Führerausweis-Kategorie und Ausstattung auf einen Blick.
Ein Fragebogen schlägt passende Modelle vor.

> **Stand:** Phase 1 (Meilensteine M0–M6) ist fertig: eine reine Frontend-App mit Daten als
> JSON-Dateien. Als Nächstes folgt Phase 2 mit Supabase. Den genauen Stand hält
> [STATUS.md](STATUS.md) fest.

## Screenshots

| Startseite                                                                                                      | Katalog                                                                                                  |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ![Startseite mit Drehzahlmesser, Suchfeld und Einstieg in Katalog und Match-Wizard](docs/screenshots/home.webp) | ![Katalog mit Filtern für Führerausweis, Hersteller, Kategorie und Preis](docs/screenshots/catalog.webp) |

| Vergleich                                                                                             |
| ----------------------------------------------------------------------------------------------------- |
| ![Vergleich von drei Bikes mit Bestwerten, Balken und Differenz-Chips](docs/screenshots/compare.webp) |

| Detailseite (Handy)                                                                | Vergleich (Handy)                                                                           | Match-Ergebnis (helles Design)                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ![Detailseite der Yamaha MT-07 auf dem Handy](docs/screenshots/detail-mobile.webp) | ![Vergleichstabelle auf dem Handy, seitlich wischbar](docs/screenshots/compare-mobile.webp) | ![Match-Ergebnis mit Prozent-Ring und Begründungen](docs/screenshots/match-light.webp) |

Die Motorrad-Grafiken sind generische Silhouetten – keine Herstellerfotos, keine Logos.

## Funktionen

- **Katalog** – Suche, Sortierung und Filter (Hersteller, Kategorie, Preis, Leistung, Hubraum,
  Zylinder, drosselbar, Quickshifter, Blipper, Extras). Führerausweis-Filter A1 / A beschränkt / A,
  auf Wunsch inklusive drosselbarer Bikes. Alle Filter stehen in der URL.
- **Detailseite** – Generationen mit «Was ist neu?», Kerndaten mit hochzählenden Zahlen, technische
  Daten, Führerausweis-Info, Extras (nur was das Bike wirklich hat), Tuning- und Sound-Wertungen,
  Einsatzprofil als Radar, ähnliche Bikes und ganz unten das Video-Review.
- **Vergleich** – 2–3 Bikes nebeneinander, Generation pro Bike wählbar, Bestwert pro Zeile,
  Differenz-Chips wie «−22 PS», «Nur Unterschiede», Radar-Overlay und teilbarer Link. Bikes kommen
  über die Vergleichsleiste oder die Suche «Bike hinzufügen» (Strg K) dazu. Auf dem Handy lässt sich
  die Tabelle seitlich wischen.
- **Match-Wizard** – sechs Fragen (Führerausweis, Körpergrösse, Budget, Einsatz, Erfahrung, Sound und
  Tuning), danach 3–5 Bikes mit Match-Prozent und kurzer Begründung.
- **Daten aus JSON oder Supabase** – lokal direkt aus den JSON-Dateien im Repository, online aus
  einer Supabase-Datenbank. Die Website liest nur; Schreiben ist per Row Level Security gesperrt.
- **Gemacht für die Schweiz** – Preise im Format «CHF 12’490.–», Führerausweis-Kategorien nach
  Schweizer Recht, Texte in Schweizer Schreibweise.
- **Qualität** – dunkles und helles Design, Animationen mit Motion (bei «Bewegung reduzieren» nur
  Überblendungen), Barrierefreiheit automatisch mit axe-core geprüft (WCAG 2.2 AA), Lighthouse Mobile ≥ 90,
  YouTube-Videos werden erst nach einem Klick geladen.

## Schnellstart

Voraussetzung: [Node.js](https://nodejs.org/) 22.22 oder neuer (empfohlen: 24, siehe `.nvmrc`).

```bash
git clone https://github.com/rsfigo/MotoMatch.git
cd MotoMatch
npm install
npm run dev
```

Danach läuft die Seite auf <http://localhost:5173>.

## Skripte

| Befehl                  | Zweck                                                                         |
| ----------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`           | Entwicklungsserver mit Hot Reload                                             |
| `npm run build`         | Typprüfung und Produktions-Build nach `dist/`                                 |
| `npm run preview`       | Produktions-Build lokal ansehen                                               |
| `npm test`              | Unit-Tests (Vitest), `npm run test:watch` im Watch-Modus                      |
| `npm run validate:data` | Prüft alle Bike-Daten (JSON) mit Zod                                          |
| `npm run seed`          | Schreibt die JSON-Daten nach Supabase (`npm run seed -- --dry-run` prüft nur) |
| `npm run check:rls`     | Prüft, dass man mit dem öffentlichen Schlüssel nur lesen kann                 |
| `npm run export:data`   | Schreibt die Daten aus Supabase zurück in die JSON-Dateien (Backup)           |
| `npm run lint`          | ESLint                                                                        |
| `npm run typecheck`     | TypeScript-Prüfung ohne Build                                                 |
| `npm run format`        | Code mit Prettier formatieren (`format:check` prüft nur)                      |

## Tech-Stack

- **React 19** mit **TypeScript** (strict) und **Vite**
- **React Router** (deklarativ, ein Chunk pro Seite)
- **Tailwind CSS 4** mit Design-Tokens als CSS-Variablen (`src/styles/tokens.css`)
- **Motion** für Animationen, **lucide-react** für Icons, Gauges und Radar als eigenes SVG
- **TanStack Query** für Laden, Caching und Fehlerzustände
- **Supabase** (gehostetes PostgreSQL) als Datenbank, angesprochen über den schlanken offiziellen
  Client `@supabase/postgrest-js`
- **Zod** prüft die Daten: beim Prüfen der JSON-Dateien und im Supabase-Modus beim Laden (im
  JSON-Modus nicht im Browser-Bundle)
- **Vitest** für die Logik, **ESLint** und **Prettier**
- Schriften **Inter** und **Space Grotesk**, selbst gehostet über Fontsource

## Projektstruktur

```
docs/                   MASTER_PROMPT.md (Anforderungen), screenshots/ (Bilder für dieses README)
public/                 favicon.svg, og-image.png (Vorschaubild beim Teilen)
scripts/                validate-data, seed, check-rls, export-data, seoPlugin (Sitemap, kanonische URLs)
supabase/migrations/    Datenbankschema als SQL (Tabellen, Indizes, Row Level Security)
src/
  app/                  App, Routen (pages.ts), Seitenübergänge, Lade- und Fehlerzustände
  pages/                eine Datei pro Seite (eigener Chunk)
  components/           ui, layout, bike, catalog, detail, compare, match, charts, home
  data/                 schema.ts (Zod), constants.ts, manufacturers.json, features.json, models/*.json
  data/db/              Datenbankzeilen, Mapping Zeile ↔ Domain-Modell, Client für die Daten-API
  hooks/                Daten-, URL- und UI-Hooks
  lib/                  reine Logik mit Tests (Führerausweis, Katalog, Vergleich, Match …) und der
                        Datenzugriff (data.ts, BikeRepository für JSON und Supabase, TanStack Query)
  i18n/de.ts            alle Texte der Oberfläche
  styles/               Tailwind und Design-Tokens
```

Weitere Dokumente: [STATUS.md](STATUS.md) (aktueller Stand), [DECISIONS.md](DECISIONS.md)
(Entscheidungen und Annahmen), [CLAUDE.md](CLAUDE.md) (Hinweise für die Arbeit mit Claude).

## Daten

- Ein Modell pro Datei in `src/data/models/`, dazu Hersteller (`manufacturers.json`) und der Katalog
  der Extras (`features.json`). Die Struktur ist in `src/data/schema.ts` beschrieben.
- Ein Modell hat eine oder mehrere **Generationen** – alle Baujahre, in denen es technisch gleich ist.
- Jeder Wert stammt aus einer Quelle in `sources`. Unsichere Angaben fehlen lieber, oder die Generation
  trägt `"dataStatus": "needsVerification"`. Preise sind Schweizer Listenpreise mit Stand-Datum.
- Berechnet und nie gespeichert: PS aus kW, Leistungsgewicht, Reichweite und die
  Führerausweis-Kategorie (`src/lib/licence.ts`).
- Die Wertungen 1–10 (Tuning, Sound, Einsatzprofil) sind redaktionelle Einschätzungen; die Skalen
  stehen in [DECISIONS.md](DECISIONS.md).

## Datenbank (Supabase)

Die Website liest ihre Daten aus einer von zwei Quellen. Die Umgebungsvariable `VITE_DATA_SOURCE`
wählt sie beim Build:

- `json` (Standard): die JSON-Dateien aus `src/data` – für Entwicklung und Tests, ohne Konto.
- `supabase`: eine Supabase-Datenbank. Die Seite liest direkt über die Supabase-API mit dem
  öffentlichen Schlüssel; Schreiben ist per Row Level Security gesperrt.

Die Komponenten merken davon nichts: Beide Quellen erfüllen dasselbe Interface `BikeRepository`
(`src/lib/repository.ts`). Was in welcher Tabelle steht, zeigt die Migration in
`supabase/migrations/`.

### Einrichten (einmalig)

1. Auf [supabase.com](https://supabase.com) ein Konto und ein Projekt anlegen. Region: «Central
   Europe (Zurich)», sonst «Central EU (Frankfurt)». Das Datenbank-Passwort im Passwort-Manager
   ablegen – MotoMatch braucht es nicht.
2. Im Dashboard den **SQL Editor** öffnen, den Inhalt von
   `supabase/migrations/20261004120000_initial_schema.sql` einfügen und ausführen (oder mit der
   Supabase-CLI `supabase db push`).
3. `.env.example` nach `.env.local` kopieren und die Werte eintragen. Projekt-URL und öffentlicher
   Schlüssel stehen im Dialog **Connect**, alle Schlüssel unter **Settings → API Keys** (fehlen
   sie, dort zuerst erzeugen):
   - `VITE_SUPABASE_URL` – die Projekt-URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` – der öffentliche Schlüssel (`sb_publishable_…`)
   - `SUPABASE_SECRET_KEY` – der geheime Schlüssel (`sb_secret_…`), nur für `npm run seed`
4. `npm run seed -- --dry-run` prüft die Daten, `npm run seed` schreibt sie in die Datenbank.
5. `npm run check:rls` muss «Lesen erlaubt, Schreiben überall gesperrt» melden.
6. In `.env.local` `VITE_DATA_SOURCE=supabase` setzen und `npm run dev` starten.

`.env.local` steht in `.gitignore`. Schlüssel gehören nie ins Repository, in Issues oder in einen
Chat. Der geheime Schlüssel bekommt nie das Präfix `VITE_`: Solche Variablen landen im Browser –
der Build bricht deshalb ab, wenn er dort einen geheimen Schlüssel findet.

### Pausiertes Projekt wieder aktivieren

Im Gratis-Tarif pausiert Supabase ein Projekt, wenn die Datenbank eine Woche lang zu wenig genutzt
wurde (laut Doku reichen ein paar Anfragen pro Tag). Die Website zeigt dann «Daten konnten nicht
geladen werden».

1. Im [Supabase-Dashboard](https://supabase.com/dashboard) die Organisation und das pausierte
   Projekt wählen.
2. **Resume project** klicken und bestätigen. Das Projekt kommt mit Daten und Einstellungen zurück.

Laut [Supabase-Doku](https://supabase.com/docs/guides/platform/free-project-pausing) geht das bis
zu ein Jahr nach dem Pausieren. Notfalls lässt sich ein neues Projekt anlegen und mit Migration und
`npm run seed` wieder befüllen – die JSON-Dateien im Repository sind das Backup.

## Neues Bike hinzufügen

Es gibt zwei Wege. Beide enden mit denselben Daten in JSON-Dateien und Datenbank.

- **JSON und Seed** (empfohlen): Datei anlegen wie unten beschrieben, prüfen, dann mit
  `npm run seed` in die Datenbank schreiben.
- **Supabase-Tabelleneditor**: Zeilen direkt im Dashboard erfassen, danach mit
  `npm run export:data` in die JSON-Dateien übernehmen (siehe unten).

### Als JSON-Datei

1. **Recherchieren.** Am besten die Schweizer Herstellerseite oder das offizielle Datenblatt; dazu den
   Schweizer Listenpreis mit Datum. Magazinwerte (z. B. 0–100 km/h) sind als Test oder Schätzung zu
   kennzeichnen.
2. **Datei anlegen:** `src/data/models/<hersteller>-<modell>.json`, am einfachsten als Kopie einer
   bestehenden Datei (z. B. `yamaha-mt-125.json`). Der Dateiname muss der `id` entsprechen.
3. **Hersteller prüfen:** Fehlt er, in `src/data/manufacturers.json` ergänzen (`id`, `name`,
   `country` als Ländercode wie `"JP"`).
4. **Modell ausfüllen:** `id`, `manufacturerId`, `name` (ohne Hersteller, z. B. `"MT-07"`),
   `category` (`naked`, `sport`, `adventure`, `retro` …) und optional eine `tagline` (ein Satz).
5. **Generationen anlegen**, älteste zuerst. Die `id` ist `<modell-id>-<erstes Baujahr>`,
   `yearTo` ist `null`, solange das Modell gebaut wird. Eine neue Generation gibt es nur bei
   relevanten Änderungen – Motor, Leistung, Drehmoment, mehr als 3 kg Gewicht, Rahmen oder Fahrwerk,
   Elektronik, Quickshifter, Blipper, Extras, Drosselbarkeit oder Kategorie. Neue Farben oder Preise
   verlängern nur den Zeitraum.
6. **Pflichtfelder je Generation:** Motor (`powerKw` ist die Quelle der Wahrheit, PS werden
   berechnet), Fahrwerk (`weightKg` fahrbereit laut Hersteller, `seatHeightMm`, `tankL`, `gears`,
   `drive`), `throttle` (gedrosselte Leistung nur für offizielle Versionen), `quickshifter` und
   `blipper` (`standard`, `optional` oder `none`), `price` mit `asOf`, Wertungen, `tuningNote`,
   `sound.description`, `sources` (https-Links), `dataStatus` und `lastChecked`.
7. **Optionale Felder nur mit belegtem Wert:** Drehzahlen, Höchstgeschwindigkeit und 0–100 km/h (mit
   `kind`: `official`, `tested` oder `estimate`), Verbrauch, Standgeräusch, «Was ist neu?»
   (`changes`), Farben, Extras (Schlüssel aus `features.json`), YouTube-Link (nur bestätigte Links).
   Keine Fotos von Herstellern oder anderen Websites.
8. **Prüfen:** `npm run validate:data` nennt jeden Fehler mit Datei und Feld; danach `npm test` und
   im Browser `/bikes/<id>` ansehen.
9. **Unsicherheiten festhalten:** Wo Quellen sich widersprechen, `"dataStatus": "needsVerification"`
   setzen und den Grund in [DECISIONS.md](DECISIONS.md) notieren.
10. **In die Datenbank übertragen:** `npm run seed` (vorher `npm run seed -- --dry-run`). Der Seed
    ist beliebig oft ausführbar und löscht nie etwas.

Ein neues Extra kommt in `src/data/features.json` (`key`, `label`, `group`, `icon`); erlaubte Icons
stehen in `src/data/constants.ts`.

### Im Supabase-Tabelleneditor

1. Im Dashboard den **Table Editor** öffnen und die Zeilen in dieser Reihenfolge anlegen: falls
   nötig `manufacturers`, dann `models`, `generations` (eine Zeile pro Generation),
   `generation_features` (Extras) und `generation_sources` (Quellen – jede Angabe braucht eine, `position` ab
   0). Spaltennamen und erlaubte Werte stehen in der Migration; es gelten dieselben Regeln wie für
   JSON-Dateien.
2. `npm run export:data -- --dry-run` zeigt, welche Dateien sich ändern würden, und meldet Fehler.
3. `npm run export:data` schreibt die JSON-Dateien. Danach `npm run validate:data`, die Änderungen
   mit `git diff` prüfen und committen – so bleibt die Datenhistorie in Git.

Ein fehlerhaft erfasstes Modell legt die Website nicht lahm: Es fehlt im Katalog, und die
Browser-Konsole nennt den Fehler.

## Veröffentlichen

`npm run build` erzeugt statische Dateien in `dist/`, die auf jedem Webhosting laufen.

- **Domain:** Mit der Umgebungsvariable `VITE_SITE_URL` (siehe [.env.example](.env.example)) ergänzt
  der Build kanonische URLs, das Vorschaubild für Open Graph und eine `sitemap.xml`.
- **Daten aus Supabase:** Beim Hoster `VITE_DATA_SOURCE=supabase`, `VITE_SUPABASE_URL` und
  `VITE_SUPABASE_PUBLISHABLE_KEY` eintragen – nie `SUPABASE_SECRET_KEY`.
- **Weiterleitung:** MotoMatch ist eine Single-Page-App. Der Server muss alle unbekannten Pfade auf
  `index.html` umleiten (z. B. Netlify `/*  /index.html  200`, nginx `try_files $uri /index.html;`).

## Hinweise

Alle Angaben ohne Gewähr. Marken gehören den jeweiligen Inhabern, MotoMatch steht in keiner Verbindung
zu den Herstellern. Impressum und Datenschutz sind Entwürfe und werden vor dem Livegang ergänzt.
