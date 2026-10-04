/**
 * Supabase-Schlüssel erkennen
 * ---------------------------
 * Öffentlich – darf in den Browser: sb_publishable_… oder der alte JWT-Schlüssel «anon».
 * Geheim – nie ins Frontend, nie mit VITE_-Präfix, nie ins Repository: sb_secret_… oder
 * der alte JWT-Schlüssel «service_role».
 *
 * Genutzt von der App, von den Skripten und vom Build (vite.config.ts bricht ab, wenn ein
 * geheimer Schlüssel in einer VITE_-Variable steckt). Ohne Importe, damit Node die Datei
 * direkt laden kann.
 */

/** Alte Supabase-Schlüssel sind JWTs: drei Base64url-Teile, beginnend mit «eyJ». */
export function isLegacyJwt(key: string): boolean {
  return key.split('.').length === 3 && key.startsWith('eyJ');
}

/** true für geheime Schlüssel: neue (sb_secret_…) und alte JWTs mit der Rolle service_role. */
export function isSecretKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  if (!isLegacyJwt(key)) return false;
  try {
    const payload = (key.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(payload)) as { role?: unknown };
    return claims.role === 'service_role';
  } catch {
    return false;
  }
}
