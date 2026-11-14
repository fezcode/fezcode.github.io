const namedEntities = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
};

const decodeEntities = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, value) => {
    if (value[0] !== '#') return namedEntities[value.toLowerCase()] ?? entity;
    const hexadecimal = value[1]?.toLowerCase() === 'x';
    const code = Number.parseInt(
      value.slice(hexadecimal ? 2 : 1),
      hexadecimal ? 16 : 10,
    );
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
      ? String.fromCodePoint(code)
      : entity;
  });

// Keep visible words from common inline formatting. Escapes and code spans
// are protected so literal underscores or asterisks remain in the label.
const headingLabel = (source) => {
  const literals = [];
  const protect = (value) => `\uE000${literals.push(value) - 1}\uE001`;
  let label = source
    .replace(/\\([\\`*{}[\]()#+\-.!_>~|])/g, (_, value) => protect(value))
    .replace(/(`+)([\s\S]*?)\1(?!`)/g, (_, ticks, value) =>
      protect(value.replace(/\s+/g, ' ').trim()),
    )
    .replace(/!?\[([^\]]*)\]\((?:\\.|[^)])*\)/g, '$1')
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/<[^>]+>/g, '');

  for (let pass = 0; pass < 3; pass += 1) {
    label = label
      .replace(/(\*\*|__|~~)(?=\S)(.+?\S|\S)\1/g, (match, delimiter, value) =>
        /^[*_~]+$/.test(value) ? match : value,
      )
      .replace(
        /(?<!\w)(\*|_)(?=\S)(.+?\S|\S)\1(?!\w)/g,
        (match, delimiter, value) => (/^[*_~]+$/.test(value) ? match : value),
      );
  }
  return decodeEntities(label)
    .replace(/\uE000(\d+)\uE001/g, (_, index) => literals[Number(index)])
    .replace(/\s+/g, ' ')
    .trim();
};

const anchorBase = (label) =>
  label
    .normalize('NFC')
    .toLowerCase()
    // Unicode lowercasing of Turkish capital İ adds a combining dot.
    .replace(/\u0307/g, '')
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-') || 'section';

/** H2 landmarks with source lines matching ReactMarkdown node positions. */
export function getWordupSections(markdown = '') {
  const sections = [];
  const used = new Set();
  const lines = String(markdown ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n');
  let fence = null;
  let paragraph = [];

  const add = (source, line) => {
    const label = headingLabel(source);
    if (!label) return;
    const base = `wordup-${anchorBase(label)}`;
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    sections.push({ id, label, line });
  };

  lines.forEach((line, index) => {
    const fenceLine = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (
        fenceLine &&
        fenceLine[1][0] === fence.character &&
        fenceLine[1].length >= fence.length &&
        !fenceLine[2].trim()
      )
        fence = null;
      return;
    }
    if (fenceLine && (fenceLine[1][0] !== '`' || !fenceLine[2].includes('`'))) {
      fence = { character: fenceLine[1][0], length: fenceLine[1].length };
      paragraph = [];
      return;
    }
    if (!line.trim() || /^(?: {4}|\t)/.test(line)) {
      paragraph = [];
      return;
    }

    const heading = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
    if (heading) {
      if (heading[1].length === 2) {
        const content = (heading[2] || '').replace(/(?:^|[ \t]+)#+[ \t]*$/, '');
        add(content, index + 1);
      }
      paragraph = [];
      return;
    }
    if (/^ {0,3}-+[ \t]*$/.test(line) && paragraph.length) {
      add(paragraph.map((entry) => entry.text).join(' '), paragraph[0].line);
      paragraph = [];
      return;
    }
    // Top-level prose can form a Setext heading. Lists, blockquotes, rules,
    // and HTML blocks should not accidentally become navigation landmarks.
    if (
      /^ {0,3}(?:>|[-+*][ \t]|\d+[.)][ \t]|(?:[-*_][ \t]*){3,}$|<|=+[ \t]*$)/.test(
        line,
      )
    ) {
      paragraph = [];
      return;
    }
    paragraph.push({ text: line.trim(), line: index + 1 });
  });

  return sections;
}

/** Resolve only author-supplied relationships, in their original order. */
export function getRelatedWords(word, words = []) {
  if (!word || typeof word.related !== 'string') return [];
  const registry = new Map(
    words.filter(Boolean).map((entry) => [entry.slug, entry]),
  );
  const seen = new Set([word.slug]);
  return word.related.split(',').flatMap((value) => {
    const slug = value.trim();
    if (!slug || seen.has(slug) || !registry.has(slug)) return [];
    seen.add(slug);
    return [registry.get(slug)];
  });
}
