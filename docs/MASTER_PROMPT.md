MotoMatch – Master Prompt
1. Rolle und Arbeitsweise
Du bist ein erfahrener Frontend-Entwickler und UI-Designer. Du baust für mich MotoMatch, eine Motorrad-Vergleichs-Website, Schritt für Schritt. Nach jedem Meilenstein muss das Projekt lauffähig sein.

* Schlage zuerst kurz eine Ordnerstruktur und einen Plan vor, dann arbeite die Meilensteine aus Abschnitt 12 der Reihe nach ab.
* Halte nach Meilenstein 2 und nach Meilenstein 4 an. Fasse in wenigen Sätzen zusammen, was steht und wie ich es starte, damit ich es prüfen kann.
* Bei Unklarheiten: Triff eine sinnvolle Annahme, halte sie in `DECISIONS.md` fest und arbeite weiter. Frag nur nach, wenn eine Entscheidung später kaum rückgängig zu machen ist.
* Erfinde keine Daten. Das gilt für Messwerte, Preise, Quellen-URLs und YouTube-Links (siehe Abschnitt 10).
* Schreibe verständlichen Code (klare Namen, kleine Komponenten). Ich will ihn nachvollziehen und selbst erweitern können.
* Das Projekt ist mit meinem GitHub-Repository verbunden (Abschnitt 13). Committe in kleinen, sinnvollen Schritten und pushe regelmässig.
* Das Projekt hat zwei Phasen: Phase 1 (M0–M6) läuft lokal mit JSON-Daten. In Phase 2 (M7–M8) kommen die Daten in eine Supabase-Datenbank und die Seite ins Internet (Abschnitte 14 und 15). Halte vor M7 und M8 an und sag mir, welche Konten ich anlegen muss. Bitte mich nie, Passwörter oder Schlüssel in den Chat zu schreiben.

2. Projekt
MotoMatch hilft Leuten in der Schweiz, das passende Motorrad zu finden. Die Kernfunktion ist der Vergleich: Bikes nebeneinander legen und alle wichtigen Daten sofort sehen. Dazu kommt ein Fragebogen, der passende Modelle vorschlägt.

* Markt: Schweiz (CHF, Schweizer Führerausweis-Kategorien, Schweizer Rechtslage)
* Sprache der Oberfläche: Deutsch, Schweizer Schreibweise (also «ss» statt «ß»)
* Zielgruppe: Einsteiger bis Enthusiasten, vor allem auf dem Handy
* Claim (anpassbar): «Finde das Bike, das zu dir passt.»
* Nicht Teil von Phase 1 (M0–M6): Datenbank und Backend (kommen in Phase 2 mit Supabase), Benutzerkonten, Nutzerbewertungen, Occasionsmarkt, Händlersuche, Scraping fremder Websites

3. Tech-Stack

* React + TypeScript (strict) + Vite, React Router
* Tailwind CSS, Design-Tokens als CSS-Variablen
* Motion (ehemals Framer Motion) für Animationen, `lucide-react` für Icons
* Gauges und Radar-Chart als eigene SVG-Komponenten (keine schwere Chart-Bibliothek)
* Zod zur Validierung der Daten, Vitest für Tests der reinen Logik
* Phase 1: Daten als JSON-Dateien im Repo, kein Backend. Der Zugriff läuft über eine dünne, asynchrone Schicht (`src/lib/data.ts`, alle Funktionen geben ein Promise zurück), damit in Phase 2 Supabase (PostgreSQL) dahinter passt, ohne dass sich die Komponenten ändern (Abschnitt 14).
* Schriften selbst hosten (z. B. Fontsource), kein Google-Fonts-CDN
* ESLint + Prettier. Skripte: `dev`, `build`, `test`, `validate:data`

4. Design
Modern, clean, hochwertig.

