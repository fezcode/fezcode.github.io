import React from 'react';
import StudioBlogPage from './studio-views/StudioBlogPage';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistBlogPage from './blog-views/BrutalistBlogPage';
import LuxeBlogPage from './luxe-views/LuxeBlogPage';
import TerracottaBlogPage from './blog-views/TerracottaBlogPage';
import MistBlogPage from './blog-views/MistBlogPage';
import LedgerBlogPage from './blog-views/LedgerBlogPage';
import OrbitBlogPage from './blog-views/OrbitBlogPage';
import KnitBlogPage from './blog-views/KnitBlogPage';
import KilimBlogPage from './blog-views/KilimBlogPage';
import BlissBlogPage from './blog-views/BlissBlogPage';

const BlogPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'studio') return <StudioBlogPage />;
  if (fezcodexTheme === 'luxe') return <LuxeBlogPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaBlogPage />;
  if (fezcodexTheme === 'mist') return <MistBlogPage />;
  if (fezcodexTheme === 'ledger') return <LedgerBlogPage />;
  if (fezcodexTheme === 'orbit') return <OrbitBlogPage />;
  if (fezcodexTheme === 'knit') return <KnitBlogPage />;
  if (fezcodexTheme === 'kilim') return <KilimBlogPage />;
  if (fezcodexTheme === 'bliss') return <BlissBlogPage />;
  return <BrutalistBlogPage />;
};

export default BlogPage;
