import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import DiscoveryPage from './DiscoveryPage';
import { fetchDiscoveryEntries, loadDiscoveryBody } from './discoveryData';

vi.mock('./PhysicalCover', () => ({
  default: ({ entry, open }) => (
    <div data-testid="physical-cover" data-open={open}>
      {entry.title}
    </div>
  ),
}));
vi.mock('./discoveryData', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchDiscoveryEntries: vi.fn(),
  loadDiscoveryBody: vi.fn(),
}));

// Keep routing, focus, loading and cover controls real; layout animation is
// verified in the browser rather than depending on jsdom's absent layout.
vi.mock('framer-motion', async () => {
  const ReactModule = await import('react');
  const components = new Map();
  return {
    useReducedMotion: () => true,
    AnimatePresence: ({ children }) => children,
    LayoutGroup: ({ children }) => children,
    motion: new Proxy(
      {},
      {
        get: (_, tag) => {
          if (!components.has(tag)) {
            components.set(
              tag,
              ReactModule.forwardRef(function MotionElement(
                {
                  children,
                  initial,
                  animate,
                  exit,
                  transition,
                  layoutId,
                  ...props
                },
                ref,
              ) {
                return ReactModule.createElement(
                  tag,
                  { ...props, ref },
                  children,
                );
              }),
            );
          }
          return components.get(tag);
        },
      },
    ),
  };
});

const makeEntry = (index, extra = {}) => {
  const number = String(index + 1).padStart(2, '0');
  const category = ['game', 'music', 'book'][index % 3];
  const slug = 'entry-' + number;
  return {
    id: category + '/' + slug,
    category,
    categoryLabel: category[0].toUpperCase() + category.slice(1),
    slug,
    title: 'Discovery ' + number,
    date: new Date(Date.UTC(2026, 10, 14 - index)).toISOString().slice(0, 10),
    description: 'A personal discovery note.',
    rating: 4,
    tags: [],
    credit: '',
    link: 'https://example.com/source',
    cover: '/images/art/' + slug + '.webp',
    fallbackCover: '/images/discovery/covers/' + category + '/' + slug + '.svg',
    ...extra,
  };
};
const ordered = Array.from({ length: 55 }, (_, index) => makeEntry(index));
// The UI must impose newest-first order, independent of category/file order.
const entries = [...ordered].reverse();
const result = {
  entries,
  categories: ['book', 'game', 'music'],
  failedCategories: [],
};
function LocationProbe() {
  const location = useLocation();
  return (
    <span data-testid="current-route">
      {location.pathname}
      {location.search}
    </span>
  );
}
function mountPage(path = '/discovery') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route path="/logs" element={<DiscoveryPage />} />
        <Route
          path="/discovery/:category?/:slug?"
          element={<DiscoveryPage />}
        />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );
}
const route = () => screen.getByTestId('current-route').textContent;
const shelf = () =>
  screen.getByRole('region', { name: 'Discovery shelf, newest first' });
const spines = () => within(shelf()).getAllByRole('link');
const spineFlags = (region, attribute) =>
  within(region)
    .getAllByRole('link', { hidden: true })
    .filter((link) => link.getAttribute(attribute) === 'true');
const mockShelfGeometry = (width = 106) => {
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(
    function () {
      return this.classList?.contains('dc-shelf-scroll') ? width : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
    function () {
      return this.classList?.contains('dc-spine') ? 48 : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(
    function () {
      return this.classList?.contains('dc-spine') ? 40 : 0;
    },
  );
  const computedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (element, ...args) => {
      const style = computedStyle(element, ...args);
      if (element.classList?.contains('dc-shelf')) {
        Object.defineProperty(style, 'columnGap', {
          value: '5px',
          configurable: true,
        });
      }
      return style;
    },
  );
};
// Legacy presentation markers have no semantic query target.
// Keep this decorative markup check inside one helper.
/* eslint-disable testing-library/no-node-access */
const inspectDiscoveryPresentation = (root) => ({
  legacyLayout: root.querySelector(
    'header, .dc-hero, .dc-grid, .dc-collection',
  ),
});
/* eslint-enable testing-library/no-node-access */
const openEntry = (title) =>
  fireEvent.click(
    screen.getByRole('link', {
      name: 'Open ' + title + ' from the shelf',
      exact: true,
    }),
  );
const waitForShelf = () =>
  screen.findByRole('link', {
    name: 'Open Discovery 01 from the shelf',
    exact: true,
  });
const closeDialog = async () => {
  fireEvent.click(
    screen.getByRole('button', { name: 'Close showcase', exact: true }),
  );
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
};
const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
);
const originalScrollBy = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollBy',
);
beforeEach(() => {
  fetchDiscoveryEntries.mockResolvedValue(result);
  loadDiscoveryBody.mockResolvedValue(
    '# Original notes\n\nThe complete discovery entry.',
  );
  vi.stubGlobal('IntersectionObserver', undefined);
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
  document.body.style.overflow = '';
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  if (originalScrollIntoView)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      originalScrollIntoView,
    );
  else delete HTMLElement.prototype.scrollIntoView;
  if (originalScrollBy)
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', originalScrollBy);
  else delete HTMLElement.prototype.scrollBy;
  document.body.style.overflow = '';
});

