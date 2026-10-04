# Projektstatus MotoMatch

**Stand: 4. Oktober 2026** · Branch `main`, synchron mit GitHub · letzter Code-Commit `80c1127`

Diese Datei hält den aktuellen Stand fest. Sie wird zu Beginn jeder Sitzung gelesen und
nach jedem Meilenstein aktualisiert (siehe `CLAUDE.md`). Alle Angaben stammen aus Code, Daten
und Git-Historie; was sich daraus nicht belegen lässt, ist als offen markiert.

## 1. Kurzfazit

MotoMatch läuft als reine Frontend-App ohne Backend (Phase 1): Katalog, Detailseite, Vergleich
und Match-Wizard sind fertig, und `build`, `test` und `validate:data` laufen grün. Meilenstein 6
(Feinschliff) ist in Arbeit: Barrierefreiheit und Performance sind geprüft, Rechtliches, ein Teil
der SEO-Arbeit und das README mit Screenshots fehlen noch. Für Phase 2 (Supabase) gibt es noch
keinen Code, und die neue Fassung des Master Prompts (`docs/MASTER_PROMPT.md`) liegt noch nicht im
Repository.

## 2. Meilensteine

| Meilenstein       | Status    | Stand                                                                                                                                                                                                      |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 – Setup        | erledigt  | Vite, React, TypeScript, Tailwind, React Router, Motion, ESLint, Prettier und Vitest eingerichtet; Design-Tokens, Layout und Theme-Umschalter; mit GitHub verbunden.                                       |
| M1 – Datenmodell  | erledigt  | Zod-Schema, 12 Modelle mit 20 Generationen aus belegten Quellen, Logik für Führerausweis, PS und Formatierung mit Tests.                                                                                   |
| M2 – Katalog      | erledigt  | Suche, Sortierung und alle Filter (inkl. Führerausweis mit «drosselbare einschliessen») in der URL, Karten mit Layout-Animationen, Vergleichsleiste.                                                       |
| M3 – Detailseite  | erledigt  | Generationen-Umschalter mit «Was ist neu?», Kerndaten mit Count-up, bedingte Extras, Tuning-Gauges, Sound, Profil-Radar, ähnliche Bikes, YouTube ganz unten.                                               |
| M4 – Vergleich    | erledigt  | 2–3 Bikes mit Generation pro Bike, Bestwerte, Differenz-Chips, «Nur Unterschiede», Radar-Overlay, Teilen-Link; auf dem Handy seitlich wischen mit Einrasten.                                               |
| M5 – Match-Wizard | erledigt  | Sechs Fragen, getestete Bewertung in `src/lib/match.ts`, 3–5 Treffer mit Match-Prozent und Begründung, Antworten in der URL.                                                                               |
| M6 – Feinschliff  | in Arbeit | Erledigt: axe-Prüfung ohne Befund, Lighthouse Mobile Performance 91–94, `robots.txt`. Offen: Impressum und Datenschutz, README mit Screenshots, SEO-Rest (Vorschaubild, kanonische URLs), Schluss-Prüfung. |
| M7                | offen     | Inhalt unbekannt: M7 ist im neuen Master Prompt definiert, der noch nicht im Repository liegt. Laut Hinweis betrifft die neue Fassung Phase 2 mit Supabase.                                                |
| M8                | offen     | Inhalt unbekannt, aus demselben Grund wie M7.                                                                                                                                                              |

## 3. Daten

**Dateien**

