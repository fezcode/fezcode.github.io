const experiments = require('../src/app/ProbabilityCabinet/experiments.json');

// The same allowlist drives article rendering, cabinet links, and feed links.
function experimentRssLinks(content) {
  return [...content.matchAll(/<probability-experiment\b([^>]*)>/g)]
    .map((match) => {
      const attrs = Object.fromEntries(
        [...match[1].matchAll(/([a-z]+)\s*=\s*["']([^"']*)["']/g)].map(
          (attr) => [attr[1], attr[2]],
        ),
      );
      const entry = experiments.find((item) => item.id === attrs.experiment);
      if (!entry) return '';
      const settings = Object.fromEntries(
        entry.attributes
          .filter((name) => /^[a-zA-Z0-9.-]{1,32}$/.test(attrs[name] || ''))
          .map((name) => [name, attrs[name]]),
      );
      const query = new URLSearchParams({ experiment: entry.id, ...settings })
        .toString()
        .replace(/&/g, '&amp;');
      return `<p>Interactive experiment: ${entry.description} <a href="https://fezcode.com/apps/probability-cabinet?${query}">Open ${entry.title} in the Probability Cabinet</a>.</p>`;
    })
    .join('');
}

module.exports = { experimentRssLinks };
