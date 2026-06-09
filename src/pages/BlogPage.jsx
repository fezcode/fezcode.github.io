import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistBlogPage from './blog-views/BrutalistBlogPage';
import LuxeBlogPage from './luxe-views/LuxeBlogPage';
import TerracottaBlogPage from './blog-views/TerracottaBlogPage';
import MistBlogPage from './blog-views/MistBlogPage';

const BlogPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeBlogPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaBlogPage />;
  if (fezcodexTheme === 'mist') return <MistBlogPage />;
  return <BrutalistBlogPage />;
};

export default BlogPage;
