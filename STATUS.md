# Projektstatus MotoMatch

**Stand: 5. Oktober 2026** · Branch `main`, synchron mit GitHub · letzter Code-Commit `db69745`

Diese Datei hält den aktuellen Stand fest. Sie wird zu Beginn jeder Sitzung gelesen und
nach jedem Meilenstein aktualisiert (siehe `CLAUDE.md`). Alle Angaben stammen aus Code, Daten
und Git-Historie; was sich daraus nicht belegen lässt, ist als offen markiert.

## 1. Kurzfazit

Phase 1 (M0–M6) ist abgeschlossen. M7 (Datenbank mit Supabase) ist so weit gebaut, wie es ohne
Supabase-Konto geht: Die Datenschicht ist asynchron und kennt zwei Quellen (JSON und Supabase), die
SQL-Migration mit Row Level Security, `seed`, `check:rls` und `export:data` liegen bereit und sind
gegen nachgebaute Server getestet. Die Website läuft weiterhin mit den JSON-Daten. Jetzt ist der Halt
vor dem Supabase-Projekt: Du legst Konto und Projekt an, danach folgt die Abnahme mit echten Daten.
`build`, `test`, `validate:data` und `lint` laufen grün.

## 2. Meilensteine

| Meilenstein       | Status    | Stand                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M0 – Setup        | erledigt  | Vite, React, TypeScript, Tailwind, React Router, Motion, ESLint, Prettier und Vitest eingerichtet; Design-Tokens, Layout und Theme-Umschalter; mit GitHub verbunden.                                                                                                                                                                                         |
| M1 – Datenmodell  | erledigt  | Zod-Schema, 12 Modelle mit 20 Generationen aus belegten Quellen, Logik für Führerausweis, PS und Formatierung mit Tests.                                                                                                                                                                                                                                     |
| M2 – Katalog      | erledigt  | Suche, Sortierung und alle Filter (inkl. Führerausweis mit «drosselbare einschliessen») in der URL, Karten mit Layout-Animationen, Vergleichsleiste.                                                                                                                                                                                                         |
| M3 – Detailseite  | erledigt  | Generationen-Umschalter mit «Was ist neu?», Kerndaten mit Count-up, bedingte Extras, Tuning-Gauges, Sound, Profil-Radar, ähnliche Bikes, YouTube ganz unten.                                                                                                                                                                                                 |
| M4 – Vergleich    | erledigt  | 2–3 Bikes mit Generation pro Bike, Bestwerte, Differenz-Chips, «Nur Unterschiede», Radar-Overlay, Teilen-Link; auf dem Handy seitlich wischen mit Einrasten.                                                                                                                                                                                                 |
| M5 – Match-Wizard | erledigt  | Sechs Fragen, getestete Bewertung in `src/lib/match.ts`, 3–5 Treffer mit Match-Prozent und Begründung, Antworten in der URL.                                                                                                                                                                                                                                 |
| M6 – Feinschliff  | erledigt  | Barrierefreiheit (axe ohne Befund, Tastatur geprüft), Lighthouse Mobile Performance 92–95, SEO über `VITE_SITE_URL`, Vorschaubild, Impressum und Datenschutz als Entwürfe, README mit Screenshots.                                                                                                                                                           |
| M7 – Supabase     | in Arbeit | Erledigt: Repository-Schicht (JSON oder Supabase), TanStack Query mit Skeletons und «Erneut versuchen», SQL-Migration mit Row Level Security, `seed` mit `--dry-run`, `check:rls`, `export:data`, Mapping-Tests, Gratis-Tarif geprüft, README-Anleitungen. Offen: Supabase-Projekt (du), Migration, Seed und `check:rls` gegen die echte Datenbank, Abnahme. |
| M8 – Online       | offen     | Hosting bei Cloudflare mit Build bei jedem Push, eigene Domain mit HTTPS, Google Search Console, Rechtstexte, Secret-Scan. Halt davor: Konten und Domain.                                                                                                                                                                                                    |

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

