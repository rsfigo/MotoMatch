import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('verbindet Klassen und lässt leere Werte weg', () => {
    expect(cn('a', false, 'b', null, undefined, '', 'c')).toBe('a b c');
  });
});