* Dunkles Theme als Standard, helles Theme per Umschalter (Wahl merken).
* Farben: fast schwarzer Hintergrund (ca. #0B0C0F), helle Schrift, eine Akzentfarbe (Signal-Orange, ca. #FF5A1F) für Aktionen und «Gewinner»-Hervorhebungen. Sparsam einsetzen.
* Typografie: grosse, selbstbewusste Überschriften, Zahlen mit `tabular-nums`. Eine Schrift für die Oberfläche (z. B. Inter oder Geist), eine für Headlines (z. B. Space Grotesk oder Sora).
* Karten mit grossen Radien (16–24 px), feinen Rahmen, weichem Glow, viel Weissraum. Sticky Leisten mit Blur.
* Mobile first (ab 360 px), danach Tablet und Desktop.
* Keine geschützten Bilder und keine Herstellerlogos. Verwende generische Bike-Silhouetten als SVG-Platzhalter, Herstellernamen nur als Text.
* Preise im Schweizer Stil: «CHF 12’490.–» (Apostroph als Tausendertrenner).

5. Animationen (viele, aber sauber)
Lege ein zentrales Animations-System an (`src/lib/motion.ts`) mit Tokens für Dauer, Easing und Spring, damit alles einheitlich wirkt. Dauer 150–600 ms, Stagger 40–60 ms, animiere nur `transform` und `opacity`.

* Hero: Headline wortweise einblenden, animierter Tacho, dessen Nadel beim Laden ausschlägt und auf Scroll reagiert, dezenter animierter Verlauf bzw. Lichteffekt.
* Seitenwechsel: sanfte Übergänge (AnimatePresence). Das Bike-Bild wandert per `layoutId` von der Karte in die Detailseite.
* Katalog: Karten erscheinen gestaffelt. Beim Filtern und Sortieren ordnen sie sich per Layout-Animation neu an. Hover mit leichtem Anheben und Tilt (nur bei Maus) und Bild-Zoom.
* Vergleichsleiste: gleitet von unten ein, sobald ein Bike gewählt ist. Ein Mini-Bild «fliegt» hinein.
* Vergleich: Zahlen zählen hoch, Balken wachsen beim Einblenden von 0, der beste Wert pro Zeile bekommt Akzent und Glow, Abschnitte klappen animiert auf und zu.
* Wertungen: 1–10 als animierte Ring-Gauges, Profilwerte als Radar-Chart, das sich aufbaut.
* Sound: Equalizer-Balken bei laufender Wiedergabe (nur wenn Audio vorhanden ist).
* Mikro-Interaktionen: Buttons mit Spring, Toggles, Chips, Skeleton-Loader statt Spinner.
* Match-Wizard: Schritte schieben animiert ein, Fortschrittsbalken, Ergebnis mit hochzählenden Match-Prozenten.
* Pflicht: `prefers-reduced-motion` respektieren (dann nur noch Fades). Schwere Effekte auf dem Handy abschwächen, 60 fps halten.

6. Datenmodell
Ein Eintrag ist ein Modell mit einer oder mehreren Generationen (Abschnitt 7). Feldnamen im Code sind englisch, Beschriftungen auf der Seite deutsch.

```ts
type Availability = 'standard' | 'optional' | 'none';
type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Estimated<T> = { value: T; kind: 'official' | 'tested' | 'estimate' };

interface Model {
  id: string;                   // z. B. "yamaha-mt-07"
  manufacturerId: string;
  name: string;
  category: 'naked' | 'supersport' | 'sport' | 'touring' | 'adventure'
          | 'enduro' | 'supermoto' | 'cruiser' | 'retro' | 'scooter';
  tagline?: string;             // ein Satz, Deutsch
  generations: Generation[];    // chronologisch
}

interface Generation {
  id: string;                   // z. B. "yamaha-mt-07-2022-2024"
  yearFrom: number;
  yearTo: number | null;        // null = aktuell erhältlich
  changes?: string[];           // «Was ist neu?» gegenüber der Vorgängerversion
  colors?: string[];            // rein kosmetisch, löst keine neue Generation aus
  engine: {
    displacementCc: number;     // Anzeige: «Hubraum (cm³)»
    cylinders: number;
    layout: string;             // «Reihen-Zweizylinder», «V2», «Einzylinder» ...
    cooling: 'air' | 'liquid' | 'air-oil';
    powerKw: number;            // Quelle der Wahrheit, PS wird berechnet (1 PS = 0.7355 kW)
    powerRpm?: number;
    torqueNm: number;           // Newtonmeter
    torqueRpm?: number;
  };
  performance: {                // oft nur Testwerte: Art der Quelle immer angeben
    topSpeedKmh?: Estimated<number>;
    accel0to100s?: Estimated<number>;
  };
  chassis: {
    weightKg: number;           // fahrbereit laut Hersteller, ohne Fahrer
    seatHeightMm: number;
    tankL: number;
    consumptionL100km?: number;
    gears: number;
    drive: 'chain' | 'shaft' | 'belt';
  };
  throttle: { available: boolean; throttledPowerKw?: number; note?: string };
  quickshifter: Availability;
  blipper: Availability;        // Auto-Blipper: Runterschalten ohne Kupplung
  price: { chf: number; asOf: string; note?: string };   // Listenpreis, ISO-Datum
  scores: {                     // redaktionelle Einschätzungen, Skalen siehe unten
    tuningVisual: Score;
    tuningPerformance: Score;
    sound: Score;
    profile: { beginner: Score; city: Score; touring: Score; sport: Score; offroad: Score };
  };
  tuningNote: string;           // kurz: was ist in der Schweiz legal bzw. eintragbar, was nicht
  sound: { description: string; audioSrc?: string; noiseDbA?: number };
  extras?: { key: string; availability: 'standard' | 'optional'; detail?: string }[];
  youtubeReviewUrl?: string;
  images?: { hero?: string; gallery?: string[]; credit?: string };
  sources: { label: string; url: string }[];
  dataStatus: 'verified' | 'needsVerification';
  lastChecked: string;          // ISO-Datum
}

```

Dazu zwei Stammdateien:

* `manufacturers.json`: id, name, country
* `features.json`: Katalog aller möglichen Extras mit `key`, deutschem Label, Gruppe (Komfort, Sicherheit, Fahrwerk, Elektronik, Technik) und Icon. Beispiele: Griffheizung, Sitzheizung, verstellbares Fahrwerk, elektronisches Fahrwerk, Tempomat, TFT-Display, Smartphone-Anbindung, Kurven-ABS, Schlupfregelung, Fahrmodi, Anti-Hopping-Kupplung, Kurvenlicht, Zentralständer, Reifendruckkontrolle, verstellbare Scheibe, Keyless, USB-Anschluss.

Berechnete Werte (nie speichern, in `src/lib/` mit Tests): PS aus kW (Anzeige «95 PS (70 kW)»), Leistungsgewicht in kW/kg, Reichweite aus Tankinhalt und Verbrauch, Führerausweis-Kategorie (Abschnitt 8).
Anzeige von Top Speed und 0–100: Bei `estimate` mit «ca.» anzeigen, ein Tooltip nennt die Art der Quelle.
Skalen 1–10 für Tuning (immer als «Redaktionelle Einschätzung» kennzeichnen, mit Info-Tooltip):

* Tuning Optik: 1 = kaum Zubehör, 5 = übliche Teile (Lenker, Spiegel, Heck, Sitzbank, Verkleidungsteile), 10 = riesiger Zubehörmarkt, vieles problemlos eintragbar
* Tuning Leistung: 1 = praktisch nichts legal möglich, 5 = zugelassene Auspuff-, Filter- und Mapping-Kombinationen, 10 = viele legale Leistungsteile mit Gutachten bzw. Eintragung
* Es zählen nur Teile, die in der Schweiz legal sind (Typengenehmigung bzw. Eintragung beim Strassenverkehrsamt, Lärm- und Abgasvorschriften). Zeige dazu überall den Hinweis «Angaben ohne Gewähr, Eintragung beim Strassenverkehrsamt prüfen».

7. Baujahre und Generationen (wichtig)
Nicht jedes Modelljahr ist ein neuer Eintrag. Eine Generation fasst alle Jahre zusammen, in denen das Bike technisch identisch ist.

* Neue Generation nur bei relevanten Änderungen: Motor, Leistung, Drehmoment, spürbares Gewicht (Richtwert: mehr als 3 kg), Rahmen oder Fahrwerk, Elektronik, Quickshifter, Blipper, Extras, Drosselbarkeit oder Kategorie.
* Keine neue Generation bei neuen Farben, Grafiken oder reinen Preisänderungen. Dann wird der Zeitraum einfach verlängert, z. B. «MT-07 · 2022–2024».
* Anzeige: Baujahre als Badge (`2022–2024`, bei laufender Produktion `ab 2022`).
* Hat ein Modell mehrere Generationen, gibt es auf der Detailseite einen Umschalter (Segmented Control mit animiertem Indikator) und eine «Was ist neu?»-Liste aus `changes`.
* Im Katalog zeigt die Karte die neueste Generation und einen Hinweis wie «+2 weitere Baujahre».
* Im Vergleich lässt sich pro Bike die Generation wählen (Standard: neueste).

8. Anzeigeregeln
Bedingte Extras: nie ein leeres Feld

* Detailseite: Zeige nur Extras, die das Bike wirklich hat. Keine leeren Zeilen, keine «Nein»-Einträge. Ist die Liste leer, verschwindet der ganze Abschnitt. Optionales Zubehör bekommt ein Badge «Optional».
* Vergleich: Ein Extra erscheint, sobald mindestens eines der verglichenen Bikes es hat. Bikes ohne dieses Extra zeigen ein dezentes «–», nie eine leere Zelle. Hat keines der Bikes Extras, verschwindet der Abschnitt.
* Dasselbe Prinzip gilt für alle optionalen Daten: Audio-Player nur mit `audioSrc`, YouTube-Abschnitt nur mit `youtubeReviewUrl`, `noiseDbA`, `consumptionL100km`, Galerie.
* Kernfelder sind immer sichtbar: PS/kW, Drehmoment (Nm), Hubraum, Zylinder, Top Speed, 0–100, drosselbar (Ja/Nein, bei Ja mit Leistung), Preis, Quickshifter, Auto-Blipper, Gewicht, Sitzhöhe, Tank, Sound, Tuning-Wertungen, Führerausweis. Fehlt bei Top Speed oder 0–100 ein Wert, zeige «k. A.» in gedämpfter Farbe.
* Quickshifter und Auto-Blipper zeigen «Serie», «Optional» oder «Nein».

Führerausweis (Schweiz): abgeleitet, nicht gespeichert
Lege die Logik in `src/lib/licence.ts` mit Konstanten an und schreibe Unit-Tests.

* A1: bis 125 cm³ und bis 11 kW
* A beschränkt (A35): höchstens 35 kW und höchstens 0,2 kW pro kg Gewicht. Ein Bike mit 35 kW muss rechnerisch also mindestens 175 kg wiegen.
* A unbeschränkt: sobald eine der beiden Grenzen überschritten wird
* Ist `throttle.available` gesetzt und `throttledPowerKw` bekannt, prüfe zusätzlich, ob das Bike gedrosselt unter A beschränkt fällt, und zeige «Mit Drosselung A beschränkt möglich».
* `weightKg` ist nur ein Richtwert. Zeige überall «Richtwert, verbindlich ist der Fahrzeugausweis».
* Die Grenzwerte (auch eine mögliche Leistungsgewichts-Grenze bei A1) sind vor dem Livegang noch einmal gegen die Angaben der Strassenverkehrsämter zu prüfen. Notiere das in `DECISIONS.md`.

9. Seiten und Funktionen

1. Home (`/`): Hero mit Tacho-Animation, Suchfeld, «Beliebte Vergleiche», Kategorien als Kacheln, Button zum Match-Wizard.
2. Katalog (`/bikes`): Karten mit Bild, Name, Baujahren, PS, Nm, CHF, Führerausweis-Badge und Checkbox «Vergleichen». Suche, Sortierung (Preis, PS, Nm, Gewicht, Sitzhöhe), Filter für Hersteller, Kategorie, Preis, Leistung, Hubraum, Zylinder, drosselbar, Quickshifter, Blipper und Extras. Dazu ein Führerausweis-Filter (A1 / A beschränkt / A) mit Schalter «drosselbare Bikes einschliessen». Der Filterzustand steht in der URL.
3. Detailseite (`/bikes/:slug`): Hero, Kerndaten als grosse Zahlen mit Count-up, gruppierte Specs, Führerausweis-Info, Tuning-Gauges (Optik und Leistung) mit Hinweistext, Sound (Beschreibung, optional Audio), Profil-Radar, Extras (bedingt), Generationen-Umschalter, ähnliche Bikes. Ganz unten das YouTube-Review (siehe unten).
4. Vergleich (`/compare?bikes=a,b,c`): 2–3 Bikes nebeneinander.
   * Mobile: horizontal scrollbare Spalten mit Snap, die Zeilenbeschriftung bleibt links sichtbar.
   * Slot «Bike hinzufügen» mit Suche im Stil einer Befehlspalette.
   * Sticky Kopf mit Bild, Name, Generation und Entfernen-Button.
   * Abschnitte: Eckdaten, Motor & Leistung, Fahrwerk & Elektronik, Extras (bedingt), Tuning & Sound, Preis.
   * Schalter «Nur Unterschiede anzeigen».
   * Bester Wert pro Zeile hervorgehoben. Pro Feld gibt es `betterWhen: 'higher' | 'lower' | 'none'` (z. B. bei Preis und Gewicht ist weniger besser).
   * Differenz-Chips wie «+12 PS», Radar-Overlay, Link zum Teilen.
   * Ganz unten die YouTube-Reviews aller verglichenen Bikes.
5. Match-Wizard (`/match`, Meilenstein 5): Fragen zu Führerausweis, Körpergrösse (einfache, dokumentierte Heuristik für die passende Sitzhöhe), Budget, Einsatzzweck, Erfahrung und Wichtigkeit von Sound und Tuning. Ergebnis: 3–5 Bikes mit Match-Prozent und kurzer Begründung. Die Bewertungslogik ist eine reine, getestete Funktion (`src/lib/match.ts`).
6. Rechtliches: Platzhalterseiten für Impressum und Datenschutz. Footer-Hinweis: «Alle Angaben ohne Gewähr. Marken gehören den jeweiligen Inhabern, MotoMatch steht in keiner Verbindung zu den Herstellern.»

YouTube-Review: als Karte mit Titel und Play-Button. Das Video wird erst nach dem Klick geladen (`youtube-nocookie.com`), damit beim Seitenaufruf nichts von YouTube nachgeladen wird.
10. Beispieldaten

* Lege mindestens 12 Modelle an, die alle Führerausweis-Kategorien und mehrere Kategorien abdecken. Vorschlag: Yamaha MT-125, KTM 125 Duke, Yamaha MT-07, Kawasaki Z650, Aprilia RS 457, Royal Enfield Interceptor 650, KTM 390 Duke, Yamaha MT-09, Triumph Trident 660, Honda CB650R, Ducati Monster, BMW R 1300 GS.
* Mindestens 2 Modelle mit zwei Generationen (zeigt Umschalter und Zusammenlegen), mindestens 2 Bikes mit Extras und 1 ohne, mindestens 1 Bike mit YouTube-Link und 1 ohne. So lässt sich die bedingte Anzeige testen.
* Nimm Werte aus offiziellen Herstellerangaben. Wenn du Internetzugriff hast, schlage sie dort nach. Bist du dir bei einem Wert nicht sicher, lass ihn weg oder setze `dataStatus: "needsVerification"`. Preise sind Schweizer Listenpreise mit `asOf`.
* Erfinde keine URLs. Trage `sources` und `youtubeReviewUrl` nur ein, wenn du den Link wirklich kennst und bestätigen kannst. Sonst weglassen.
* Vergib die redaktionellen Wertungen (Tuning, Sound, Profil) plausibel und konsistent und halte `tuningNote` kurz.
* Bilder: nur Platzhalter, keine Fotos von Herstellern oder Webseiten einbinden oder hotlinken.

11. Qualität

* TypeScript strict, kein `any`. Alle JSON-Daten werden mit Zod validiert, `npm run validate:data` schlägt bei Fehlern fehl.
* Unit-Tests für: Führerausweis-Logik (Grenzfälle wie genau 35 kW bei 175 kg, drosselbar), PS-Umrechnung, Generationen-Anzeige, Match-Bewertung, Extras-Vereinigung im Vergleich.
* Barrierefreiheit: semantisches HTML, Tastaturbedienung, sichtbare Focus-Styles, Kontrast nach WCAG AA, Alternativtexte, Charts mit Textalternative.
* Performance: Lighthouse Mobile mindestens 90, Bilder lazy und responsive, Code-Splitting pro Route.
* SEO-Basis: Titel und Beschreibung pro Seite, sprechende URLs, Open-Graph-Tags.
* Alle Texte zentral in einer Datei, damit später eine Übersetzung möglich ist.
* README mit Setup, Struktur und einer Anleitung «Neues Bike hinzufügen».

12. Meilensteine
Phase 1 (lokal, mit JSON-Daten)

* M0: Setup (Vite, TypeScript, Tailwind, Router, Motion, ESLint, Vitest), Verbindung mit GitHub (Abschnitt 13), Design-Tokens, Layout, Theme-Umschalter
* M1: Datenmodell, Zod-Validierung, Beispieldaten, `src/lib/` (Führerausweis, PS, Formatierung) mit Tests
* M2: Katalog mit Filtern, Sortierung, Karten und Layout-Animationen → anhalten, ich prüfe
* M3: Detailseite (Generationen, bedingte Extras, Tuning, Sound, YouTube unten)
* M4: Vergleich nebeneinander (Unterschiede, Bestwerte, Link teilen, Mobile) → anhalten, ich prüfe
* M5: Match-Wizard
* M6: Feinschliff (Animationen, Barrierefreiheit, Performance, SEO, Rechtliches, README)

Phase 2 (online)

* M7: Datenbank mit Supabase (Abschnitt 14) → anhalten, ich prüfe
* M8: Veröffentlichen (Abschnitt 15)

13. Git und GitHub
Ich habe bereits ein GitHub-Repository erstellt: `REPO-ADRESSE-HIER-EINTRAGEN`. Dort soll der ganze Code liegen, damit ich von verschiedenen Laptops aus arbeiten kann und Firmen das Projekt in meinem GitHub-Profil ansehen können.

* Verbinde das Projekt gleich in Meilenstein 0 mit diesem Repository (`git init`, `git remote add origin …`, `main` als Standard-Branch). Ist der Ordner schon ein geklontes Repository (`git remote -v`), nutze es einfach. Steht oben noch der Platzhalter, frag mich nach der Adresse.
* Committe in kleinen, sinnvollen Schritten mit aussagekräftigen Nachrichten (z. B. `feat: Führerausweis-Filter im Katalog`) und pushe regelmässig, mindestens nach jedem Meilenstein.
* Lege früh eine passende `.gitignore` an (`node_modules`, `dist`, `.env`, `.env.local`). Committe nie Passwörter, Tokens oder `.env`-Dateien, nur eine `.env.example` mit leeren Platzhaltern.
* Das README ist die Visitenkarte des Projekts: Kurzbeschreibung, Screenshots, Tech-Stack, Features und ein Setup in wenigen Schritten (`git clone`, `npm install`, `npm run dev`), damit ich auf jedem Laptop sofort loslegen kann.
* Klappt der Push nicht (fehlende Anmeldung oder Berechtigung), sag mir, was ich tun muss. Schreibe Zugangsdaten nie in Remote-URLs oder Dateien.

14. Datenbank mit Supabase (Phase 2, M7)
Ich habe mich für Supabase (gehostetes PostgreSQL) entschieden. Die Motorraddaten liegen danach in einer Datenbank statt in JSON-Dateien. Die React-Seite liest sie direkt über die Supabase-API, ein eigenes Backend gibt es nicht. Das Domain-Modell aus Abschnitt 6 und die Komponenten bleiben unverändert.
Meine Aufgaben: Supabase-Konto und Projekt anlegen (Region in Europa, möglichst nah an der Schweiz, z. B. Frankfurt), URL und öffentlichen Schlüssel in `.env.local` eintragen. Gib mir dafür eine kurze Schritt-für-Schritt-Anleitung.
Deine Aufgaben:

1. Datenschicht umstellen: Definiere ein Interface (z. B. `BikeRepository`) mit zwei Implementierungen, `JsonRepository` (bleibt für Entwicklung und Tests) und `SupabaseRepository`. Eine Umgebungsvariable wählt die Quelle (`VITE_DATA_SOURCE=json|supabase`). Die Komponenten kennen nur das Interface.
2. Schema als SQL-Migration in `supabase/migrations/` (in Git versioniert, ich spiele es im SQL-Editor oder mit der Supabase-CLI ein). Tabellen: `manufacturers`, `models`, `generations`, `features`, `generation_features` (Extras mit `availability` und `detail`), `generation_sources`.
   * Text-IDs (Slugs) als Primärschlüssel, damit URLs und JSON-Daten 1:1 passen.
   * Verschachtelte Felder werden zu Spalten (z. B. `power_kw`, `seat_height_mm`), `Estimated<T>` zu zwei Spalten (Wert und Art), Listen wie `changes` und `colors` zu `text[]`.
   * Enums oder CHECK-Constraints für Kategorie, Kühlung, Antrieb, Verfügbarkeit und `data_status`, Wertungen von 1 bis 10, `year_to >= year_from`, positive Leistung und positives Gewicht.
   * Indizes auf den Filterspalten (Kategorie, Hersteller, Leistung, Preis).
   * Berechnete Werte (PS, Leistungsgewicht, Reichweite, Führerausweis) werden weiterhin nicht gespeichert. Die Logik gibt es nur einmal, in `src/lib/`.
3. Sicherheit (wichtig, das Repository ist öffentlich):
   * Row Level Security ist auf allen Tabellen aktiv. Die Policies erlauben der öffentlichen Rolle nur Lesen. Schreib-Policies gibt es nicht: Änderungen laufen nur über das Supabase-Dashboard oder das Seed-Skript.
   * Das Frontend nutzt nur den öffentlichen Schlüssel (je nach Dashboard-Version `anon` oder `publishable key`). Der geheime Schlüssel (`service_role` bzw. `secret key`) kommt nie ins Frontend, nie mit `VITE_`-Präfix und nie ins Repo.
   * `.env.local` steht in `.gitignore`, committet wird nur `.env.example` mit leeren Platzhaltern.
   * `npm run check:rls` versucht mit dem öffentlichen Schlüssel zu schreiben und schlägt fehl, wenn das gelingt.
4. Seed-Skript (`npm run seed`): liest die JSON-Dateien, validiert sie mit Zod und schreibt sie per Upsert in die Datenbank. Es ist beliebig oft ausführbar, löscht nie Zeilen und hat eine Option `--dry-run`. Den geheimen Schlüssel liest es nur lokal aus `.env.local`.
5. Daten laden:
   * Eingebettete Abfragen (Joins) statt vieler einzelner Anfragen. Validiere die Antworten mit den bestehenden Zod-Schemas, Typen kannst du aus dem Schema generieren (`supabase gen types typescript`).
   * Katalog: Eine schlanke Listenabfrage lädt alle Generationen, Filter und Sortierung laufen im Browser mit der bestehenden Logik (so liegt die Führerausweis-Logik an einer Stelle). Beachte das Zeilenlimit pro Abfrage (standardmässig 1000, prüfe es in der Doku) und halte die Annahme in `DECISIONS.md` fest. Die Detailseite lädt ihre Daten separat.
   * TanStack Query für Laden, Caching und Fehlerzustände. Beim Laden erscheinen Skeleton-Loader (Abschnitt 5), bei Fehlern eine verständliche Meldung mit «Erneut versuchen», nie eine leere Seite.
6. Gratis-Tarif prüfen: Lies in der offiziellen Supabase-Doku nach, was der Gratis-Tarif aktuell bietet, ob Projekte bei Inaktivität pausiert werden und ob kommerzielle Nutzung erlaubt ist. Halte das Ergebnis in `DECISIONS.md` fest und beschreibe im README, wie ich ein pausiertes Projekt wieder aktiviere.
7. Tests: Unit-Tests für das Mapping von Datenbankzeilen auf die Domain-Typen (mit Beispiel-Fixtures).
8. Optional: `npm run export:data` schreibt die Datenbank zurück in JSON-Dateien (Backup und Datenhistorie in Git).

Nicht Teil von M7: Benutzerkonten, Favoriten, eigenes Admin-Panel. Gepflegt wird im Supabase-Tabelleneditor.
M7 ist fertig, wenn Katalog, Detailseite und Vergleich mit Supabase-Daten laufen, `check:rls` grün ist, `seed` wiederholbar ist, kein Schlüssel im Repo liegt und im README steht, wie man ein neues Bike einträgt (Tabelleneditor oder JSON mit Seed).
15. Veröffentlichen (Phase 2, M8)
Ziel: MotoMatch ist unter einer eigenen Domain öffentlich erreichbar und rechtlich sauber aufgesetzt. Du bereitest alles vor und gibst mir eine Checkliste für das, was ich selbst tun muss (Konten, Domain, Zahlungen). Bestelle und kaufe nichts und lege keine Konten an, ohne dass ich es bestätigt habe.

1. Hosting: Statische Seite bei Cloudflare, verbunden mit meinem GitHub-Repository: Jeder Push auf `main` löst einen neuen Build aus (`npm run build`, Ausgabe `dist`). Prüfe in der aktuellen Cloudflare-Doku, ob dafür Pages oder Workers mit statischen Assets empfohlen wird. Sag mir, welche Umgebungsvariablen ich im Hosting eintragen muss (`VITE_SUPABASE_URL`, öffentlicher Schlüssel, `VITE_DATA_SOURCE=supabase`). Lies die Nutzungsbedingungen zu kommerzieller Nutzung, bevor Werbung oder Affiliate-Links dazukommen, und halte das Ergebnis in `DECISIONS.md` fest.
2. Domain: Ich kaufe sie selbst (Wunsch: `motomatch.ch`, vorher Verfügbarkeit und Markenregister prüfen). Du beschreibst die DNS-Schritte zur Verbindung mit dem Hosting. HTTPS muss aktiv sein.
3. Routing und Google: Direktaufrufe wie `/bikes/yamaha-mt-07` und `/compare?bikes=…` dürfen keine 404 liefern. Prüfe, ob Prerendering der Bike-Seiten für die Auffindbarkeit sinnvoll ist, und halte die Entscheidung in `DECISIONS.md` fest. Dazu `sitemap.xml`, `robots.txt`, `lang="de-CH"`, Open-Graph-Bild, Favicon, eigene 404-Seite und eine Anleitung zur Anmeldung in der Google Search Console.
4. Rechtliches (Entwürfe, keine Rechtsberatung): Impressum und Datenschutzerklärung nach dem revidierten Schweizer DSG, mit den Platzhaltern `[NAME]`, `[ADRESSE]`, `[E-MAIL]`, die ich selbst ausfülle. Erfinde keine Angaben. Das Impressum braucht Name, Postadresse (kein Postfach) und E-Mail, sobald die Seite kommerziell ist (z. B. Werbung oder Affiliate-Links). Die Datenschutzerklärung nennt alle eingesetzten Dienste (Hosting, Supabase, YouTube nach Klick, Statistik falls vorhanden). Verwende keine Tracking-Cookies, und falls eine Statistik nötig ist, dann eine cookiefreie, datensparsame Lösung. Werbung und Affiliate-Links müssen später klar gekennzeichnet werden.
5. Vor dem Livegang prüfen:
   * Secret-Scan über Repo und Git-Historie (z. B. mit gitleaks). Ist das Repository noch privat, stelle ich es erst nach dem Scan öffentlich.
   * `check:rls` ist grün, der Schreibversuch mit dem öffentlichen Schlüssel schlägt fehl.
   * Alle Einträge mit `dataStatus: "needsVerification"` sind geprüft oder sichtbar markiert.
   * Lighthouse Mobile mindestens 90, Barrierefreiheit geprüft, Seite bei 360, 768 und 1280 px kontrolliert.
   * Der Footer-Hinweis «Alle Angaben ohne Gewähr …» und die Führerausweis-Hinweise sind sichtbar.

M8 ist fertig, wenn die Seite unter meiner Domain mit HTTPS erreichbar ist, Daten aus Supabase zeigt, Impressum und Datenschutz echte Angaben enthalten und die Checkliste aus Punkt 5 abgehakt ist.
16. Fertig, wenn …

* Phase 1: `npm run dev` läuft ohne Konsolenfehler, `build`, `test` und `validate:data` laufen grün, alle Seiten sehen bei 360, 768 und 1280 px sauber aus, Reduced-Motion funktioniert, `DECISIONS.md` und README sind aktuell und alles ist auf GitHub gepusht.
* Phase 2: Die Kriterien von M7 und M8 (Abschnitte 14 und 15) sind erfüllt.
