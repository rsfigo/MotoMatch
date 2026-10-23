# Projektstatus MotoMatch

**Stand: 23. Oktober 2026** · Branch `main`, synchron mit GitHub · letzter Code-Commit `011b1f4`

Diese Datei hält den aktuellen Stand fest. Sie wird zu Beginn jeder Sitzung gelesen und
nach jedem Meilenstein aktualisiert (siehe `CLAUDE.md`). Alle Angaben stammen aus Code, Daten
und Git-Historie; was sich daraus nicht belegen lässt, ist als offen markiert.

## 1. Kurzfazit

Phase 1 (M0–M6) ist abgeschlossen. M7 (Supabase) ist so weit gebaut, wie es ohne Konto geht, und
wartet auf dein Supabase-Projekt. M8 (Veröffentlichen) ist vorbereitet, soweit es ohne Konten geht:
Konfiguration für Cloudflare Workers, eine eigene HTML-Datei mit Titel und Beschreibung pro Seite
und Bike (Prerendering der Kopfdaten), «noindex» für 404-Seiten, Sicherheits-Header mit Content
Security Policy, Rechtstexte nach DSG mit Platzhaltern sowie Anleitungen für Cloudflare, Domain und
Google Search Console. Die CI mit Secret-Scan liegt fertig auf einem eigenen Branch und wartet auf
deinen Entscheid zum Merge. Die Website läuft weiterhin mit den JSON-Daten; `build`, `test`,
`validate:data` und `lint` sind grün.

## 2. Meilensteine

| Meilenstein       | Status    | Stand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 – Setup        | erledigt  | Vite, React, TypeScript, Tailwind, React Router, Motion, ESLint, Prettier und Vitest eingerichtet; Design-Tokens, Layout und Theme-Umschalter; mit GitHub verbunden.                                                                                                                                                                                                                                                                                                                            |
| M1 – Datenmodell  | erledigt  | Zod-Schema, 12 Modelle mit 20 Generationen aus belegten Quellen, Logik für Führerausweis, PS und Formatierung mit Tests.                                                                                                                                                                                                                                                                                                                                                                        |
| M2 – Katalog      | erledigt  | Suche, Sortierung und alle Filter (inkl. Führerausweis mit «drosselbare einschliessen») in der URL, Karten mit Layout-Animationen, Vergleichsleiste.                                                                                                                                                                                                                                                                                                                                            |
| M3 – Detailseite  | erledigt  | Generationen-Umschalter mit «Was ist neu?», Kerndaten mit Count-up, bedingte Extras, Tuning-Gauges, Sound, Profil-Radar, ähnliche Bikes, YouTube ganz unten.                                                                                                                                                                                                                                                                                                                                    |
| M4 – Vergleich    | erledigt  | 2–3 Bikes mit Generation pro Bike, Bestwerte, Differenz-Chips, «Nur Unterschiede», Radar-Overlay, Teilen-Link; auf dem Handy seitlich wischen mit Einrasten.                                                                                                                                                                                                                                                                                                                                    |
| M5 – Match-Wizard | erledigt  | Sechs Fragen, getestete Bewertung in `src/lib/match.ts`, 3–5 Treffer mit Match-Prozent und Begründung, Antworten in der URL.                                                                                                                                                                                                                                                                                                                                                                    |
| M6 – Feinschliff  | erledigt  | Barrierefreiheit (axe ohne Befund, Tastatur geprüft), Lighthouse Mobile Performance 92–95, SEO über `VITE_SITE_URL`, Vorschaubild, Impressum und Datenschutz als Entwürfe, README mit Screenshots.                                                                                                                                                                                                                                                                                              |
| M7 – Supabase     | in Arbeit | Erledigt: Repository-Schicht (JSON oder Supabase), TanStack Query mit Skeletons und «Erneut versuchen», SQL-Migration mit Row Level Security, `seed` mit `--dry-run`, `check:rls`, `export:data`, Mapping-Tests, Gratis-Tarif geprüft, README-Anleitungen. Offen: Supabase-Projekt (du), Migration, Seed und `check:rls` gegen die echte Datenbank, Abnahme.                                                                                                                                    |
| M8 – Online       | in Arbeit | Vorbereitet: `wrangler.jsonc` (Workers mit statischen Dateien, Single-Page-App), Prerendering der Kopfdaten, «noindex» für 404, `dist/_headers` mit CSP und Cache-Regeln, Rechtstexte mit `[NAME]`, `[ADRESSE]`, `[E-MAIL]` (Werte als Build-Variablen), Anleitungen im README, Bedingungen und Gratis-Tarif von Cloudflare geprüft; CI mit gitleaks auf dem Branch `claude/ci-gitleaks-37cb59`. Offen: Merge der CI, Konten und Domain (du), Deployment, Messungen im Supabase-Modus, Abnahme. |

