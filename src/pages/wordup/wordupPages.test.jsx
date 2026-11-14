import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WordupPage from './WordupPage';
import WordupDetailPage from './WordupDetailPage';

// The reader and selection tests exercise the UI without requiring WebGL.
vi.mock('./LexicalSculpture', () => ({
  default: ({ seed }) => (
    <div aria-hidden="true" data-testid="word-sculpture" data-seed={seed} />
  ),
}));

const index = `(words)
  > (word)
    (slug) ertelence
    (word) ertelence
    (language) tr
    (partOfSpeech) noun
    (definition) The pleasure of doing everything except the thing you meant to do.
    (roots) ertelemek + eğlence
    (number) 01
  > (word)
    (slug) tablimbo
    (word) tablimbo
    (language) en
    (partOfSpeech) noun
    (definition) Keeping a browser tab open for a possible future self.
    (roots) tab + limbo
    (translation) Gelecekteki bir olasılık için açık kalan sekme.
    (register) Playful / informal
    (forms) Proposed usage: tablimbo (mass noun).
    (related) yarinsama,missing,tablimbo,yarinsama
    (example) That recipe is still in tablimbo.
    (number) 02
  > (word)
    (slug) yarinsama
    (word) yarınsama
    (language) tr
    (partOfSpeech) noun
    (definition) Missing a moment before it has happened.
    (roots) yarın + anımsama
    (number) 03
  > (word)
    (slug) poskurmek
    (word) pöskürmek
    (language) tr
    (contentLanguage) tr
    (partOfSpeech) verb
    (definition) Mental and emotional exhaustion without physical fatigue.
    (translation) Zihinsel tükenme ve ruhsal çöküntü.
    (number) 04
`;

const tablimbo = `## How it happens

A browser tab becomes **a little promise**.

- Keep it open.
- Imagine another day.

[A related word](/wordup/yarinsama)
`;

