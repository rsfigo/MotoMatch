import { describe, expect, it } from 'vitest';
import type { MatchAnswers } from './match';
import {
  completeAnswers,
  firstOpenStep,
  MATCH_STEPS,
  parseMatchParams,
  serializeMatchParams,
  withStepDefaults,
} from './matchAnswers';

const full: MatchAnswers = {
  licence: 'A_LIMITED',
  heightCm: 172,
  budgetChf: 9000,
  purposes: ['city', 'touring'],
  experience: 'beginner',
  soundImportance: 2,
  tuningImportance: 0,
};

const parse = (search: string) => parseMatchParams(new URLSearchParams(search));

describe('Antworten in der URL', () => {
  it('schreibt lesbare deutsche Parameter und liest sie wieder', () => {
    const search = serializeMatchParams(full, 'result');
    expect(search).toBe(
      '?schritt=ergebnis&ausweis=a35&groesse=172&budget=9000&einsatz=stadt,touren&erfahrung=neu&sound=2&tuning=0',
    );
    expect(parse(search)).toEqual({ draft: full, view: 'result' });
  });

  it('«Budget egal» und «Ausweis noch offen»', () => {
    const search = serializeMatchParams({ ...full, budgetChf: null, licence: 'none' }, 'result');
    expect(search).toContain('budget=egal');
    expect(search).toContain('ausweis=offen');
    expect(parse(search).draft.budgetChf).toBeNull();
  });

  it('ignoriert ungültige Werte', () => {
    const { draft } = parse('?ausweis=b&groesse=999&budget=abc&einsatz=stadt,mond&sound=7');
    expect(draft).toEqual({ purposes: ['city'] });
  });
});

describe('Schritte', () => {
  it('ohne Parameter beginnt der Wizard bei der ersten Frage', () => {
    expect(parse('')).toEqual({ draft: {}, view: 0 });
  });

  it('Überspringen geht nicht: man landet bei der ersten offenen Frage', () => {
    expect(parse('?schritt=5&ausweis=a1').view).toBe(1);
    expect(parse('?schritt=ergebnis&ausweis=a1&groesse=170').view).toBe(2);
  });

  it('zurück zu einer beantworteten Frage geht', () => {
    expect(parse('?schritt=1&ausweis=a1&groesse=170').view).toBe(0);
  });

  it('erkennt komplette Antworten', () => {
    expect(firstOpenStep(full)).toBe(MATCH_STEPS.length);
    expect(completeAnswers(full)).toEqual(full);
    expect(completeAnswers({ ...full, experience: undefined })).toBeNull();
  });
});

describe('Vorgaben', () => {
  it('Regler-Fragen gelten mit ihrer Vorgabe als beantwortet, ohne Gewähltes zu überschreiben', () => {
    expect(withStepDefaults('height', {})).toEqual({ heightCm: 175 });
    expect(withStepDefaults('height', { heightCm: 160 })).toEqual({ heightCm: 160 });
    expect(withStepDefaults('budget', { budgetChf: null })).toEqual({ budgetChf: null });
    expect(withStepDefaults('preferences', { soundImportance: 3 })).toEqual({
      soundImportance: 3,
      tuningImportance: 1,
    });
  });

  it('Auswahl-Fragen haben keine Vorgabe', () => {
    expect(withStepDefaults('licence', {})).toEqual({});
    expect(withStepDefaults('purpose', {})).toEqual({});
  });
});
