import { describe, expect, it } from 'vitest';
import { getRelatedWords, getWordupSections } from './wordupReading';

describe('Wordup reading landmarks', () => {
  it('preserves Turkish labels and produces unique Unicode anchors at real source lines', () => {
    const source = [
      '# Başlık',
      '',
      '## İç ses: **yarınsama**',
      'An explanation.',
      '',
      '## İç ses: yarınsama',
      '',
      '## İç ses: yarınsama-2',
      '',
      '## **In** a sentence',
    ].join('\n');
    expect(getWordupSections(source)).toEqual([
      { id: 'wordup-iç-ses-yarınsama', label: 'İç ses: yarınsama', line: 3 },
      { id: 'wordup-iç-ses-yarınsama-2', label: 'İç ses: yarınsama', line: 6 },
      {
        id: 'wordup-iç-ses-yarınsama-2-2',
        label: 'İç ses: yarınsama-2',
        line: 8,
      },
      { id: 'wordup-in-a-sentence', label: 'In a sentence', line: 10 },
    ]);
  });

  it('ignores fenced examples, shorter internal fences, indented code and other heading levels', () => {
    const source = [
      '````markdown',
      '## Not a section',
      '```',
      '## Still code',
      '````',
      '   ~~~text',
      '## Also code',
      '   ~~~~',
      '    ## Indented code',
      '### A subheading',
      '## A real section ###',
      '##not-a-heading',
    ].join('\n');
    expect(getWordupSections(source)).toEqual([
      { id: 'wordup-a-real-section', label: 'A real section', line: 11 },
    ]);
  });

  it('supports Setext H2 lines and cleans common inline formatting without losing literal text', () => {
    const source = [
      'A [linked thought](/wordup/tablimbo)',
      'and *another*',
      '---',
      '',
      '## A `code_word` &amp; \\*literal\\* ~~detour~~',
      '',
      '## <em>Gölge</em> &quot;ses&quot; &#x131;şık',
    ].join('\r\n');
    expect(getWordupSections(source)).toEqual([
      {
        id: 'wordup-a-linked-thought-and-another',
        label: 'A linked thought and another',
        line: 1,
      },
      {
        id: 'wordup-a-codeword-literal-detour',
        label: 'A code_word & *literal* detour',
        line: 5,
      },
      { id: 'wordup-gölge-ses-ışık', label: 'Gölge "ses" ışık', line: 7 },
    ]);
    expect(getWordupSections(null)).toEqual([]);
    expect(getWordupSections('##\n## ***')).toEqual([
      { id: 'wordup-section', label: '***', line: 2 },
    ]);
  });
});

describe('explicit Wordup relationships', () => {
  const first = { slug: 'ertelence', word: 'ertelence' };
  const second = { slug: 'tablimbo', word: 'tablimbo' };
  const third = { slug: 'yarinsama', word: 'yarınsama' };
  const words = [first, second, third];

  it('preserves author order and skips self, unknown entries, empty values and duplicates', () => {
    expect(
      getRelatedWords(
        {
          ...first,
          related: ' yarinsama, unknown, ertelence, tablimbo, yarinsama, , ',
        },
        words,
      ),
    ).toEqual([third, second]);
  });

  it('returns no guessed neighbors when relationships are absent or invalid', () => {
    expect(getRelatedWords(first, words)).toEqual([]);
    expect(getRelatedWords({ ...first, related: ['tablimbo'] }, words)).toEqual(
      [],
    );
    expect(getRelatedWords(null, words)).toEqual([]);
    expect(getRelatedWords({ ...first, related: 'tablimbo' })).toEqual([]);
  });
});
