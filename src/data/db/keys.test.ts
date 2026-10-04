import { describe, expect, it } from 'vitest';
import { FAKE_PUBLISHABLE_KEY, FAKE_SECRET_KEY, fakeLegacyKey } from '@/test/fakeKeys';
import { isLegacyJwt, isSecretKey } from './keys';

describe('Supabase-Schlüssel', () => {
  it('erkennt alte JWT-Schlüssel', () => {
    expect(isLegacyJwt(fakeLegacyKey('anon'))).toBe(true);
    expect(isLegacyJwt(FAKE_PUBLISHABLE_KEY)).toBe(false);
    expect(isLegacyJwt('eyJ-nur-ein-teil')).toBe(false);
  });

  it('erkennt geheime Schlüssel – neu und alt', () => {
    expect(isSecretKey(FAKE_SECRET_KEY)).toBe(true);
    expect(isSecretKey(fakeLegacyKey('service_role'))).toBe(true);
  });

  it('öffentliche Schlüssel und Unsinn sind nicht geheim', () => {
    expect(isSecretKey(FAKE_PUBLISHABLE_KEY)).toBe(false);
    expect(isSecretKey(fakeLegacyKey('anon'))).toBe(false);
    expect(isSecretKey('eyJ.kein-base64.x')).toBe(false);
    expect(isSecretKey('')).toBe(false);
  });
});