Die JSON-Dateien bleiben die Quelle für den Seed und das Backup der Datenbank. Als Zeilen sind es
9 Hersteller, 18 Extras, 12 Modelle, 20 Generationen, 152 Extras-Zuordnungen und 75 Quellen
(`npm run seed -- --dry-run`). JSON → Datenbankzeilen → JSON ergibt dieselben Dateien.

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
scripts/           validate-data, seed, check-rls, export-data (mit lib/ für Daten und .env.local),
                   seoPlugin (Sitemap, kanonische URLs, robots.txt), preloadDataPlugin (Daten-Chunk)
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
```

**Wichtige Dateien**

- `src/lib/data.ts` – einzige Stelle für den Datenzugriff (asynchron); Komponenten nutzen
  `src/hooks/useBikeData.ts`
- `src/lib/repository.ts` – Interface `BikeRepository` und Wahl der Quelle über `VITE_DATA_SOURCE`;
  `jsonRepository.ts` und `supabaseRepository.ts` sind die beiden Quellen
- `src/lib/queries.ts` – Abfragen und Einstellungen für TanStack Query
- `src/data/db/mapping.ts` – Umrechnung Domain-Modell ↔ Datenbankzeilen (für App und Skripte)
- `src/data/db/keys.ts` – erkennt öffentliche und geheime Supabase-Schlüssel (Build-Schutz, Skripte)
- `src/lib/licence.ts` – Führerausweis-Logik (Grenzwerte als Konstanten)
- `src/lib/specs.ts` – Definitionen der technischen Daten (Detailseite und Vergleich)
- `src/lib/compare.ts`, `src/lib/match.ts`, `src/lib/matchAnswers.ts`, `src/lib/catalog.ts` – Logik von Vergleich, Wizard und Katalog
- `src/lib/motion.ts` – zentrale Animations-Tokens
- `src/main.tsx` – lädt Seiten-Chunk und Daten vor dem ersten Rendern
- `vite.config.ts` mit `scripts/seoPlugin.ts` und `scripts/preloadDataPlugin.ts`; bricht ab, wenn
  eine `VITE_`-Variable einen geheimen Schlüssel enthält
- `.env.example` – Vorlage der Umgebungsvariablen (nur Namen, keine Werte)
- `README.md` – Einstieg, Supabase-Einrichtung, Anleitung «Neues Bike hinzufügen»;
  `DECISIONS.md` – alle Entscheidungen

**npm-Skripte**

| Skript                  | Zweck                                           | Stand 5.10.2026                                                    |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`           | Entwicklungsserver                              | läuft, ohne Konsolenfehler                                         |
| `npm run build`         | Typprüfung und Produktions-Build                | grün                                                               |
| `npm run preview`       | Produktions-Build lokal ansehen                 | läuft                                                              |
| `npm test`              | Unit-Tests (Vitest)                             | grün – 18 Testdateien, 156 Tests                                   |
| `npm run test:watch`    | Tests im Watch-Modus                            | –                                                                  |
| `npm run validate:data` | Prüft alle JSON-Daten mit Zod                   | grün, mit Hinweis auf 6 × `needsVerification`                      |
| `npm run seed`          | Schreibt die JSON-Daten nach Supabase           | `--dry-run` grün; das Schreiben nur gegen einen Testserver geprüft |
| `npm run check:rls`     | Prüft, dass der öffentliche Schlüssel nur liest | nur gegen einen Testserver geprüft (es gibt noch kein Projekt)     |
| `npm run export:data`   | Schreibt die Datenbank zurück in JSON           | nur gegen einen Testserver geprüft                                 |
| `npm run lint`          | ESLint                                          | grün                                                               |
| `npm run typecheck`     | TypeScript ohne Build                           | grün                                                               |
| `npm run format`        | Prettier schreibt                               | –                                                                  |
| `npm run format:check`  | Prettier prüft                                  | grün                                                               |

