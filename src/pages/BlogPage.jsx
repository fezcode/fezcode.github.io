import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistBlogPage from './blog-views/BrutalistBlogPage';
import LuxeBlogPage from './luxe-views/LuxeBlogPage';
import TerracottaBlogPage from './blog-views/TerracottaBlogPage';

const BlogPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeBlogPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaBlogPage />;
  return <BrutalistBlogPage />;
};

export default BlogPage;