- `src/data/models/*.json` – ein Modell pro Datei (12 Dateien), Dateiname = Modell-ID
- `src/data/manufacturers.json` – Hersteller (id, name, country)
- `src/data/features.json` – Katalog der Extras (key, label, group, icon, description)
- `src/data/schema.ts` – Zod-Schemas, daraus die TypeScript-Typen
- `src/data/constants.ts` – Konstanten ohne Zod (Kategorien, Extra-Gruppen, Icons, YouTube-ID)
- `src/data/validateDataset.ts` und `scripts/validate-data.ts` – Prüfung (`npm run validate:data`)

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
public/          favicon.svg, robots.txt
scripts/         validate-data.ts
src/
  app/           App, Routen (pages.ts), Seitenübergänge, vorladbare Seiten (lazyPage)
  pages/         eine Datei pro Seite – je ein eigener Chunk
  components/    ui, layout, bike, catalog, detail, compare, match, charts, home
  data/          Schema, Konstanten, Prüfung und JSON-Daten
  hooks/         Daten-, URL- und UI-Hooks
  lib/           reine Logik mit Tests
  i18n/          de.ts – alle Texte der Oberfläche
  styles/        index.css (Tailwind), tokens.css (Design-Tokens)
  test/          Testdaten (fixtures.ts)
