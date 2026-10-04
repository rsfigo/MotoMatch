import { describe, expect, it } from 'vitest';
import { compareUrl, parseCompareParam, toggleInSelection } from './compareSelection';

describe('toggleInSelection', () => {
  it('fügt hinzu und entfernt wieder', () => {
    expect(toggleInSelection([], 'a')).toEqual(['a']);
    expect(toggleInSelection(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('lässt höchstens drei Bikes zu', () => {
    expect(toggleInSelection(['a', 'b', 'c'], 'd')).toEqual(['a', 'b', 'c']);
  });
});

describe('parseCompareParam', () => {
  it('entfernt Duplikate und begrenzt auf drei', () => {
    expect(parseCompareParam('a,b,a,c,d')).toEqual(['a', 'b', 'c']);
    expect(parseCompareParam(null)).toEqual([]);
    expect(parseCompareParam(' a , ,b')).toEqual(['a', 'b']);
  });
});

describe('compareUrl', () => {
  it('baut den Link zur Vergleichsseite', () => {
    expect(compareUrl(['a', 'b'])).toBe('/compare?bikes=a,b');
    expect(compareUrl([])).toBe('/compare');
  });
});
