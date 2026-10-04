/**
 * Umgebungsvariablen für die Skripte (seed, check:rls).
 * Die Werte stehen lokal in .env.local – die Datei ist in .gitignore und wird nie committet.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Lädt .env.local, falls vorhanden. Bereits gesetzte Variablen haben Vorrang. */
export function loadLocalEnv(): void {
  const file = join(import.meta.dirname, '..', '..', '.env.local');
  if (existsSync(file)) process.loadEnvFile(file);
}

/** Liest eine Umgebungsvariable oder bricht mit einem Hinweis ab. */
export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(
      `✖ ${name} fehlt. Trage den Wert in .env.local ein (Vorlage: .env.example) – ` +
        'nie in den Chat und nie ins Repository.',
    );
    process.exit(1);
  }
  return value;
}