**Datenzugriff:** `src/lib/data.ts` ist **asynchron** – alle Funktionen geben ein Promise zurück und
laufen über das `BikeRepository`. Im JSON-Modus (Standard) stecken die Daten in einem eigenen Chunk;
im Supabase-Modus liest die App über die Daten-API und prüft jede Antwort mit Zod. Komponenten laden
über Suspense-Hooks mit TanStack Query; Fehler zeigen «Daten konnten nicht geladen werden» mit
«Erneut versuchen».

**Qualität (Stand M7, JSON-Modus):** Haupt-Bundle 139.7 kB gzip (React, Router, Motion, TanStack
Query, ohne Daten), Daten-Chunk 12.7 kB gzip, im Supabase-Modus stattdessen 31.7 kB gzip (Client und
Zod), CSS 12.4 kB gzip. Lighthouse Mobile auf `npm run preview`: Performance 93 (Start), 91
(Katalog), 89–91 (Detail), 88–90 (Vergleich), 92 (Match); Barrierefreiheit, Best Practices und SEO
je 100. Direkt im Wechsel mit dem M6-Build gemessen sind Start- und Vergleichsseite gleichauf, die
Detailseite liegt 1–4 Punkte tiefer. axe-core (WCAG 2.2 AA): keine Befunde auf 16 Seiten in
360/768/1280 px, dunkel und hell; keine Konsolenfehler.

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
| Rechtstexte               | Platzhalter wie `[Vorname Nachname oder Firma]` statt `[NAME]`, `[ADRESSE]`, `[E-MAIL]`   | Entstanden vor der neuen Fassung; wird in M8 an die vorgegebenen Platzhalter angepasst.          |

## 6. Bekannte Probleme und offene Fragen

**Bekannte Probleme**

- M7 ist noch nicht abgenommen: `seed`, `check:rls`, `export:data` und der Supabase-Modus liefen
  nur gegen nachgebaute Server. Katalog, Detailseite und Vergleich mit echten Supabase-Daten sind
  noch nicht geprüft.
- Lighthouse Mobile: Vergleichs- und Detailseite liegen um 90 (88–91 je nach Lauf; der M6-Build lag
  am selben Rechner bei der Vergleichsseite gleich). Im Supabase-Modus kommt die Antwortzeit der API
  dazu – in M8 messen, Prerendering-Entscheid.
- Im Gratis-Tarif pausiert Supabase ein Projekt nach einer Woche mit zu wenig Aktivität; die Website
  zeigt dann eine Fehlermeldung. Reaktivieren: Anleitung im README.
- 6 von 20 Generationen sind als `needsVerification` markiert (Gründe in `DECISIONS.md`, M1).
- Führerausweis-Grenzwerte müssen vor dem Livegang gegen die Angaben der Strassenverkehrsämter
  geprüft werden; zwei Rechtsfragen sind offen (Details in `DECISIONS.md`, «Offen»).
- Impressum und Datenschutz sind Entwürfe: Betreiber, Adresse, E-Mail, Hosting-Anbieter und
  Aufbewahrungsdauer fehlen noch (Platzhalter in eckigen Klammern); Supabase muss in M8 in die
  Datenschutzerklärung. Beide Texte vor dem Livegang von einer Fachperson prüfen lassen.
- Top Speed und 0–100 km/h fehlen bei den meisten Bikes und erscheinen als «k. A.».
- Mit A1 schlägt der Match-Wizard nur 2 Bikes vor (zu wenige A1-Modelle im Datensatz).
- Beim Ducati Monster 2026 ist das Gewicht ohne Kraftstoff angegeben und wird trotzdem verglichen
  (Hinweis in der Zelle).
- Im Vergleich steht eine ältere Generation nur in der URL; die Vergleichsleiste merkt sich nur das Modell.
- Ohne `VITE_SITE_URL` enthält der Build keine kanonischen URLs, kein Vorschaubild für Open Graph und
  keine Sitemap. Beim Hosting braucht die Single-Page-App eine Weiterleitung aller Pfade auf
  `index.html`.
