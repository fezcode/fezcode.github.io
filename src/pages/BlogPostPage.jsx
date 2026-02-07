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

    // Auto-switch to luxe if global theme is luxe and user hasn't explicitly chosen another non-brutalist mode
    // or if they have selected 'luxe' explicitly in settings
    if (blogPostViewMode === 'luxe') return 'luxe';
    if (
      fezcodexTheme === 'luxe' &&
      (blogPostViewMode === 'brutalist' || blogPostViewMode === 'standard')
    )
      return 'luxe';

    return blogPostViewMode === 'standard' ? 'brutalist' : blogPostViewMode;
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
