import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './blog-views/DossierBlogPostPage';
import DokumentBlogPostPage from './blog-views/DokumentBlogPostPage';
import EditorialBlogPostPage from './blog-views/EditorialBlogPostPage';
import BrutalistBlogPostPage from './blog-views/BrutalistBlogPostPage';
import OldBlogPostPage from './blog-views/OldBlogPostPage';
import TerminalBlogPostPage from './blog-views/TerminalBlogPostPage';
import TerminalGreenBlogPostPage from './blog-views/TerminalGreenBlogPostPage';
import LuxeBlogPostPage from './blog-views/LuxeBlogPostPage';

const BlogPostPage = () => {
  const { blogPostViewMode, fezcodexTheme } = useVisualSettings();
  const [searchParams] = useSearchParams();

  // Determine the effective view mode
  const effectiveViewMode = (() => {
    const themeParam = searchParams.get('theme');
    if (
      themeParam &&
      [
        'brutalist',
        'editorial',
        'dossier',
        'terminal',
        'dokument',
        'terminal-green',
        'old',
        'luxe',
      ].includes(themeParam)
    ) {
      return themeParam;
    }

    // If user has explicitly chosen a mode (other than standard), respect it
    if (blogPostViewMode !== 'standard') {
      return blogPostViewMode;
    }

    // Otherwise, adapt to the global theme
    if (fezcodexTheme === 'luxe') {
      return 'luxe';
    }

    return 'brutalist';
  })();

  if (effectiveViewMode === 'luxe') {
    return <LuxeBlogPostPage />;
  }

  if (effectiveViewMode === 'old') {
    return <OldBlogPostPage />;
  }

  if (effectiveViewMode === 'dossier') {
    return <DossierBlogPostPage />;
  }

  if (effectiveViewMode === 'dokument') {
    return <DokumentBlogPostPage />;
  }

  if (effectiveViewMode === 'editorial') {
    return <EditorialBlogPostPage />;
  }

  if (effectiveViewMode === 'terminal-green') {
    return <TerminalGreenBlogPostPage />;
  }

  if (effectiveViewMode === 'terminal') {
    return <TerminalBlogPostPage />;
  }

  return <BrutalistBlogPostPage />;
};

export default BlogPostPage;
