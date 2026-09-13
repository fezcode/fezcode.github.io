import piml from 'piml';
import {
  buildSidebarNavigation,
  sidebarLinkIsActive,
} from './sidebarNavigation';

describe('Shared sidebar configuration', () => {
  it('uses PIML section and item order, labels, icons, and destinations', () => {
    const config = piml.parse(`(sidebar)
  > (section)
    (id) codex
    (label) The Codex
    (collapsible) false
    (content)
      > (item)
        (label) Start
        (to) /start
        (icon) HouseIcon
      > (item)
        (label) Writing
        (to) /journal
        (icon) ArticleIcon
  > (section)
    (id) feed
    (label) Field notes
    (content)
      > (item)
        (label) Research
        (to) /research
        (icon) GraphIcon
`).sidebar;
    const original = JSON.stringify(config);
    const nav = buildSidebarNavigation(config);
    expect(
      nav.map(({ id, label, collapsible }) => ({ id, label, collapsible })),
    ).toEqual([
      { id: 'codex', label: 'The Codex', collapsible: false },
      { id: 'feed', label: 'Field notes', collapsible: true },
    ]);
    expect(
      nav[0].items.map(({ to, label, icon }) => ({ to, label, icon })),
    ).toEqual([
      { to: '/start', label: 'Start', icon: 'HouseIcon' },
      { to: '/journal', label: 'Writing', icon: 'ArticleIcon' },
    ]);
    expect(nav[1].items.map(({ to }) => to)).toEqual(['/research']);
    expect(JSON.stringify(config)).toBe(original);
  });

  it('supports single-item sections, missing configuration, and empty groups', () => {
    const nav = buildSidebarNavigation({
      id: 'new',
      label: 'New section',
      content: { label: 'New page', to: '/new' },
    });
    expect(nav[0].items[0].to).toBe('/new');
    expect(nav[0].collapsible).toBe(true);
    expect(buildSidebarNavigation(undefined)).toEqual([]);
    expect(buildSidebarNavigation({ id: 'empty', content: [] })).toEqual([]);
  });

  it('preserves external and feed links and ignores incomplete entries', () => {
    const nav = buildSidebarNavigation([
      {
        content: [
          { label: 'Site', to: 'https://example.com' },
          { label: 'Feed', url: '/rss.xml', external: true },
          { label: 'Contact', to: 'mailto:hello@example.com' },
          { label: 'Incomplete' },
          { to: '/missing-label' },
        ],
      },
    ]);
    expect(nav[0].items).toHaveLength(3);
    expect(nav[0].items.every(({ external }) => external)).toBe(true);
    expect(nav[0].items[1]).toMatchObject({ to: '/rss.xml', external: true });
  });

  it('opens a child route group without treating Home or similar prefixes as active', () => {
    expect(sidebarLinkIsActive('/', '/about')).toBe(false);
    expect(sidebarLinkIsActive('/about', '/about/orbit')).toBe(true);
    expect(sidebarLinkIsActive('/log', '/logs')).toBe(false);
    expect(sidebarLinkIsActive('/about', '/about')).toBe(true);
  });
});
