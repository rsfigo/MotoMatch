/**
 * Zugang zur Supabase-Daten-API (PostgREST)
 * -----------------------------------------
 * Wir brauchen von Supabase nur die Daten-API, kein Login, kein Realtime, keinen Speicher.
 * Darum der schlanke offizielle Client @supabase/postgrest-js statt des ganzen supabase-js.
 * Genutzt von der App (öffentlicher Schlüssel) und von den Skripten (seed, check:rls, export:data).
 *
 * Nur relative Importe, damit die Skripte die Datei direkt in Node nutzen.
 */
import { PostgrestClient } from '@supabase/postgrest-js';
import { isLegacyJwt } from './keys.ts';

/**
 * Header für die Supabase-API. Neue Schlüssel (sb_publishable_…, sb_secret_…) gehören laut
 * Supabase-Doku nur in den apikey-Header. Die alten JWT-Schlüssel (anon, service_role)
 * erwartet die API zusätzlich als Bearer-Token.
 */
export function supabaseHeaders(key: string): Record<string, string> {
  return isLegacyJwt(key) ? { apikey: key, Authorization: `Bearer ${key}` } : { apikey: key };
}

/**
 * Eingebettete Abfragen für Modelle (eine Anfrage statt vieler, siehe ModelWithRelations):
 * Die Liste lädt Generationen mit Extras, aber ohne Quellen – die braucht nur die Detailseite.
 */
const EXTRAS_SELECT = 'generation_features(feature_key, availability, detail, position)';
const SOURCES_SELECT = 'generation_sources(position, label, url)';
export const MODEL_LIST_SELECT = `*, generations(*, ${EXTRAS_SELECT})`;
export const MODEL_DETAIL_SELECT = `*, generations(*, ${EXTRAS_SELECT}, ${SOURCES_SELECT})`;

/** Client für die Tabellen eines Supabase-Projekts. */
export function createDataApiClient(
  projectUrl: string,
  key: string,
  fetchImplementation?: typeof fetch,
): PostgrestClient {
  return new PostgrestClient(`${projectUrl.replace(/\/+$/, '')}/rest/v1`, {
    headers: supabaseHeaders(key),
    ...(fetchImplementation && { fetch: fetchImplementation }),
  });
}
