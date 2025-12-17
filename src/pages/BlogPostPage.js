import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './DossierBlogPostPage';
import StandardBlogPostPage from './StandardBlogPostPage';

const BlogPostPage = () => {
  const { isDossierMode } = useVisualSettings();

  if (isDossierMode) {
    return <DossierBlogPostPage />;
  }

  return <StandardBlogPostPage />;
};

export default BlogPostPage;