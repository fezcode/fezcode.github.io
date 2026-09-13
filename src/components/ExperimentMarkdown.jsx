import React, { lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import experiments from '../app/ProbabilityCabinet/experiments.json';

const ProbabilityExperiment = lazy(
  () => import('../app/ProbabilityCabinet/ProbabilityExperiment'),
);

function ExperimentRenderer({ experiment, ...attributes }) {
  const entry = experiments.find((item) => item.id === experiment);
  const settings = Object.fromEntries(
    (entry?.attributes || [])
      .filter((name) => attributes[name] !== undefined)
      .map((name) => [name, attributes[name]]),
  );
  return (
    <Suspense fallback={<p role="status">Loading probability experiment…</p>}>
      <ProbabilityExperiment experiment={experiment} {...settings} />
    </Suspense>
  );
}

// Keep the custom element registration consistent across every reading theme.
// Pass only supported attributes; Markdown never supplies executable code.
function experimentBlocks() {
  return (tree) => {
    const visit = (node) => {
      if (
        node.tagName === 'p' &&
        node.children?.some(
          (child) => child.tagName === 'probability-experiment',
        )
      ) {
        node.tagName = 'div';
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export default function ExperimentMarkdown({
  components = {},
  rehypePlugins = [],
  ...props
}) {
  return (
    <ReactMarkdown
      {...props}
      rehypePlugins={[...rehypePlugins, experimentBlocks]}
      components={{
        ...components,
        'probability-experiment': ExperimentRenderer,
      }}
    />
  );
}
