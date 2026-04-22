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
import TerracottaBlogPostPage from './blog-views/TerracottaBlogPostPage';
import GalleyBlogPostPage from './blog-views/GalleyBlogPostPage';

const BlogPostPage = () => {
  const { blogPostViewMode, fezcodexTheme } = useVisualSettings();
  const [searchParams] = useSearchParams();

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
        'terracotta',
        'galley',
      ].includes(themeParam)
    ) {
      return themeParam;
    }

    if (blogPostViewMode !== 'standard') {
      return blogPostViewMode;
    }

    if (fezcodexTheme === 'luxe') return 'luxe';
    if (fezcodexTheme === 'terracotta') return 'terracotta';

    return 'brutalist';
  })();

  if (effectiveViewMode === 'luxe') return <LuxeBlogPostPage />;
  if (effectiveViewMode === 'terracotta') return <TerracottaBlogPostPage />;
  if (effectiveViewMode === 'galley') return <GalleyBlogPostPage />;
  if (effectiveViewMode === 'old') return <OldBlogPostPage />;
  if (effectiveViewMode === 'dossier') return <DossierBlogPostPage />;
  if (effectiveViewMode === 'dokument') return <DokumentBlogPostPage />;
  if (effectiveViewMode === 'editorial') return <EditorialBlogPostPage />;
  if (effectiveViewMode === 'terminal-green') return <TerminalGreenBlogPostPage />;
  if (effectiveViewMode === 'terminal') return <TerminalBlogPostPage />;

  return <BrutalistBlogPostPage />;
};

export default BlogPostPage;