## 3. Daten

**Dateien**

- `src/data/models/*.json` – ein Modell pro Datei (12 Dateien), Dateiname = Modell-ID
- `src/data/manufacturers.json` – Hersteller (id, name, country)
- `src/data/features.json` – Katalog der Extras (key, label, group, icon, description)
- `src/data/schema.ts` – Zod-Schemas, daraus die TypeScript-Typen
- `src/data/constants.ts` – Konstanten ohne Zod (Kategorien, Extra-Gruppen, Icons, YouTube-ID)
- `src/data/validateDataset.ts` und `scripts/validate-data.ts` – Prüfung (`npm run validate:data`)
- `supabase/migrations/20261004120000_initial_schema.sql` – dieselben Daten als Datenbankschema
- `src/data/db/` – Zeilentypen, Mapping Domain-Modell ↔ Datenbankzeilen, Client für die Daten-API

Die JSON-Dateien bleiben die Quelle für den Seed, das Backup der Datenbank und die Grundlage für
Prerendering und Sitemap beim Build. Als Zeilen sind es 9 Hersteller, 18 Extras, 12 Modelle,
20 Generationen, 152 Extras-Zuordnungen und 75 Quellen (`npm run seed -- --dry-run`). JSON →
Datenbankzeilen → JSON ergibt dieselben Dateien.

**Umfang**

| Was                                       | Anzahl                                                                                                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hersteller                                | 9 (alle mit mindestens einem Modell)                                                                                                                                             |
| Modelle                                   | 12 (9 Naked Bikes, je 1 Sportler, Adventure, Retro)                                                                                                                              |
| Generationen                              | 20 – mehrere Generationen bei Yamaha MT-07 (3), Yamaha MT-09 (3), Triumph Trident 660 (3), Honda CB650R (2), Ducati Monster (2)                                                  |
| `dataStatus: "needsVerification"`         | 6 von 20: `aprilia-rs-457-2024`, `ducati-monster-2026`, `honda-cb650r-2024`, `ktm-125-duke-2024`, `ktm-390-duke-2024`, `triumph-trident-660-2021` (Gründe in `DECISIONS.md`, M1) |
| Generationen mit Extras                   | 20 von 20 (2 bis 17 Extras pro Generation); Katalog mit 18 Extras                                                                                                                |
| Generationen mit YouTube-Link             | 17 von 20 – ohne: KTM 125 Duke, Yamaha MT-125, Yamaha MT-09 2022 (die gefundenen Reviews waren spanischsprachig und wurden weggelassen)                                          |
| Generationen mit Audio (`sound.audioSrc`) | 0                                                                                                                                                                                |
| Generationen mit Bildern (`images`)       | 0 – überall generische SVG-Silhouetten als Platzhalter                                                                                                                           |
| Führerausweis im Serienzustand            | A1: 2 Modelle (KTM 125 Duke, Yamaha MT-125); A beschränkt: 3 (KTM 390 Duke, Aprilia RS 457, Royal Enfield Interceptor 650); A: 7, davon 6 mit offizieller 35-kW-Drosselung       |

**Oft fehlende Felder** (von 20 Generationen)

| Feld                        | fehlt bei | Anzeige                                    |
| --------------------------- | --------- | ------------------------------------------ |
| `performance.topSpeedKmh`   | 18        | Kernfeld, erscheint als «k. A.»            |
| `performance.accel0to100s`  | 16        | Kernfeld, erscheint als «k. A.»            |
| `sound.noiseDbA`            | 19        | optional, Zeile erscheint nur mit Wert     |
| `chassis.consumptionL100km` | 4         | optional (dann auch keine Reichweite)      |
| `sound.audioSrc`, `images`  | 20        | kein Audio-Player, Silhouetten statt Fotos |
| `changes`                   | 5         | «Was ist neu?» erscheint nur mit Einträgen |

