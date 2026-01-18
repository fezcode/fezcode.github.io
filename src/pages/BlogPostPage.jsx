import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './blog-views/DossierBlogPostPage';
import DokumentBlogPostPage from './blog-views/DokumentBlogPostPage';
import EditorialBlogPostPage from './blog-views/EditorialBlogPostPage';
import StandardBlogPostPage from './blog-views/StandardBlogPostPage';
import OldBlogPostPage from './blog-views/OldBlogPostPage';
import TerminalBlogPostPage from './blog-views/TerminalBlogPostPage';
import TerminalGreenBlogPostPage from './blog-views/TerminalGreenBlogPostPage';

const BlogPostPage = () => {
  const { blogPostViewMode } = useVisualSettings();
  const [searchParams] = useSearchParams();

  // Determine the effective view mode
  // Using useMemo here to derive the mode based on URL params and context.
  // This ensures we only recalculate the "winning" mode when the URL or global setting changes,
  // preventing it from running on every render if other local state were to change.
  const effectiveViewMode = useMemo(() => {
    const themeParam = searchParams.get('theme');
    if (
      themeParam &&
      [
        'standard',
        'editorial',
        'dossier',
        'terminal',
        'dokument',
        'terminal-green',
        'old',
      ].includes(themeParam)
    ) {
      return themeParam;
    }
    return blogPostViewMode;
  }, [searchParams, blogPostViewMode]);

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

  return <StandardBlogPostPage />;
};

export default BlogPostPage;