```

**Wichtige Dateien**

- `src/lib/data.ts` – einzige Stelle für den Datenzugriff; Komponenten nutzen `src/hooks/useBikeData.ts`
- `src/lib/licence.ts` – Führerausweis-Logik (Grenzwerte als Konstanten)
- `src/lib/specs.ts` – Definitionen der technischen Daten (Detailseite und Vergleich)
- `src/lib/compare.ts`, `src/lib/match.ts`, `src/lib/matchAnswers.ts`, `src/lib/catalog.ts` – Logik von Vergleich, Wizard und Katalog
- `src/lib/motion.ts` – zentrale Animations-Tokens
- `src/app/pages.ts` – Routentabelle; der Chunk der ersten Seite wird vor dem ersten Rendern geladen
- `DECISIONS.md` – alle Entscheidungen und Annahmen, `README.md` – Einstieg und Setup

**npm-Skripte**

| Skript                  | Zweck                            | Stand 4.10.2026                               |
| ----------------------- | -------------------------------- | --------------------------------------------- |
| `npm run dev`           | Entwicklungsserver               | läuft                                         |
| `npm run build`         | Typprüfung und Produktions-Build | grün                                          |
| `npm run preview`       | Produktions-Build lokal ansehen  | läuft                                         |
| `npm test`              | Unit-Tests (Vitest)              | grün – 15 Testdateien, 135 Tests              |
| `npm run test:watch`    | Tests im Watch-Modus             | –                                             |
| `npm run validate:data` | Prüft alle JSON-Daten mit Zod    | grün, mit Hinweis auf 6 × `needsVerification` |
| `npm run lint`          | ESLint                           | grün                                          |
| `npm run typecheck`     | TypeScript ohne Build            | grün                                          |
| `npm run format`        | Prettier schreibt                | –                                             |
| `npm run format:check`  | Prettier prüft                   | grün                                          |

**Datenzugriff:** `src/lib/data.ts` ist **noch synchron**. Die JSON-Dateien werden beim Build
mitgebündelt (`import.meta.glob`). Die Hooks in `src/hooks/useBikeData.ts` kapseln den Zugriff, und
die Seiten stecken bereits in Suspense-Grenzen. Für eine asynchrone Quelle müssen vor allem diese
beiden Dateien angepasst werden.

**Grösse (Produktions-Build):** Haupt-Bundle 95 kB gzip (inkl. React, Router und Daten), Motion 54 kB
gzip, CSS 12 kB gzip, jede Seite 0.4–10 kB gzip. Lighthouse Mobile (lokal auf `npm run preview`,
5 Seiten): Performance 91–94, Barrierefreiheit, Best Practices und SEO je 100.

## 5. Abweichungen vom Master Prompt

Verglichen mit der Fassung aus der ersten Sitzung (Phase 1). Mit der neuen Fassung in
`docs/MASTER_PROMPT.md` konnte noch nicht verglichen werden, weil die Datei fehlt. Begründungen
ausführlich in `DECISIONS.md`.

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

## 6. Bekannte Probleme und offene Fragen

**Bekannte Probleme**

- `docs/MASTER_PROMPT.md` fehlt – weder lokal noch auf GitHub. Abschnitt 2 (M7, M8), 5 und 8 sind
  deshalb nur für Phase 1 vollständig.
- 6 von 20 Generationen sind als `needsVerification` markiert (Gründe in `DECISIONS.md`, M1).
- Führerausweis-Grenzwerte müssen vor dem Livegang gegen die Angaben der Strassenverkehrsämter
  geprüft werden; zwei Rechtsfragen sind offen (Details in `DECISIONS.md`, «Offen»).
- Impressum und Datenschutz sind Platzhalter.
- Top Speed und 0–100 km/h fehlen bei den meisten Bikes und erscheinen als «k. A.».
- Mit A1 schlägt der Match-Wizard nur 2 Bikes vor (zu wenige A1-Modelle im Datensatz).
- Beim Ducati Monster 2026 ist das Gewicht ohne Kraftstoff angegeben und wird trotzdem verglichen
  (Hinweis in der Zelle).
- Im Vergleich steht eine ältere Generation nur in der URL; die Vergleichsleiste merkt sich nur das Modell.
- Keine Domain festgelegt: Es fehlen kanonische URLs, ein Vorschaubild für Open Graph und eine
  Sitemap. Beim Hosting braucht die Single-Page-App eine Fallback-Regel auf `index.html`.
- Keine CI (kein `.github`-Ordner). Die Prüfskripte für axe, Lighthouse und Screenshots lagen
  nur im temporären Arbeitsordner der Sitzung und sind nicht im Repository.
- Lighthouse wurde lokal gemessen; die Vergleichsseite liegt mit 91 knapp über dem Ziel von 90.

**Offene Fragen an dich**

1. Kannst du den neuen Master Prompt als `docs/MASTER_PROMPT.md` ablegen? Danach ergänze ich M7, M8
   und die Abweichungen zu Phase 2.
2. Unter welcher Domain und bei welchem Hosting soll MotoMatch laufen (für kanonische URLs,
   Vorschaubild und Fallback-Regel)?
3. Welche Angaben sollen ins Impressum? Achtung: Sie werden im öffentlichen Repository und auf der
   Website sichtbar.
4. Soll M6 abgeschlossen werden, bevor Phase 2 beginnt?
5. Sollen die Prüfskripte (axe, Lighthouse) ins Repository und als CI auf GitHub laufen?
6. Sollen weitere Bikes recherchiert werden, vor allem für A1 und A beschränkt?

## 7. Supabase

**noch nichts** – kein Schema, kein Seed-Skript, keine Repository-Schicht, kein Supabase-Paket in
`package.json`. Der Code liest keine Umgebungsvariablen (`import.meta.env` wird nicht verwendet),
und es gibt keine `.env`-Dateien. `.gitignore` schliesst `.env` und `.env.*` aus (erlaubt nur eine
künftige `.env.example`).

## 8. Nächste Schritte

1. `docs/MASTER_PROMPT.md` ins Repository legen; danach `STATUS.md` und `CLAUDE.md` an M7/M8 anpassen.
2. M6 abschliessen: Impressum und Datenschutz (Text mit Platzhaltern), README mit Screenshots und
   der Anleitung «Neues Bike hinzufügen», Entscheidungen zu M6, Schluss-Prüfung bei 360, 768 und
   1280 px inkl. reduzierter Bewegung, Push.
3. SEO-Rest, sobald die Domain feststeht: kanonische URLs, Vorschaubild, Sitemap, Fallback-Regel
   beim Hosting.
4. Daten pflegen: `needsVerification` klären, Preise aktualisieren, Grenzwerte prüfen, eventuell
   weitere A1- und A35-Bikes.
5. Phase 2 nach dem neuen Master Prompt. Aus Sicht des Codes beginnt die Umstellung bei der
   Datenschicht (`src/lib/data.ts`, `src/hooks/useBikeData.ts`); die Reihenfolge der Schritte
   (Schema, Seed-Skript, Repository-Schicht) richtet sich nach M7 und M8.