`changes` fehlt bei der ersten Generation von Ducati Monster, Triumph Trident 660, Yamaha MT-07
und MT-09 sowie beim Aprilia RS 457 (einzige Generation).

Immer vorhanden sind Leistung und Drehmoment (mit Drehzahl), Hubraum, Gewicht, Sitzhöhe, Tank,
Preis mit Stand-Datum, Drosselbarkeit, Wertungen und mindestens eine Quelle.

**Herkunft der Werte**

- 75 Quellen-Links (jede Generation hat mindestens einen). Quellen haben nur `label` und `url`;
  die Einteilung unten folgt den Domains der Links:
  - 43 Hersteller-, Importeur- und Presseseiten der Hersteller (z. B. yamaha-motor.eu, ktm.com,
    hondanews.eu, triumph-mediakits.com, press.bmwgroup.com, piaggiogroup.com, kawasaki.ch)
  - 12 archivierte Herstellerseiten (Wayback Machine), wo die Live-Seite nicht erreichbar war –
    vor allem Preise älterer Generationen
  - 19 Magazine und Tests (u. a. motorradonline.de, motorradundreisen.de, 1000ps, moto.ch, ADAC)
  - 1 Händlerplattform (motoscout24.ch)
- Fahrleistungen sind gekennzeichnet (`kind`): Top Speed 2 Werte (1 Herstellerangabe, 1 Schätzung),
  0–100 km/h 4 Werte (1 Herstellerangabe, 2 Testwerte, 1 Schätzung). Schätzungen erscheinen mit «ca.».
- Preise sind Schweizer Listenpreise in CHF mit `asOf`: aktuelle Generationen Stand 13.5.–4.10.2026,
  ältere Generationen mit historischem Preis (ältester Stand 1.11.2020). Alle Generationen wurden
  am 4.10.2026 zuletzt geprüft (`lastChecked`).
- Die Wertungen (Tuning, Sound, Einsatzprofil, 1–10) sind redaktionelle Einschätzungen und auf der
  Seite so gekennzeichnet.

## 4. Aufbau

```
docs/              MASTER_PROMPT.md (Anforderungen), screenshots/ (Bilder für das README)
public/            favicon.svg, og-image.png (Vorschaubild beim Teilen)
scripts/           validate-data, seed, check-rls, export-data (mit lib/ für Daten und .env.local);
                   Build-Plugins: seoPlugin (Kopfdaten pro Seite, Sitemap, robots.txt),
                   headersPlugin (dist/_headers), preloadDataPlugin (Daten-Chunk)
supabase/          migrations/ – Datenbankschema als SQL
src/
  app/             App, Routen (pages.ts), Seitenübergänge, Fehlergrenze und Fehlermeldung, lazyPage
  pages/           eine Datei pro Seite – je ein eigener Chunk
  components/      ui, layout, bike, catalog, detail, compare, match, charts, home
  data/            Schema, Konstanten, Prüfung und JSON-Daten; db/ für Supabase-Zeilen und Mapping
  hooks/           Daten-, URL- und UI-Hooks
  lib/             reine Logik mit Tests; Datenzugriff (data.ts, Repositories, TanStack Query)
  i18n/            de.ts – alle Texte der Oberfläche, auch Impressum und Datenschutz
  styles/          index.css (Tailwind), tokens.css (Design-Tokens)
  test/            Testdaten (Fixtures, Datensatz als Zeilen, erfundene Schlüssel)
wrangler.jsonc     Hosting bei Cloudflare (Workers mit statischen Dateien)
```

**Wichtige Dateien**

- `src/lib/data.ts` – einzige Stelle für den Datenzugriff (asynchron); Komponenten nutzen
  `src/hooks/useBikeData.ts`
- `src/lib/repository.ts` – Interface `BikeRepository` und Wahl der Quelle über `VITE_DATA_SOURCE`;
  `jsonRepository.ts` und `supabaseRepository.ts` sind die beiden Quellen