const showWordup = (path = '/wordup') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/wordup" element={<WordupPage />} />
        <Route path="/wordup/:slug" element={<WordupDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (path) => ({
      ok: true,
      text: async () => (path.endsWith('.piml') ? index : tablimbo),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Wordup reading flow', () => {
  it('opens a shareable alphabet view with ordered words, working letter anchors and no sculpture', async () => {
    showWordup('/wordup?view=index');
    await screen.findByRole('heading', { name: 'The word index.' });
    await screen.findByRole('link', { name: /pöskürmek/ });
    expect(screen.getByRole('button', { name: 'A–Z index' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByTestId('word-sculpture')).toBeNull();
    const letters = within(
      screen.getByRole('navigation', { name: 'Jump to a letter' }),
    );
    const p = letters.getByRole('link', { name: 'Words beginning with P' });
    expect(p).toHaveAttribute('href', '#wordup-letter-50');
    expect(
      screen.getByRole('heading', { name: 'P', level: 3 }),
    ).toHaveAttribute('id', 'wordup-letter-50');
    expect(
      letters.queryByRole('link', { name: 'Words beginning with A' }),
    ).toBeNull();
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['E', 'P', 'T', 'Y']);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(
      screen.getByText('Zihinsel tükenme ve ruhsal çöküntü.'),
    ).toHaveAttribute('lang', 'tr');
    await userEvent.click(screen.getByRole('link', { name: /pöskürmek/ }));
    expect(
      await screen.findByRole('heading', { name: 'pöskürmek', level: 1 }),
    ).toBeVisible();
  });

  it('keeps search and language filters when changing collection views', async () => {
    showWordup();
    await screen.findByRole('heading', { name: 'tablimbo', level: 3 });
    await userEvent.click(screen.getByRole('button', { name: 'English' }));
    const search = screen.getByRole('searchbox', {
      name: 'Search words and meanings',
    });
    await userEvent.type(search, 'browser');
    await userEvent.click(screen.getByRole('button', { name: 'A–Z index' }));
    expect(search).toHaveValue('browser');
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /tablimbo/ })).toHaveAttribute(
      'href',
      '/wordup/tablimbo',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sculptures' }));
    expect(search).toHaveValue('browser');
    expect(screen.getByTestId('word-sculpture')).toHaveAttribute(
      'data-seed',
      'tablimbo',
    );
    expect(
      screen.queryByRole('heading', { name: 'The word index.' }),
    ).toBeNull();
  });

  it('uses the accented display word as the same sculpture seed on the index and entry', async () => {
    showWordup();
    await screen.findByRole('heading', { name: 'pöskürmek', level: 3 });
    const word = screen.getByRole('link', { name: /Türkçe.*pöskürmek/ });
    await userEvent.hover(word);
    expect(screen.getByTestId('word-sculpture')).toHaveAttribute(
      'data-seed',
      'pöskürmek',
    );
    await userEvent.click(word);
    await screen.findByRole('heading', { name: 'pöskürmek', level: 1 });
    expect(screen.getByTestId('word-sculpture')).toHaveAttribute(
      'data-seed',
      'pöskürmek',
    );
    expect(
      // The Markdown container owns its language; the heading inherits it.
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByRole('heading', { name: 'How it happens' }).parentElement,
    ).toHaveAttribute('lang', 'tr');
  });

  it('previews a word on pointer and keyboard focus, then keeps it in a language filter', async () => {
    showWordup();
    await screen.findByRole('heading', { name: /^tablimbo/, level: 3 });
    const preview = within(screen.getByLabelText('Selected word'));
    expect(
      preview.getByRole('link', { name: 'Open ertelence' }),
    ).toHaveAttribute('href', '/wordup/ertelence');

    const tablimboLink = screen.getByRole('link', {
      name: /English.*tablimbo/,
    });
    await userEvent.hover(tablimboLink);
    expect(
      preview.getByText(
        'Keeping a browser tab open for a possible future self.',
      ),
    ).toBeVisible();
    expect(
      preview.getByRole('link', { name: 'Open tablimbo' }),
    ).toHaveAttribute('href', '/wordup/tablimbo');

    await userEvent.hover(
      screen.getByRole('link', {
        name: /Türkçe.*ertelence/,
      }),
    );
    expect(preview.getByRole('link', { name: 'Open ertelence' })).toBeVisible();
    for (
      let steps = 0;
      // eslint-disable-next-line testing-library/no-node-access -- Stop when keyboard focus reaches the word.
      steps < 15 && document.activeElement !== tablimboLink;
      steps += 1
    ) {
      await userEvent.tab();
    }
    expect(tablimboLink).toHaveFocus();
    expect(
      preview.getByRole('link', { name: 'Open tablimbo' }),
    ).toHaveAttribute('href', '/wordup/tablimbo');

    await userEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      within(
        screen.getByRole('list', { name: 'Word collection' }),
      ).getAllByRole('listitem'),
    ).toHaveLength(1);
    expect(preview.getByRole('link', { name: 'Open tablimbo' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^yarınsama/ })).toBeNull();
  });

  it('combines language and ASCII Turkish search, and resets an empty result', async () => {
    showWordup();
    await screen.findByRole('heading', { name: /^yarınsama/, level: 3 });

    const english = screen.getByRole('button', { name: /English/ });
    await userEvent.click(english);
    expect(english).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: /^tablimbo/ })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^yarınsama/ })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /Türkçe/ }));
    const search = screen.getByRole('searchbox', {
      name: 'Search words and meanings',
    });
    await userEvent.type(search, 'YARINSAMA');
    expect(screen.getByRole('heading', { name: /^yarınsama/ })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^tablimbo/ })).toBeNull();

    await userEvent.clear(search);
    await userEvent.type(search, 'no-such-feeling');
    expect(screen.getByText('No word for that feeling. Yet.')).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: /Show all words/ }),
    );
    expect(search).toHaveValue('');
    expect(screen.getByRole('button', { name: 'All words' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('heading', { name: /^yarınsama/ })).toBeVisible();
    expect(screen.getByRole('heading', { name: /^tablimbo/ })).toBeVisible();
  });

  it('opens a word and renders its text file as Markdown', async () => {
    showWordup();
    await screen.findByRole('heading', { name: /^tablimbo/, level: 3 });
    await userEvent.click(screen.getByRole('link', { name: /tablimbo/ }));

    expect(
      await screen.findByRole('heading', { name: /^tablimbo/, level: 1 }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'How it happens' }),
    ).toBeVisible();
    expect(
      screen.getByText('a little promise', { selector: 'strong' }),
    ).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: 'A related word' }),
    ).toHaveAttribute('href', '/wordup/yarinsama');
    expect(
      screen.getByRole('link', { name: /Read the original text/ }),
    ).toHaveAttribute('href', '/wordup/tablimbo.txt');
  });

  it('connects reading sections, usage details, and explicit related words', async () => {
    showWordup('/wordup/tablimbo');
    await screen.findByRole('heading', { name: 'tablimbo', level: 1 });

    expect(
      screen.getByText('Gelecekteki bir olasılık için açık kalan sekme.'),
    ).toHaveAttribute('lang', 'tr');
    expect(screen.getByText('Playful / informal')).toBeVisible();
    expect(
      screen.getByText('Proposed usage: tablimbo (mass noun).'),
    ).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: 'Usage example' })).getByText(
        '“That recipe is still in tablimbo.”',
      ),
    ).toBeVisible();

    const contents = within(
      screen.getByRole('navigation', { name: 'On this page' }),
    );
    const heading = screen.getByRole('heading', { name: 'How it happens' });
    expect(heading.id).toBeTruthy();
    expect(
      contents.getByRole('link', { name: 'How it happens' }),
    ).toHaveAttribute('href', '#' + heading.id);

    const related = within(
      screen.getByRole('region', { name: 'Nearby words.' }),
    );
    const links = related.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/wordup/yarinsama');
    await userEvent.click(links[0]);
    expect(
      await screen.findByRole('heading', { name: 'yarınsama', level: 1 }),
    ).toBeVisible();
  });

  it('offers a way back from a directly opened unknown word', async () => {
    showWordup('/wordup/not-invented');
    expect(
      await screen.findByRole('heading', {
        name: /This one hasn’t been invented/,
      }),
    ).toBeVisible();
    const back = screen.getByRole('link', { name: 'Back to the words' });
    expect(back).toHaveAttribute('href', '/wordup');
    await userEvent.click(back);
    expect(
      await screen.findByRole('heading', { name: /^tablimbo/ }),
    ).toBeVisible();
  });

  it('lets a keyboard user reach the content and change a language filter', async () => {
    showWordup();
    await screen.findByRole('heading', { name: /^tablimbo/ });

    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
    const english = screen.getByRole('button', { name: /English/ });
    for (
      let steps = 0;
      // eslint-disable-next-line testing-library/no-node-access -- Stop when keyboard focus reaches the filter.
      steps < 12 && document.activeElement !== english;
      steps += 1
    ) {
      await userEvent.tab();
    }
    expect(english).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(english).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('heading', { name: /^yarınsama/ })).toBeNull();
  });
});