- Keine CI (kein `.github`-Ordner). Die Prüfskripte für axe, Lighthouse, Tastatur und Screenshots
  sowie die nachgebauten Supabase-Server liegen nur im temporären Arbeitsordner der Sitzung.
- Keine Lizenzdatei: Ohne Lizenz darf niemand den öffentlichen Code weiterverwenden.

**Offene Fragen an dich**

1. Supabase-Region: «Central Europe (Zurich)» (empfohlen, liegt in der Schweiz) oder «Central EU
   (Frankfurt)» wie im Master Prompt als Beispiel genannt?
2. Ist kommerzielle Nutzung geplant (Werbung oder Affiliate-Links)? Davon hängen die Pflichtangaben
   im Impressum und die Prüfung der Nutzungsbedingungen von Supabase und Cloudflare ab.
3. Soll es eine Besucherstatistik geben? Wenn ja, eine cookiefreie, datensparsame (sie muss in die
   Datenschutzerklärung).
4. Soll das Repository eine Lizenz bekommen, und wenn ja, welche?
5. Sollen die Prüfungen (Build, Tests, Daten, später gitleaks, axe und Lighthouse) als CI auf GitHub
   laufen?
6. Sollen weitere Bikes recherchiert werden, vor allem für A1 und A beschränkt?

Durch den Master Prompt geklärt: Hosting bei Cloudflare, Wunsch-Domain `motomatch.ch` (Kauf durch dich),
Impressum-Angaben füllst du selbst aus, M6 vor Phase 2 (erledigt).

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
  nie mit `VITE_`-Präfix). Dazu wie bisher `VITE_SITE_URL`.
- Schutz: Der Build bricht ab, wenn eine `VITE_`-Variable einen geheimen Schlüssel enthält; der Seed
  lehnt öffentliche, `check:rls` geheime Schlüssel ab. `.gitignore` schliesst `.env`, `.env.*`
  (ausser `.env.example`) und `*.local` aus. Im Repository stehen nur erfundene Test-Schlüssel;
  JWT-artige Test-Schlüssel entstehen erst zur Laufzeit (gitleaks folgt in M8).
- Gratis-Tarif (Stand 4.10.2026): 500 MB Datenbank, 5 GB Egress plus 5 GB gecachter Egress,
  2 aktive Projekte, unbegrenzte API-Anfragen; Pausieren nach einer Woche mit zu wenig Aktivität,
  Reaktivieren bis 1 Jahr danach; keine Einschränkung kommerzieller Nutzung gefunden. Quellen in
  `DECISIONS.md`, M7.

## 8. Nächste Schritte

1. **Halt (du):** Supabase-Konto und Projekt anlegen (Region Zürich empfohlen, sonst Frankfurt),
   `.env.example` nach `.env.local` kopieren und `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_PUBLISHABLE_KEY` und `SUPABASE_SECRET_KEY` eintragen – nie in den Chat oder ins
   Repository. Dann die Migration im SQL Editor ausführen (Anleitung im README).
2. **Danach (ich):** `npm run seed`, `npm run check:rls`, Katalog, Detailseite, Vergleich und
   Fehlerfall mit `VITE_DATA_SOURCE=supabase` prüfen, Zeilentypen generieren, Performance messen;
   M7 abschliessen und Halt zur Prüfung.
3. **Halt vor M8 (du):** Cloudflare-Konto, Domain `motomatch.ch` (vorher Verfügbarkeit und
   Markenregister prüfen), Google Search Console.
4. **M8:** Hosting, DNS und HTTPS, Prerendering-Entscheid, Rechtstexte mit `[NAME]`, `[ADRESSE]`,
   `[E-MAIL]` (inkl. Supabase in der Datenschutzerklärung), gitleaks, Checkliste vor dem Livegang
   (Liste «Offen» in `DECISIONS.md`).
5. Laufend: `needsVerification` klären, Führerausweis-Grenzwerte prüfen, Preise aktualisieren.