- `src/lib/queries.ts` – Abfragen und Einstellungen für TanStack Query
- `src/lib/pageMeta.ts` – Titel und Beschreibung jeder Seite, gemeinsam für App und Build
- `src/lib/legal.ts` – setzt Name, Adresse und E-Mail aus `VITE_OPERATOR_*` in die Rechtstexte
- `src/data/db/mapping.ts` – Umrechnung Domain-Modell ↔ Datenbankzeilen (für App und Skripte)
- `src/data/db/keys.ts` – erkennt öffentliche und geheime Supabase-Schlüssel (Build-Schutz, Skripte)
- `src/lib/licence.ts` – Führerausweis-Logik (Grenzwerte als Konstanten)
- `src/lib/specs.ts` – Definitionen der technischen Daten (Detailseite und Vergleich)
- `src/lib/compare.ts`, `src/lib/match.ts`, `src/lib/matchAnswers.ts`, `src/lib/catalog.ts` – Logik von Vergleich, Wizard und Katalog
- `src/lib/motion.ts` – zentrale Animations-Tokens
- `src/main.tsx` – lädt Seiten-Chunk und Daten vor dem ersten Rendern
- `vite.config.ts` mit `scripts/seoPlugin.ts`, `scripts/headersPlugin.ts` und
  `scripts/preloadDataPlugin.ts`; bricht ab, wenn eine `VITE_`-Variable einen geheimen Schlüssel
  enthält
- `wrangler.jsonc` – Cloudflare: statische Dateien aus `dist`, Single-Page-App, keine Worker-Logs
- `.env.example` – Vorlage der Umgebungsvariablen (nur Namen, keine Werte)
- `README.md` – Einstieg, Supabase-Einrichtung, Veröffentlichen (Cloudflare, Domain, Search
  Console), Anleitung «Neues Bike hinzufügen»; `DECISIONS.md` – alle Entscheidungen

**npm-Skripte**

| Skript                       | Zweck                                                       | Stand 23.10.2026                                                   |
| ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                | Entwicklungsserver                                          | läuft, ohne Konsolenfehler                                         |
| `npm run build`              | Typprüfung, Produktions-Build, Kopfdaten, `_headers`        | grün                                                               |
| `npm run preview`            | Produktions-Build lokal ansehen                             | läuft                                                              |
| `npm run preview:cloudflare` | Baut und startet `wrangler dev` (wie Cloudflare ausliefert) | läuft; Weiterleitungen, Header und CSP geprüft                     |
| `npm test`                   | Unit-Tests (Vitest)                                         | grün – 22 Testdateien, 173 Tests                                   |
| `npm run test:watch`         | Tests im Watch-Modus                                        | –                                                                  |
| `npm run validate:data`      | Prüft alle JSON-Daten mit Zod                               | grün, mit Hinweis auf 6 × `needsVerification`                      |
| `npm run seed`               | Schreibt die JSON-Daten nach Supabase                       | `--dry-run` grün; das Schreiben nur gegen einen Testserver geprüft |
| `npm run check:rls`          | Prüft, dass der öffentliche Schlüssel nur liest             | nur gegen einen Testserver geprüft (es gibt noch kein Projekt)     |
| `npm run export:data`        | Schreibt die Datenbank zurück in JSON                       | nur gegen einen Testserver geprüft                                 |
| `npm run lint`               | ESLint                                                      | grün                                                               |
| `npm run typecheck`          | TypeScript ohne Build                                       | grün                                                               |
| `npm run format`             | Prettier schreibt                                           | –                                                                  |
| `npm run format:check`       | Prettier prüft                                              | grün                                                               |

**Datenzugriff:** `src/lib/data.ts` ist **asynchron** – alle Funktionen geben ein Promise zurück und
laufen über das `BikeRepository`. Im JSON-Modus (Standard) stecken die Daten in einem eigenen Chunk;
im Supabase-Modus liest die App über die Daten-API und prüft jede Antwort mit Zod. Komponenten laden
über Suspense-Hooks mit TanStack Query; Fehler zeigen «Daten konnten nicht geladen werden» mit
«Erneut versuchen».

