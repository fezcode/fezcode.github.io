import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CATEGORY_PALETTES } from '../../utils/categoryColors';

// framer-motion's whileInView needs an observer jsdom does not provide.
class StubIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback(
      [{ target, isIntersecting: true, intersectionRatio: 1 }],
      this,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
global.IntersectionObserver = StubIntersectionObserver;
window.IntersectionObserver = StubIntersectionObserver;

const post = (slug, category) => ({
  slug,
  title: `Post about ${category}`,
  description: 'a post',
  category,
  date: '2026-01-02',
  updated: '2026-01-02',
  filename: `${slug}.md`,
  tags: [],
  authors: ['fezcode'],
});

const POSTS = [post('dev-entry', 'dev'), post('rant-entry', 'rant')];

vi.mock('../../utils/dataUtils', () => ({
  fetchAllBlogPosts: () =>
    Promise.resolve({ allPostsData: POSTS, processedPosts: POSTS }),
}));

// The reader fetches the markdown body separately.
global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, text: () => Promise.resolve('# Body\n\nWords.') }),
);

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../context/AchievementContext', () => ({
  useAchievements: () => ({ trackReadingProgress: vi.fn() }),
}));

vi.mock('../../context/VisualSettingsContext', () => ({
  useVisualSettings: () => ({
    fezcodexTheme: 'brutalist',
    blogPostViewMode: 'standard',
  }),
}));

// Heavy leaf components the category badge does not depend on.
vi.mock('../../components/MermaidDiagram', () => ({
  default: () => <div />,
}));

const { default: LuxeBlogPostPage } = await import('./LuxeBlogPostPage.jsx');
const { default: TerracottaBlogPostPage } = await import(
  './TerracottaBlogPostPage.jsx'
);
const { default: OrbitBlogPostPage } = await import('./OrbitBlogPostPage.jsx');
const { default: DokumentBlogPostPage } = await import(
  './DokumentBlogPostPage.jsx'
);
const { default: GalleyBlogPostPage } = await import(
  './GalleyBlogPostPage.jsx'
);
const { default: BrutalistBlogPostPage } = await import(
  './BrutalistBlogPostPage.jsx'
);
const { default: DossierBlogPostPage } = await import(
  './DossierBlogPostPage.jsx'
);
const { default: EditorialBlogPostPage } = await import(
  './EditorialBlogPostPage.jsx'
);

const CASES = [
  { name: 'Brutalist', Page: BrutalistBlogPostPage, palette: 'brutalist' },
  { name: 'Luxe', Page: LuxeBlogPostPage, palette: 'luxe' },
  { name: 'Terracotta', Page: TerracottaBlogPostPage, palette: 'terracotta' },
  { name: 'Galley', Page: GalleyBlogPostPage, palette: 'galley' },
  { name: 'Orbit', Page: OrbitBlogPostPage, palette: 'orbit' },
  { name: 'Dokument', Page: DokumentBlogPostPage, palette: 'dokument' },
  { name: 'Dossier', Page: DossierBlogPostPage, palette: 'dossier' },
  // Editorial defaults to its inverted (dark) reader.
  {
    name: 'Editorial',
    Page: EditorialBlogPostPage,
    palette: 'editorial-invert',
  },
];

const asRendered = (value) => {
  if (value.startsWith('var(')) return value;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Every reader shows the category somewhere in its masthead or spec sheet, with
 * wording that differs per theme ("Category: dev", "CLASSIFIED // dev", a bare
 * "dev"). Match the word anywhere, then keep only the elements that carry an
 * inline colour — that is how a category colour is applied.
 */
const categoryColors = (category) =>
  screen
    .getAllByText(new RegExp(category, 'i'))
    .filter((node) => node.style.color)
    .map((node) => node.style.color);

const renderReader = async (Page, slug) => {
  render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<Page />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findAllByText(/Post about/);
};

describe('blogpost reader category colours', () => {
  afterEach(cleanup);

  it.each(CASES)(
    '$name colours the category from its own palette',
    async ({ Page, palette }) => {
      await renderReader(Page, 'dev-entry');
      const dev = categoryColors('dev');
      expect(dev).toContain(asRendered(CATEGORY_PALETTES[palette].dev));
      cleanup();

      await renderReader(Page, 'rant-entry');
      const rant = categoryColors('rant');
      expect(rant).toContain(asRendered(CATEGORY_PALETTES[palette].rant));

      // The bug being guarded: one flat accent, or no colour, for every category.
      expect(asRendered(CATEGORY_PALETTES[palette].dev)).not.toBe(
        asRendered(CATEGORY_PALETTES[palette].rant),
      );
    },
  );
});
