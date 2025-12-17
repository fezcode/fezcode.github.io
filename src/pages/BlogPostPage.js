import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DossierBlogPostPage from './DossierBlogPostPage';
import StandardBlogPostPage from './StandardBlogPostPage';
import TerminalBlogPostPage from './TerminalBlogPostPage'; // Added import

const BlogPostPage = () => {
  const { blogPostViewMode } = useVisualSettings();

  if (blogPostViewMode === 'dossier') {
    return <DossierBlogPostPage />;
  }

  if (blogPostViewMode === 'terminal') { // Added conditional render
    return <TerminalBlogPostPage />;
  }

  return <StandardBlogPostPage />;
};

export default BlogPostPage;