**Qualität (JSON-Modus):** Haupt-Bundle 139.9 kB gzip (React, Router, Motion, TanStack Query, ohne
Daten), Daten-Chunk 12.7 kB gzip, im Supabase-Modus stattdessen 31.7 kB gzip (Client und Zod, Stand
M7), CSS 12.4 kB gzip. Lighthouse Mobile zuletzt in M7 gemessen (`npm run preview`): Performance 93
(Start), 91 (Katalog), 89–91 (Detail), 88–90 (Vergleich), 92 (Match); Barrierefreiheit, Best
Practices und SEO je 100. Seither haben sich nur die Kopfdaten, die Header und die Rechtstexte
geändert; neu messen auf der echten Domain. axe-core (WCAG 2.2 AA) in M7: keine Befunde auf 16 Seiten
in 360/768/1280 px, dunkel und hell. Unter der neuen Content Security Policy (`wrangler dev`): keine
Verstösse und keine Konsolenfehler auf Start, Katalog mit Filtern, Detail mit Video, Vergleich,
Match und Datenschutz.

## 5. Abweichungen vom Master Prompt

Verglichen mit `docs/MASTER_PROMPT.md`. Begründungen ausführlich in `DECISIONS.md`.

| Thema                     | Abweichung                                                                                | Grund                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| TypeScript                | Version 6.0 statt 7                                                                       | `typescript-eslint` unterstützt TypeScript 7 noch nicht.                                         |
| Barrierefreiheits-Linting | ohne `eslint-plugin-jsx-a11y`                                                             | Plugin unterstützt ESLint 10 noch nicht; geprüft wird stattdessen mit axe-core und Lighthouse.   |
| Generations-ID            | `<modell-id>-<erstes Baujahr>` (z. B. `yamaha-mt-07-2025`) statt «von–bis»                | bleibt stabil, wenn eine laufende Generation ein Endjahr bekommt – geteilte Links brechen nicht. |
| Zusatzfelder              | `chassis.weightNote`; `description` bei Extras                                            | Gewicht «ohne Kraftstoff» sichtbar machen statt umrechnen; Erklärung für Einsteiger als Tooltip. |
| Führerausweis A1          | keine kW/kg-Grenze                                                                        | Schweizer Recht (VZV) kennt sie nicht; die 0.1 kW/kg stammen aus dem EU-Recht.                   |
| Drosselung                | Die «doppelte Leistung»-Regel wird nicht berechnet, nur die offizielle Drosselung geprüft | Die Regel betrifft die Typengenehmigung; offizielle 35-kW-Versionen erfüllen sie per Definition. |
| Beispieldaten             | kein Bike ohne Extras, kein Audio                                                         | In den echten Daten hat jedes Bike Extras; die bedingte Anzeige ist mit Unit-Tests abgesichert.  |
| Katalogkarte              | «+1 weitere Generation» statt «+2 weitere Baujahre»                                       | Eine Generation fasst mehrere Baujahre zusammen.                                                 |
| Video-Review              | ohne Vorschaubild                                                                         | Auch ein Vorschaubild käme von Google-Servern; so geht vor dem Klick keine Anfrage an YouTube.   |
| Vergleich                 | «Bike hinzufügen» über der Beschriftungsspalte statt als leere Spalte                     | Kein leerer Tabellenbereich, besonders auf dem Handy.                                            |
| Match-Wizard              | mit A1 nur 2 Treffer statt 3–5                                                            | Im Datensatz sind nur 2 A1-Bikes; Bikes, die man nicht fahren darf, werden nie vorgeschlagen.    |
| Animationen               | Ring-Gauges animieren `pathLength`; beim ersten Laden keine Einblendung der Seite         | Ein Ring lässt sich nicht anders füllen; die erste Seite soll sofort sichtbar sein (LCP).        |
| SEO                       | Kanonische URLs, absolutes Vorschaubild und Sitemap nur mit `VITE_SITE_URL`               | Die Domain steht noch nicht fest; Open Graph und Sitemaps verlangen absolute Adressen.           |
| Zeilentypen (M7)          | von Hand in `src/data/db/rows.ts` statt mit `supabase gen types typescript` erzeugt       | Das Generieren braucht das Supabase-Projekt; wird danach ersetzt.                                |
| Prerendering (M8)         | nur Kopfdaten (Titel, Beschreibung, Open Graph) pro Seite und Bike, Inhalt per JavaScript | Vollständiges Prerendering mit Hydration wäre aufwendig und fehleranfällig; Google rendert JS.   |
| 404 (M8)                  | unbekannte Pfade liefern die App mit Status 200 und «noindex» statt eines echten 404      | Single-Page-App bei Cloudflare ohne Worker-Code; so von Google für Single-Page-Apps empfohlen.   |
| Rechtstexte (M8)          | Name, Adresse und E-Mail kommen aus Build-Variablen statt direkt in den Text              | Persönliche Daten gehören nicht ins öffentliche Repository; auf der Website erscheinen sie.      |

