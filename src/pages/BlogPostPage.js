import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './DossierBlogPostPage';
import StandardBlogPostPage from './StandardBlogPostPage';

const BlogPostPage = () => {
  const { blogPostViewMode } = useVisualSettings();

  if (blogPostViewMode === 'dossier') {
    return <DossierBlogPostPage />;
  }

  return <StandardBlogPostPage />;
};

export default BlogPostPage;