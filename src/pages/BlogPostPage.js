import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './DossierBlogPostPage';
import StandardBlogPostPage from './StandardBlogPostPage';
import TerminalBlogPostPage from './TerminalBlogPostPage';

const BlogPostPage = () => {
  const { blogPostViewMode } = useVisualSettings();
  const [searchParams] = useSearchParams();

  // Determine the effective view mode
  // Using useMemo here to derive the mode based on URL params and context.
  // This ensures we only recalculate the "winning" mode when the URL or global setting changes,
  // preventing it from running on every render if other local state were to change.
  const effectiveViewMode = useMemo(() => {
    const themeParam = searchParams.get('theme');
    if (themeParam && ['dossier', 'terminal', 'standard'].includes(themeParam)) {
      return themeParam;
    }
    return blogPostViewMode;
  }, [searchParams, blogPostViewMode]);

  if (effectiveViewMode === 'dossier') {
    return <DossierBlogPostPage />;
  }

  if (effectiveViewMode === 'terminal') {
    return <TerminalBlogPostPage />;
  }

  return <StandardBlogPostPage />;
};

export default BlogPostPage;