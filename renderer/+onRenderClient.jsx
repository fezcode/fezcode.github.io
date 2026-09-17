import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

export default async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext;
  const container = document.getElementById('react-root');
  const tree = (
    <BrowserRouter>
      <Page {...(pageProps || {})} />
    </BrowserRouter>
  );
  // The markup already in #react-root is not a server render of this tree — it
  // is a snapshot prerender-crawl took of the app *after* it had mounted,
  // fetched its data and run its effects. React's first client render has none
  // of that yet, so hydration could never match: every page threw "hydration
  // failed" (#418) and React discarded the DOM and re-rendered regardless.
  // Rendering fresh skips the doomed attempt. The snapshot still does its job —
  // it is what crawlers read and what paints before the bundle runs.
  createRoot(container).render(tree);
}
