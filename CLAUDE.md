# MotoMatch – Hinweise für Claude

- **Zu Beginn jeder Sitzung `STATUS.md` lesen.** Dort stehen der aktuelle Stand, offene Probleme
  und die nächsten Schritte.
- **Anforderungen:** `docs/MASTER_PROMPT.md` ist die massgebliche, neueste Fassung des Master
  Prompts. Entscheidungen und Annahmen stehen in `DECISIONS.md`.
- **Nach jedem Meilenstein `STATUS.md` aktualisieren** (Datum, Meilensteine, Daten, Prüfstand,
  Probleme, nächste Schritte), zusammen mit `DECISIONS.md` committen und pushen.
- Vor jedem Commit: `npm run build`, `npm test`, `npm run validate:data` und `npm run lint` grün.
- Das Repository ist öffentlich: keine Schlüssel, Passwörter, `.env`-Dateien oder persönlichen
  Daten committen. Umgebungsvariablen nur mit Namen erwähnen, nie mit Werten.
- Keine Daten erfinden (Messwerte, Preise, Quellen-URLs, YouTube-Links); Oberfläche auf Deutsch
  mit Schweizer Schreibweise («ss»).
