import { describe, expect, it } from 'vitest';
import { t } from '@/i18n';
import { fillOperatorDetails, hasPlaceholder } from './legal';

const details = {
  name: 'Testperson',
  address: 'Teststrasse 1, 1234 Testort',
  email: 'kontakt@example.ch',
};

describe('Angaben zum Betreiber', () => {
  it('ersetzt Name, Adresse und E-Mail', () => {
    expect(fillOperatorDetails('[NAME], [ADRESSE]', details)).toBe(
      'Testperson, Teststrasse 1, 1234 Testort',
    );
    expect(fillOperatorDetails('E-Mail: [E-MAIL]', details)).toBe('E-Mail: kontakt@example.ch');
  });

  it('lässt Platzhalter ohne Angabe stehen, auch bei leeren Werten', () => {
    expect(fillOperatorDetails('[NAME], [ADRESSE]', { name: 'Testperson', address: '  ' })).toBe(
      'Testperson, [ADRESSE]',
    );
    expect(fillOperatorDetails('Liegt in [REGION DER DATENBANK].', details)).toBe(
      'Liegt in [REGION DER DATENBANK].',
    );
  });

  it('erkennt verbleibende Platzhalter', () => {
    expect(hasPlaceholder('Liegt in [REGION DER DATENBANK].')).toBe(true);
    expect(hasPlaceholder('Testperson, Teststrasse 1')).toBe(false);
  });

  it('Impressum und Datenschutz nennen den Betreiber nur über die Platzhalter', () => {
    const texts = [...t.legal.imprint.sections, ...t.legal.privacy.sections].flatMap(
      (section): readonly string[] => [
        ...('paragraphs' in section ? section.paragraphs : []),
        ...('list' in section ? section.list : []),
      ],
    );
    expect(texts.some((text) => text.includes('[NAME]'))).toBe(true);
    expect(texts.some((text) => text.includes('[E-MAIL]'))).toBe(true);
    // Keine echte E-Mail-Adresse im Repository
    expect(texts.filter((text) => /\S+@\S+\.\w+/.test(text))).toEqual([]);
  });
});
