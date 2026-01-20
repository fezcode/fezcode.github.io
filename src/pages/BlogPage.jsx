import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistBlogPage from './blog-views/BrutalistBlogPage';
import LuxeBlogPage from './luxe-views/LuxeBlogPage';

const BlogPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeBlogPage />;
  }

  return <BrutalistBlogPage />;
};

export default BlogPage;