## 6. Bekannte Probleme und offene Fragen

**Bekannte Probleme**

- M7 ist noch nicht abgenommen: `seed`, `check:rls`, `export:data` und der Supabase-Modus liefen
  nur gegen nachgebaute Server. Katalog, Detailseite und Vergleich mit echten Supabase-Daten sind
  noch nicht geprüft.
- Die CI (`.github/workflows/ci.yml`, `.gitleaks.toml`) liegt auf dem Branch
  `claude/ci-gitleaks-37cb59` und ist noch nicht in `main`. Der lokale gitleaks-Scan über die ganze
  Historie fand keine Schlüssel.
- Lighthouse Mobile: Vergleichs- und Detailseite liegen um 90 (88–91 je nach Lauf). Im
  Supabase-Modus kommt die Antwortzeit der API dazu – auf der echten Domain messen.
- Im Gratis-Tarif pausiert Supabase ein Projekt nach einer Woche mit zu wenig Aktivität; die Website
  zeigt dann eine Fehlermeldung. Reaktivieren: Anleitung im README.
- 6 von 20 Generationen sind als `needsVerification` markiert und auf der Detailseite sichtbar als
  «Daten werden noch geprüft» gekennzeichnet (Gründe in `DECISIONS.md`, M1).
- Führerausweis-Grenzwerte müssen vor dem Livegang gegen die Angaben der Strassenverkehrsämter
  geprüft werden; zwei Rechtsfragen sind offen (Details in `DECISIONS.md`, «Offen»).
- Impressum und Datenschutz sind Entwürfe: `[NAME]`, `[ADRESSE]` und `[E-MAIL]` kommen aus den
  Build-Variablen `VITE_OPERATOR_*`, `[REGION DER DATENBANK]` wird nach dem Anlegen des
  Supabase-Projekts ersetzt. Beide Texte vor dem Livegang von einer Fachperson prüfen lassen.
- Ohne Worker-Code liefert Cloudflare für jede unbekannte Adresse `index.html` mit Status 200 – auch
  für fehlende Dateien wie `/assets/alt.js`. Seiten setzen dann «noindex».
- Ein geteilter Vergleich zeigt in der Vorschau nur den allgemeinen Titel «Vergleich · MotoMatch».
- Top Speed und 0–100 km/h fehlen bei den meisten Bikes und erscheinen als «k. A.».
- Mit A1 schlägt der Match-Wizard nur 2 Bikes vor (zu wenige A1-Modelle im Datensatz).
- Beim Ducati Monster 2026 ist das Gewicht ohne Kraftstoff angegeben und wird trotzdem verglichen
  (Hinweis in der Zelle).
- Im Vergleich steht eine ältere Generation nur in der URL; die Vergleichsleiste merkt sich nur das Modell.
- Die Prüfskripte für axe, Lighthouse, Tastatur und Screenshots sowie die nachgebauten
  Supabase-Server liegen nur im temporären Arbeitsordner früherer Sitzungen.
- Keine Lizenzdatei: Ohne Lizenz darf niemand den öffentlichen Code weiterverwenden.
- Auf diesem Rechner läuft Node 22.19; das Projekt verlangt mindestens 22.22 (empfohlen 24, wie bei
  Cloudflare und in der CI). Alles läuft, `npm install` warnt aber.

**Offene Fragen an dich**

1. Soll ich den Branch `claude/ci-gitleaks-37cb59` (CI mit gitleaks) in `main` mergen?
2. Supabase-Region: «Central Europe (Zurich)» (empfohlen, liegt in der Schweiz) oder «Central EU
   (Frankfurt)»?
