// Central sprite catalog. Generators self-register at import time by calling
// `family(...)` or `register(...)`. The browser UI reads the catalog through the
// getters below.

const _items = [];
const _byId = new Map();

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function register(entry) {
  if (!entry || !entry.id || _byId.has(entry.id)) return entry;
  const item = {
    tags: [],
    size: 64,
    category: 'misc',
    seed: hashString(entry.id),
    ...entry,
  };
  _byId.set(item.id, item);
  _items.push(item);
  return item;
}

// Register N seeded variants of one draw function. This is the primary way the
// catalog reaches 1000+ distinct, individually-selectable stamps.
export function family({
  id,
  name,
  category,
  tags = [],
  size = 64,
  draw,
  variants = 1,
}) {
  const made = [];
  for (let i = 1; i <= variants; i++) {
    made.push(
      register({
        id: variants > 1 ? `${id}.${i}` : id,
        name: variants > 1 ? `${name} ${i}` : name,
        baseId: id,
        baseName: name,
        category,
        tags,
        size,
        draw,
        seed: (hashString(id) + i * 0x9e3779b1) >>> 0,
      }),
    );
  }
  return made;
}

export const getAll = () => _items;
export const getByCategory = (cat) => _items.filter((e) => e.category === cat);
export const get = (id) => _byId.get(id);
export const count = () => _items.length;

export function search(query) {
  const s = (query || '').trim().toLowerCase();
  if (!s) return _items;
  return _items.filter(
    (e) =>
      e.name.toLowerCase().includes(s) ||
      e.id.toLowerCase().includes(s) ||
      (e.baseName && e.baseName.toLowerCase().includes(s)) ||
      (e.tags || []).some((t) => t.toLowerCase().includes(s)),
  );
}

export function categoryCounts() {
  const m = {};
  for (const e of _items) m[e.category] = (m[e.category] || 0) + 1;
  return m;
}
