const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const sidebarLinkIsActive = (target, pathname) =>
  target === '/'
    ? pathname === '/'
    : Boolean(
        target && (pathname === target || pathname.startsWith(`${target}/`)),
      );

// Every theme uses the same sections, order, labels, icons, and destinations.
export const buildSidebarNavigation = (config) =>
  list(config)
    .map((section, index) => ({
      id: section.id || `sidebar-section-${index}`,
      label: section.label,
      collapsible: String(section.collapsible) !== 'false',
      items: list(section.content)
        .filter((item) => item.label && (item.url || item.to))
        .map((item) => ({
          label: item.label,
          icon: item.icon,
          to: item.url || item.to,
          external:
            Boolean(item.url) ||
            String(item.external) === 'true' ||
            /^(?:https?:|mailto:)/.test(item.to),
        })),
    }))
    .filter((section) => section.items.length);
