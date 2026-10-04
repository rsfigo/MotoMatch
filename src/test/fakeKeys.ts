/**
 * Erfundene Supabase-Schlüssel für Tests.
 * Die JWTs entstehen erst zur Laufzeit: So steht im Repository nichts, was ein
 * Secret-Scanner (gitleaks) für einen echten Schlüssel halten könnte.
 */
function base64url(value: object | string): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Alter JWT-Schlüssel mit der angegebenen Rolle (Signatur ist Unsinn). */
export function fakeLegacyKey(role: 'anon' | 'service_role'): string {
  return [base64url({ alg: 'HS256', typ: 'JWT' }), base64url({ role }), base64url('test')].join(
    '.',
  );
}

export const FAKE_PUBLISHABLE_KEY = 'sb_publishable_test';
export const FAKE_SECRET_KEY = 'sb_secret_test';