describe('the shelf-only discovery page', () => {
  it('provides a close-shelf link back home, kept inert behind an open showcase', async () => {
    mountPage('/logs');
    await waitForShelf();
    const closeShelf = screen.getByRole('link', { name: 'Close shelf' });
    expect(closeShelf).toHaveAttribute('href', '/');
    expect(closeShelf).toHaveClass('dc-shelf-close');
    openEntry('Discovery 01');
    await screen.findByRole('dialog', { name: 'Discovery 01' });
    expect(screen.getByRole('main')).toHaveAttribute('inert');
    await closeDialog();
    expect(route()).toBe('/logs');
    expect(screen.getByRole('main')).not.toHaveAttribute('inert');
    fireEvent.click(closeShelf);
    expect(route()).toBe('/');
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
  it('renders one mixed-category shelf, newest first, without a header, hero, or collection grid', async () => {
    const view = mountPage('/discovery?type=game&order=oldest');
    await waitForShelf();
    expect(spines()).toHaveLength(24);
    expect(
      spines()
        .slice(0, 3)
        .map((el) => el.getAttribute('aria-label')),
    ).toEqual([
      'Open Discovery 01 from the shelf',
      'Open Discovery 02 from the shelf',
      'Open Discovery 03 from the shelf',
    ]);
    expect(
      spines()
        .slice(0, 3)
        .map((el) => el.getAttribute('data-category')),
    ).toEqual(['game', 'music', 'book']);
    expect(spines()[23]).toHaveAccessibleName(
      'Open Discovery 24 from the shelf',
    );
    expect(
      inspectDiscoveryPresentation(view.container).legacyLayout,
    ).toBeNull();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Filter by category' }),
    ).toHaveValue('all');
    expect(
      screen.getByRole('heading', { name: 'Discovery shelf' }),
    ).toHaveClass('sr-only');
    expect(screen.getByRole('status')).toHaveTextContent(
      '24 of 55 discoveries, newest first',
    );
  });
  it('uses authored narrow spine artwork while retaining category hints and real cover imagery', async () => {
    fetchDiscoveryEntries.mockResolvedValueOnce({
      ...result,
      entries: [
        makeEntry(0, {
          spineImage: '/images/spines/printed.webp',
          imagePosition: '30% center',
        }),
      ],
    });
    mountPage();
    await waitForShelf();
    const spine = spines()[0];
    expect(spine).toHaveAttribute('data-authored-spine', 'true');
    const artwork = within(spine).getByAltText('');
    expect(artwork).toHaveAttribute('src', '/images/spines/printed.webp');
    expect(artwork).toHaveStyle({
      objectPosition: '30% center',
    });
    expect(
      within(spine).getByText(/game/i, { selector: '.dc-category-name' }),
    ).toBeInTheDocument();
  });
  it('progressively appends older discoveries in batches without duplicating entries', async () => {
    mountPage();
    await waitForShelf();
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(48);
    expect(spines()[47]).toHaveAccessibleName(
      'Open Discovery 48 from the shelf',
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(55);
    expect(
      new Set(spines().map((el) => el.getAttribute('data-entry-id'))).size,
    ).toBe(55);
    expect(
      screen.queryByRole('button', { name: 'Load more discoveries' }),
    ).not.toBeInTheDocument();
  });
  it('observes the horizontal scroll container and preloads the next shelf segment on its right', async () => {
    const observers = [];
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback, options) {
          this.callback = callback;
          this.options = options;
          this.disconnect = vi.fn();
          observers.push(this);
        }
        observe = vi.fn();
      },
    );
    mountPage();
    await waitForShelf();
    const observer = observers.at(-1);
    expect(observer.options.root).toBe(shelf());
    expect(observer.options.rootMargin).toBe('0px 600px 0px 0px');
    act(() => observer.callback([{ isIntersecting: true }]));
    expect(spines()).toHaveLength(48);
    expect(observer.disconnect).toHaveBeenCalled();
  });
  it('maps an ordinary vertical wheel to shelf movement but preserves horizontal gestures and zoom', async () => {
    mountPage();
    await waitForShelf();
    const region = shelf();
    const vertical = new WheelEvent('wheel', {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(region, vertical);
    expect(region.scrollLeft).toBe(120);
    expect(vertical.defaultPrevented).toBe(true);
    const horizontal = new WheelEvent('wheel', {
      deltaX: 160,
      deltaY: 20,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(region, horizontal);
    expect(region.scrollLeft).toBe(120);
    expect(horizontal.defaultPrevented).toBe(false);
    const zoom = new WheelEvent('wheel', {
      deltaY: 100,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(region, zoom);
    expect(region.scrollLeft).toBe(120);
    expect(zoom.defaultPrevented).toBe(false);
  });
  it('supports arrow-key exploration of spines and requests older items at the loaded edge', async () => {
    mountPage();
    await waitForShelf();
    const first = spines()[0];
    const second = spines()[1];
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();
    expect(second.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ inline: 'nearest' }),
    );
    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(first).toHaveFocus();
    const last = spines()[23];
    last.focus();
    fireEvent.keyDown(last, { key: 'ArrowRight' });
    expect(spines()).toHaveLength(48);
  });

  it('bounds artwork to the measured viewport while preserving all spine links', async () => {
    mockShelfGeometry();
    mountPage();
    await waitForShelf();
    const region = shelf();
    await waitFor(() =>
      expect(spineFlags(region, 'data-media-loaded').length).toBeLessThan(24),
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(48);
    region.scrollLeft = 1325;
    fireEvent.scroll(region);
    const firstSpine = within(region).getByRole('link', {
      name: 'Open Discovery 01 from the shelf',
      exact: true,
    });
    const nextSegmentSpine = within(region).getByRole('link', {
      name: 'Open Discovery 25 from the shelf',
      exact: true,
    });
    await waitFor(() =>
      expect(firstSpine).toHaveAttribute('data-media-loaded', 'false'),
    );
    await waitFor(() =>
      expect(nextSegmentSpine).toHaveAttribute('data-media-loaded', 'true'),
    );
    await waitFor(() =>
      expect(spineFlags(region, 'data-media-loaded').length).toBeLessThan(24),
    );
    fireEvent.click(nextSegmentSpine);
    await screen.findByRole('dialog', { name: 'Discovery 25' });
    expect(spineFlags(region, 'data-media-loaded').length).toBeLessThan(24);
  });

  it('slides the shelf with its edge controls and hides the left control when back at the start', async () => {
    mockShelfGeometry();
    const scrollBy = vi.fn(function ({ left }) {
      this.scrollLeft += left;
      fireEvent.scroll(this);
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value: scrollBy,
    });
    mountPage();
    await waitForShelf();
    const region = shelf();
    expect(
      screen.queryByRole('button', { name: 'Scroll shelf left' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Scroll shelf right' }));
    await waitFor(() => expect(scrollBy).toHaveBeenCalledTimes(1));
    expect(scrollBy).toHaveBeenLastCalledWith({
      left: expect.any(Number),
      behavior: 'auto',
    });
    expect(region.scrollLeft).toBeGreaterThan(0);
    const leftControl = await screen.findByRole('button', {
      name: 'Scroll shelf left',
    });
    fireEvent.click(leftControl);
    expect(scrollBy).toHaveBeenCalledTimes(2);
    expect(scrollBy.mock.calls[1][0].left).toBeLessThan(0);
    expect(region.scrollLeft).toBe(0);
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Scroll shelf left' }),
      ).not.toBeInTheDocument(),
    );
  });
});

describe('single-category shelf filtering', () => {
  const filter = () =>
    screen.getByRole('combobox', { name: 'Filter by category' });
  const chooseCategory = (value) =>
    fireEvent.change(filter(), { target: { value } });
  const expectCategory = (category) => {
    expect(
      new Set(spines().map((spine) => spine.getAttribute('data-category'))),
    ).toEqual(new Set([category]));
  };

  it('replaces the active category and lets All restore the mixed shelf without losing other query parameters', async () => {
    mountPage('/logs?source=bookmark');
    await waitForShelf();
    expect(within(filter()).getAllByRole('option')).toHaveLength(4);

    chooseCategory('game');
    expect(filter()).toHaveValue('game');
    expectCategory('game');
    expect(spines()).toHaveLength(19);
    expect(
      spines()
        .slice(0, 3)
        .map((spine) => spine.getAttribute('aria-label')),
    ).toEqual([
      'Open Discovery 01 from the shelf',
      'Open Discovery 04 from the shelf',
      'Open Discovery 07 from the shelf',
    ]);
    expect(route()).toBe('/logs?source=bookmark&category=game');

    chooseCategory('music');
    expect(filter()).toHaveValue('music');
    expectCategory('music');
    expect(spines()).toHaveLength(18);
    expect(route()).toBe('/logs?source=bookmark&category=music');

    chooseCategory('all');
    expect(filter()).toHaveValue('all');
    expect(spines()).toHaveLength(24);
    expect(route()).toBe('/logs?source=bookmark');
    expect(fetchDiscoveryEntries).toHaveBeenCalledTimes(1);
  });

  it('restores a category directly from a bookmarked shelf URL', async () => {
    mountPage('/logs?category=music');
    await screen.findByRole('link', {
      name: 'Open Discovery 02 from the shelf',
      exact: true,
    });
    expect(filter()).toHaveValue('music');
    expectCategory('music');
    expect(spines()).toHaveLength(18);
    expect(spines()[0]).toHaveAccessibleName(
      'Open Discovery 02 from the shelf',
    );
  });

  it('falls back to All for an unknown category rather than showing an empty shelf', async () => {
    mountPage('/discovery?category=unknown-category');
    await waitForShelf();
    expect(filter()).toHaveValue('all');
    expect(spines()).toHaveLength(24);
    expect(
      new Set(spines().map((spine) => spine.getAttribute('data-category'))),
    ).toEqual(new Set(['game', 'music', 'book']));
  });

  it('starts each category at its newest segment and scroll position while paginating only that category', async () => {
    fetchDiscoveryEntries.mockResolvedValueOnce({
      ...result,
      entries: Array.from({ length: 84 }, (_, index) =>
        makeEntry(index),
      ).reverse(),
    });
    mountPage('/logs');
    await waitForShelf();
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(48);
    const region = shelf();
    region.scrollLeft = 1120;

    chooseCategory('game');
    expectCategory('game');
    expect(spines()).toHaveLength(24);
    expect(screen.getByRole('status')).toHaveTextContent('24 of 28');
    await waitFor(() => expect(shelf().scrollLeft).toBe(0));
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(28);
    expectCategory('game');
    expect(
      screen.queryByRole('button', { name: 'Load more discoveries' }),
    ).not.toBeInTheDocument();
    shelf().scrollLeft = 640;

    chooseCategory('book');
    expectCategory('book');
    expect(spines()).toHaveLength(24);
    expect(spines()[0]).toHaveAccessibleName(
      'Open Discovery 03 from the shelf',
    );
    await waitFor(() => expect(shelf().scrollLeft).toBe(0));

    chooseCategory('all');
    expect(spines()).toHaveLength(24);
    expect(screen.getByRole('status')).toHaveTextContent('24 of 84');
  });

  it('keeps showcase navigation within the selected category and restores the filtered shelf on close', async () => {
    fetchDiscoveryEntries.mockResolvedValueOnce({
      ...result,
      entries: Array.from({ length: 84 }, (_, index) =>
        makeEntry(index),
      ).reverse(),
    });
    mountPage('/logs?category=game');
    await waitForShelf();
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    expect(spines()).toHaveLength(28);
    const region = shelf();
    region.scrollLeft = 640;
    const trigger = screen.getByRole('link', {
      name: 'Open Discovery 76 from the shelf',
      exact: true,
    });
    trigger.focus();
    fireEvent.click(trigger);
    let dialog = await screen.findByRole('dialog', { name: 'Discovery 76' });
    expect(route()).toBe('/discovery/game/entry-76?category=game');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Previous' }));
    dialog = await screen.findByRole('dialog', { name: 'Discovery 73' });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Next discovery' }),
    );
    dialog = await screen.findByRole('dialog', { name: 'Discovery 76' });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Next discovery' }),
    );
    await screen.findByRole('dialog', { name: 'Discovery 79' });
    expect(route()).toBe('/discovery/game/entry-79?category=game');
    region.scrollLeft = 0;

    await closeDialog();
    expect(route()).toBe('/logs?category=game');
    expect(filter()).toHaveValue('game');
    expectCategory('game');
    expect(spines()).toHaveLength(28);
    await waitFor(() => expect(region.scrollLeft).toBe(640));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('resolves a directly linked entry even when its category differs from the shelf filter', async () => {
    mountPage('/discovery/music/entry-02?category=game');
    await screen.findByRole('dialog', { name: 'Discovery 02' });
    await closeDialog();
    expect(route()).toBe('/logs?category=game');
    expect(filter()).toHaveValue('game');
    expectCategory('game');
  });
});

describe('opening and returning to the shelf', () => {
  it('keeps the default logs shelf instance and restores it after a showcase route', async () => {
    mountPage('/logs');
    await waitForShelf();
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    const region = shelf();
    region.scrollLeft = 1120;
    const trigger = spines()[34];
    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Discovery 35' });
    expect(route()).toBe('/discovery/music/entry-35');
    region.scrollLeft = 0;
    await closeDialog();
    expect(route()).toBe('/logs');
    expect(shelf()).toBe(region);
    expect(spines()).toHaveLength(48);
    // Route DOM removal can precede the passive cleanup that restores the shelf.
    await waitFor(() => expect(region.scrollLeft).toBe(1120));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole('link', { name: 'Classic view' })).toHaveAttribute(
      'href',
      '/logs?view=classic',
    );
  });
  it('restores the horizontal position, loaded segment, and clicked spine focus after closing', async () => {
    mountPage();
    await waitForShelf();
    fireEvent.click(
      screen.getByRole('button', { name: 'Load more discoveries' }),
    );
    const region = shelf();
    region.scrollLeft = 1120;
    const trigger = spines()[34];
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 35' });
    expect(route()).toBe('/discovery/music/entry-35');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(
      within(dialog).getByRole('button', { name: 'Close showcase' }),
    ).toHaveFocus();
    region.scrollLeft = 0;
    await closeDialog();
    expect(route()).toBe('/discovery');
    expect(spines()).toHaveLength(48);
    await waitFor(() => expect(region.scrollLeft).toBe(1120));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body.style.overflow).toBe('');
  });
  it('browses previous and next chronologically across categories and closes in one step', async () => {
    mountPage();
    await waitForShelf();
    openEntry('Discovery 01');
    let dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    expect(
      within(dialog).getByRole('button', { name: 'Previous' }),
    ).toBeDisabled();
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Next discovery' }),
    );
    dialog = await screen.findByRole('dialog', { name: 'Discovery 02' });
    expect(route()).toBe('/discovery/music/entry-02');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Previous' }));
    await screen.findByRole('dialog', { name: 'Discovery 01' });
    await closeDialog();
    expect(route()).toBe('/discovery');
  });
  it('opens the lid to reveal contents and lets the user close and reopen it', async () => {
    mountPage();
    await waitForShelf();
    openEntry('Discovery 01');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    const closeCover = await within(dialog).findByRole('button', {
      name: 'Close the cover',
    });
    expect(closeCover).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(closeCover);
    const openCover = within(dialog).getByRole('button', {
      name: 'Open the cover',
    });
    expect(openCover).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(openCover);
    expect(
      within(dialog).getByRole('button', { name: 'Close the cover' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
  it('keeps the original music sleeve and booklet instead of the physical case renderer', async () => {
    mountPage('/discovery/music/entry-02');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 02' });
    expect(within(dialog).getByText(/Some things/)).toHaveTextContent(
      /Some things\s*are worth\s*keeping\./,
    );
    expect(
      within(dialog).queryByTestId('physical-cover'),
    ).not.toBeInTheDocument();
    const closeCover = await within(dialog).findByRole('button', {
      name: 'Close the cover',
    });
    expect(closeCover).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(closeCover);
    const openCover = within(dialog).getByRole('button', {
      name: 'Open the cover',
    });
    expect(openCover).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(openCover);
    expect(
      within(dialog).getByRole('button', { name: 'Close the cover' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(dialog).queryByTestId('physical-cover'),
    ).not.toBeInTheDocument();
  });
  it('contains focus in the modal and restores the original body scrolling style on Escape', async () => {
    document.body.style.overflow = 'clip';
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
      { width: 20, height: 20 },
    ]);
    mountPage();
    await waitForShelf();
    openEntry('Discovery 01');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    const first = within(dialog).getByRole('button', {
      name: 'Enter fullscreen',
    });
    const last = within(dialog).getByRole('button', { name: 'Next discovery' });
    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(document.body.style.overflow).toBe('clip');
  });
  it('handles missing direct entries with initial focus, a Tab trap, and Escape back to the shelf', async () => {
    mountPage('/discovery/game/missing-entry');
    await screen.findByRole('heading', {
      name: 'This cover isn’t on the shelf.',
    });
    const dialog = screen.getByRole('dialog', { name: 'Discovery entry' });
    const close = within(dialog).getByRole('button', {
      name: 'Close showcase',
    });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(route()).toBe('/logs');
    expect(shelf()).toHaveFocus();
  });
  it('moves loading-dialog focus to the resolved entry without leaving a stale Escape handler', async () => {
    let resolveEntries;
    fetchDiscoveryEntries.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveEntries = resolve;
        }),
    );
    mountPage('/discovery/game/entry-01');
    const loading = screen.getByRole('dialog', { name: 'Discovery entry' });
    const oldClose = within(loading).getByRole('button', {
      name: 'Close showcase',
    });
    expect(oldClose).toHaveFocus();
    await act(async () => resolveEntries(result));
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    expect(oldClose.isConnected).toBe(false);
    expect(
      within(dialog).getByRole('button', { name: 'Close showcase' }),
    ).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(route()).toBe('/logs');
    expect(shelf()).toHaveFocus();
  });
});

describe('showcase notes and fullscreen', () => {
  it('renders authored video embeds as responsive lazy players while preserving fenced code', async () => {
    const embed =
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/bWPOLL_Rr8U?start=3&amp;rel=0" title="Hooverphonic - Eden (Official Video)" allow="encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    const code = '<iframe src="https://example.com/code-sample"></iframe>';
    loadDiscoveryBody.mockResolvedValueOnce(
      '# Watch the video\n\n' + embed + '\n\n```html\n' + code + '\n```',
    );
    mountPage('/discovery/game/entry-01');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Read the full entry' }),
    );
    const player = await within(dialog).findByTitle(
      'Hooverphonic - Eden (Official Video)',
    );
    expect(player.tagName).toBe('IFRAME');
    expect(player).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/bWPOLL_Rr8U?start=3&rel=0',
    );
    expect(player).toHaveClass('dc-entry-video');
    expect(player).toHaveAttribute('loading', 'lazy');
    expect(player).toHaveAttribute('allowfullscreen');
    expect(player).toHaveAttribute(
      'referrerpolicy',
      'strict-origin-when-cross-origin',
    );
    expect(within(dialog).queryByText(embed)).not.toBeInTheDocument();
    expect(within(dialog).getByText(code)).toHaveClass('language-html');
  });
  it('loads the full notes only on request and can retry a failed read', async () => {
    loadDiscoveryBody
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('# Recovered notes\n\nThe complete entry.');
    mountPage('/discovery/game/entry-01');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    expect(loadDiscoveryBody).not.toHaveBeenCalled();
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Read the full entry' }),
    );
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'The full entry couldn’t be loaded.',
    );
    fireEvent.click(within(dialog).getByRole('button', { name: 'Try again' }));
    expect(
      await within(dialog).findByRole('heading', { name: 'Recovered notes' }),
    ).toBeInTheDocument();
    expect(loadDiscoveryBody).toHaveBeenCalledTimes(2);
    expect(loadDiscoveryBody.mock.calls[0][0].id).toBe('game/entry-01');
  });
  it('keeps the window-filling showcase usable when native fullscreen is unavailable', async () => {
    mountPage('/discovery/game/entry-01');
    const dialog = await screen.findByRole('dialog', { name: 'Discovery 01' });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Enter fullscreen' }),
    );
    expect(await within(dialog).findByRole('status')).toHaveTextContent(
      'The showcase already fills your window.',
    );
    expect(dialog).toBeInTheDocument();
  });
});
