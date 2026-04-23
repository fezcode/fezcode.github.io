import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

export default async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext;
  const container = document.getElementById('react-root');
  const tree = (
    <BrowserRouter>
      <Page {...(pageProps || {})} />
    </BrowserRouter>
  );
  if (container.innerHTML && container.children.length > 0) {
    hydrateRoot(container, tree);
  } else {
    createRoot(container).render(tree);
  }
}