3. Ist kommerzielle Nutzung geplant (Werbung oder Affiliate-Links)? Davon hängen die Pflichtangaben
   im Impressum und die erneute Prüfung der Bedingungen von Supabase und Cloudflare ab.
4. Soll es eine Besucherstatistik geben? Wenn ja, eine cookiefreie, datensparsame (sie muss in die
   Datenschutzerklärung).
5. Soll das Repository eine Lizenz bekommen, und wenn ja, welche?
6. Sollen weitere Bikes recherchiert werden, vor allem für A1 und A beschränkt?

Durch den Master Prompt geklärt: Hosting bei Cloudflare, Wunsch-Domain `motomatch.ch` (Kauf durch dich),
Impressum-Angaben füllst du selbst aus, M6 vor Phase 2 (erledigt). Von dir am 23.10.2026 entschieden:
M8 ohne Konten vorbereiten, solange das Supabase-Projekt fehlt; Prüfungen und Secret-Scan als
GitHub-CI.

## 7. Supabase

**Code bereit, noch kein Projekt** – es gibt weder Konto noch Projekt noch `.env.local`.

- Schema: `supabase/migrations/20261004120000_initial_schema.sql` mit sechs Tabellen
  (`manufacturers`, `features`, `models`, `generations`, `generation_features`,
  `generation_sources`), CHECK-Constraints und Indizes. Row Level Security auf allen Tabellen mit
  reinen Lese-Policies; zusätzlich sind `anon` und `authenticated` alle Rechte ausser Lesen entzogen.
- App: `src/lib/supabaseRepository.ts` (nur im Supabase-Build) über `@supabase/postgrest-js`;
  Zeilentypen, Mapping und Client in `src/data/db/`.
- Skripte: `npm run seed` (Upsert, löscht nie, `--dry-run`), `npm run check:rls`,
  `npm run export:data`. Alle drei sind gegen nachgebaute Server getestet, nicht gegen Supabase.
- Umgebungsvariablen (nur Namen, alle in `.env.example` mit leeren Platzhaltern):
  `VITE_DATA_SOURCE` (`json` oder `supabase`), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
  (öffentlicher Schlüssel, landet im Browser) und `SUPABASE_SECRET_KEY` (nur lokal für den Seed,
  nie mit `VITE_`-Präfix). Dazu `VITE_SITE_URL` und `VITE_OPERATOR_NAME`, `VITE_OPERATOR_ADDRESS`,
  `VITE_OPERATOR_EMAIL` (Impressum).
- Schutz: Der Build bricht ab, wenn eine `VITE_`-Variable einen geheimen Schlüssel enthält; der Seed
  lehnt öffentliche, `check:rls` geheime Schlüssel ab. `.gitignore` schliesst `.env`, `.env.*`
  (ausser `.env.example`) und `*.local` aus. Im Repository stehen nur erfundene Test-Schlüssel.
- Gratis-Tarif (Stand 4.10.2026): 500 MB Datenbank, 5 GB Egress plus 5 GB gecachter Egress,
  2 aktive Projekte, unbegrenzte API-Anfragen; Pausieren nach einer Woche mit zu wenig Aktivität,
  Reaktivieren bis 1 Jahr danach. Quellen in `DECISIONS.md`, M7.
- Datenschutz (Stand 23.10.2026): Supabase protokolliert pro Anfrage u. a. IP-Adresse, User-Agent
  und Referrer; die Protokolle liegen in der EU (im Gratis-Tarif 1 Tag einsehbar). Supabase ist
  nicht nach dem Data Privacy Framework zertifiziert, Grundlage sind Standarddatenschutzklauseln.
  Region ausdrücklich «Central Europe (Zurich)» wählen, nicht die allgemeine Region «Europe».
  Details in `DECISIONS.md`, M8.

## 8. Cloudflare

**Konfiguration bereit, noch kein Konto.**

- `wrangler.jsonc`: Worker `motomatch` mit statischen Dateien aus `dist`, ohne Worker-Code;
  unbekannte Pfade liefern `index.html` (Single-Page-App), `dist/bikes.html` erscheint unter `/bikes`;
  keine Worker-Logs, keine Nutzungsstatistik von Wrangler. Wrangler 4.152 als devDependency.
