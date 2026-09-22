import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CATEGORY_PALETTES } from '../../utils/categoryColors';

// Several index pages reveal rows with framer-motion's whileInView, which jsdom
// cannot observe. Report everything as visible so the rows actually render.
class StubIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
global.IntersectionObserver = StubIntersectionObserver;
window.IntersectionObserver = StubIntersectionObserver;

// Two posts whose categories must never share a colour, plus a series
// container (which carries no category of its own).
const POSTS = [
  {
    slug: 'a-dev-post',
    title: 'A dev post',
    description: 'about code',
    category: 'dev',
    date: '2026-01-02',
    filename: 'a-dev-post.md',
    tags: [],
  },
  {
    slug: 'a-rant-post',
    title: 'A rant post',
    description: 'about everything',
    category: 'rant',
    date: '2026-01-01',
    filename: 'a-rant-post.md',
    tags: [],
  },
];

vi.mock('../../utils/dataUtils', () => ({
  fetchAllBlogPosts: () =>
    Promise.resolve({ allPostsData: POSTS, processedPosts: POSTS }),
}));

vi.mock('../../components/orbit/useOrbitContent', async () => {
  const actual = await vi.importActual('../../components/orbit/useOrbitContent');
  return {
    ...actual,
    useOrbitIndex: () => ({ data: POSTS, loading: false, error: null }),
    orbitPosts: (data) => data,
  };
});

const { default: LuxeBlogPage } = await import(
  '../luxe-views/LuxeBlogPage.jsx'
);
const { default: LedgerBlogPage } = await import('./LedgerBlogPage.jsx');
const { default: OrbitBlogPage } = await import('./OrbitBlogPage.jsx');
const { default: MistBlogPage } = await import('./MistBlogPage.jsx');
const { default: TerracottaBlogPage } = await import(
  './TerracottaBlogPage.jsx'
);

/**
 * The inline colour a view put on a category label. Filtering to elements that
 * carry an inline colour separates the row label from the index's filter chips,
 * which render the same words with no inline style.
 */
const colorOf = (label) => {
  const styled = screen
    .getAllByText(label, { exact: true })
    .filter((node) => node.style.color);
  expect(styled).toHaveLength(1);
  return styled[0].style.color;
};

const CASES = [
  { name: 'Luxe', Page: LuxeBlogPage, palette: 'luxe', labels: ['dev', 'rant'] },
  {
    name: 'Ledger',
    Page: LedgerBlogPage,
    palette: 'ledger',
    labels: ['DEV', 'RANT'],
  },
  {
    name: 'Orbit',
    Page: OrbitBlogPage,
    palette: 'orbit',
    labels: ['dev', 'rant'],
  },
  { name: 'Mist', Page: MistBlogPage, palette: 'mist', labels: ['dev', 'rant'] },
  {
    name: 'Terracotta',
    Page: TerracottaBlogPage,
    palette: 'terracotta',
    labels: ['dev', 'rant'],
  },
];

// jsdom normalises an inline hex to rgb(); a var() reference is kept verbatim.
const expected = (palette, category) => {
  const value = CATEGORY_PALETTES[palette][category];
  if (value.startsWith('var(')) return value;
  const [r, g, b] = [1, 3, 5].map((i) =>
    parseInt(value.slice(i, i + 2), 16),
  );
  return `rgb(${r}, ${g}, ${b})`;
};

describe('blog index category colours', () => {
  afterEach(cleanup);

  it.each(CASES)(
    '$name colours each category from its own palette',
    async ({ Page, palette, labels }) => {
      render(
        <MemoryRouter>
          <Page />
        </MemoryRouter>,
      );

      await screen.findByText('A dev post');

      const [devLabel, rantLabel] = labels;
      const devColor = colorOf(devLabel);
      const rantColor = colorOf(rantLabel);

      expect(devColor).toBe(expected(palette, 'dev'));
      expect(rantColor).toBe(expected(palette, 'rant'));
      // The regression being guarded: both categories rendered identically.
      expect(devColor).not.toBe(rantColor);
    },
  );
});
