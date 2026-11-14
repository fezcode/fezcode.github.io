const fs = require('node:fs');
const { isDeepStrictEqual } = require('node:util');
const piml = require('piml');

const SOURCE_FIELDS = ['provider', 'page', 'url', 'title', 'width', 'height'];

function sourceMetadata(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('imageSource must be an object');
  }
  const metadata = Object.fromEntries(
    SOURCE_FIELDS.filter(
      (key) => value[key] !== undefined && value[key] !== null,
    ).map((key) => {
      const field = value[key];
      if (key === 'width' || key === 'height') {
        if (!Number.isFinite(field) || field <= 0) {
          throw new TypeError(`imageSource.${key} must be a positive number`);
        }
      } else if (typeof field !== 'string') {
        throw new TypeError(`imageSource.${key} must be a string`);
      }
      return [key, field];
    }),
  );
  if (value.alternative !== undefined) {
    const alternative = value.alternative;
    if (
      !alternative ||
      typeof alternative.image !== 'string' ||
      !alternative.image.trim()
    ) {
      throw new TypeError(
        'imageSource.alternative.image must be a nonempty string',
      );
    }
    metadata.alternative = {
      image: alternative.image,
      ...sourceMetadata(alternative),
    };
  }
  return metadata;
}

function scanLines(text) {
  let offset = 0;
  return (text.match(/[^\n]*(?:\n|$)/g) || []).filter(Boolean).map((raw) => {
    const content = raw.replace(/\r?\n$/, '');
    const line = {
      content,
      start: offset,
      end: offset + raw.length,
      indent: content.match(/^ */)[0].length,
      significant:
        content.trim() !== '' && !content.trimStart().startsWith('#'),
    };
    offset += raw.length;
    return line;
  });
}

/**
 * Patch one log's artwork without reserializing its other fields or its file.
 * The whole fresh-read/validate/write transaction is synchronous, so parallel
 * async download workers in one process cannot overwrite each other's edits.
 * Omitting imageSource retains an existing source; supplying it replaces it.
 */
function setLogArtwork(filePath, slug, { image, imageSource } = {}) {
  if (typeof image !== 'string' || !image.trim()) {
    throw new TypeError('image must be a nonempty string');
  }
  const metadata =
    imageSource === undefined ? undefined : sourceMetadata(imageSource);
  const original = fs.readFileSync(filePath, 'utf8');
  const before = piml.parse(original);
  if (!Array.isArray(before.logs))
    throw new Error(`${filePath}: expected a logs array`);
  const matches = before.logs.flatMap((entry, index) =>
    entry?.slug === slug ? [index] : [],
  );
  if (matches.length !== 1) {
    throw new Error(
      `${filePath}: expected one log with slug ${JSON.stringify(slug)}, found ${matches.length}`,
    );
  }
  const entryIndex = matches[0];
  const entry = before.logs[entryIndex];
  if (
    entry.image === image &&
    (metadata === undefined || isDeepStrictEqual(entry.imageSource, metadata))
  ) {
    return false;
  }

  const lines = scanLines(original);
  const logsIndex = lines.findIndex((line) =>
    /^ *\(logs\)\s*(?:#.*)?$/.test(line.content),
  );
  if (logsIndex < 0)
    throw new Error(`${filePath}: could not locate the logs block`);
  const arrayIndent = lines[logsIndex].indent + 2;
  let blockEnd = lines.length;
  for (let index = logsIndex + 1; index < lines.length; index++) {
    if (lines[index].significant && lines[index].indent < arrayIndent) {
      blockEnd = index;
      break;
    }
  }
  const headers = [];
  for (let index = logsIndex + 1; index < blockEnd; index++) {
    if (
      lines[index].indent === arrayIndent &&
      /^>\s*(?:\([^()]*\))?\s*(?:#.*)?$/.test(lines[index].content.trimStart())
    ) {
      headers.push(index);
    }
  }
  if (headers.length !== before.logs.length) {
    throw new Error(`${filePath}: could not safely identify every log item`);
  }
  const firstLine = headers[entryIndex] + 1;
  const lastLine = headers[entryIndex + 1] ?? blockEnd;
  const fieldIndent = arrayIndent + 2;
  const keys = metadata === undefined ? ['image'] : ['image', 'imageSource'];
  const ranges = [];
  let descriptionStart;
  for (let index = firstLine; index < lastLine; index++) {
    const line = lines[index];
    if (line.indent !== fieldIndent) continue;
    const key = line.content.trimStart().match(/^\(([^()]*)\)/)?.[1];
    if (key === 'description') descriptionStart = line.start;
    if (!keys.includes(key)) continue;
    let end = line.end;
    for (let next = index + 1; next < lastLine; next++) {
      const child = lines[next];
      if (child.significant && child.indent <= fieldIndent) break;
      if (child.content.trim() && child.indent > fieldIndent) end = child.end;
    }
    ranges.push({ start: line.start, end });
  }

  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const fields =
    metadata === undefined ? { image } : { image, imageSource: metadata };
  const replacement =
    piml
      .stringify(fields)
      .trimEnd()
      .split('\n')
      .map((line) => `${' '.repeat(fieldIndent)}${line}`)
      .join(eol) + eol;
  const anchor = ranges.length
    ? Math.min(...ranges.map((range) => range.start))
    : (descriptionStart ?? lines[headers[entryIndex]].end);
  const edits = ranges.map((range) => ({
    ...range,
    text: range.start === anchor ? replacement : '',
  }));
  if (!ranges.length)
    edits.push({ start: anchor, end: anchor, text: replacement });
  let updated = original;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    updated =
      updated.slice(0, edit.start) + edit.text + updated.slice(edit.end);
  }
  if (!original.endsWith('\n')) updated = updated.replace(/\r?\n$/, '');

  const expected = {
    ...before,
    logs: before.logs.map((value, index) =>
      index === entryIndex ? { ...value, ...fields } : value,
    ),
  };
  if (!isDeepStrictEqual(piml.parse(updated), expected)) {
    throw new Error(
      `${filePath}: artwork patch changed unrelated log metadata`,
    );
  }
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

module.exports = { setLogArtwork };