- Workers Builds mit GitHub: Build `npm run build`, Deploy `npx wrangler deploy`, Node aus `.nvmrc`.
  Die `VITE_`-Variablen gehören zu den **Build-Variablen**, nicht zu den Laufzeit-Variablen; nie
  `SUPABASE_SECRET_KEY`.
- Der Build schreibt `dist/_headers`: Content Security Policy, `X-Frame-Options: DENY`, `nosniff`,
  Referrer- und Permissions-Policy; `/assets/*` ein Jahr im Cache.
- Domain: Zone bei Cloudflare (Nameserver-Wechsel), Custom Domain am Worker, `www` per Redirect Rule;
  «Always Use HTTPS» an, Bot Fight Mode und Web Analytics aus, HSTS erst nach erfolgreichem Test.
- Gratis-Tarif und Bedingungen (Stand 23.10.2026): statische Anfragen gratis und unbegrenzt,
  3’000 Build-Minuten pro Monat; keine Einschränkung kommerzieller Nutzung gefunden. Quellen in
  `DECISIONS.md`, M8.
- Lokal so prüfen, wie Cloudflare ausliefert: `npm run preview:cloudflare`.

## 9. Checkliste bis zum Livegang

**Du** (Konten, Domain, Angaben – Anleitungen im README):

1. Supabase-Projekt anlegen (Region «Central Europe (Zurich)»), Migration im SQL Editor ausführen,
   `.env.example` nach `.env.local` kopieren und `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
   und `SUPABASE_SECRET_KEY` eintragen – nie in den Chat oder ins Repository. Danach Bescheid geben.
2. Entscheiden, ob die CI (Branch `claude/ci-gitleaks-37cb59`) in `main` kommt.
3. Cloudflare-Konto anlegen und den Worker aus dem GitHub-Repository einrichten, mit den
   Build-Variablen («Bei Cloudflare einrichten»).
4. `motomatch.ch` prüfen (frei? Markenregister Swissreg), kaufen und verbinden («Eigene Domain
   verbinden»); dabei «Always Use HTTPS» ein-, Bot Fight Mode und Web Analytics ausschalten.
5. Impressum-Angaben als Build-Variablen `VITE_OPERATOR_NAME`, `VITE_OPERATOR_ADDRESS` (Postadresse,
   kein Postfach) und `VITE_OPERATOR_EMAIL` eintragen, für die lokale Ansicht auch in `.env.local`.
6. Google Search Console einrichten und die Sitemap einreichen («Bei Google anmelden»).
7. Impressum und Datenschutzerklärung von einer Fachperson prüfen lassen.

**Ich** (sobald deine Schritte erledigt sind):

1. M7 abnehmen: `npm run seed`, `npm run check:rls`, Katalog, Detailseite, Vergleich und Fehlerfall
   mit `VITE_DATA_SOURCE=supabase`, Zeilentypen generieren, `[REGION DER DATENBANK]` ersetzen.
2. Die Live-Seite prüfen: Direktaufrufe, Header, Sitemap, Vorschau beim Teilen, Lighthouse Mobile
   ≥ 90, axe, Darstellung bei 360, 768 und 1280 px, Footer- und Führerausweis-Hinweise.
3. Secret-Scan grün (CI), `needsVerification`-Einträge klären oder markiert lassen, Preise
   aktualisieren, Führerausweis-Grenzwerte gegen die Strassenverkehrsämter prüfen.

## 10. Nächste Schritte

1. **Halt (du):** Supabase-Projekt anlegen (Checkliste, Punkt 1) und über den CI-Merge entscheiden.
2. **Danach (ich):** M7 abnehmen (Checkliste «Ich», Punkt 1); Halt zur Prüfung.
3. **Halt vor dem Livegang (du):** Cloudflare, Domain, Impressum-Angaben, Search Console
   (Checkliste, Punkte 3–7).
4. **M8 abschliessen (ich):** Live-Seite prüfen und die Checkliste abhaken.
5. Laufend: `needsVerification` klären, Führerausweis-Grenzwerte prüfen, Preise aktualisieren.
