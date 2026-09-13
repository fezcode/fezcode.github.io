import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogPostPage from './BlogPostPage';

const preference = vi.hoisted(() => ({
  fezcodexTheme: 'orbit',
  blogPostViewMode: 'standard',
}));
vi.mock('../context/VisualSettingsContext', () => ({
  useVisualSettings: () => preference,
}));
vi.mock('./blog-views/OrbitBlogPostPage', () => ({
  default: () => <p>Orbit reader</p>,
}));
vi.mock('./blog-views/EditorialBlogPostPage', () => ({
  default: () => <p>Editorial reader</p>,
}));
vi.mock('./blog-views/GalleyBlogPostPage', () => ({
  default: () => <p>Galley reader</p>,
}));

describe('Orbit reader selection', () => {
  afterEach(cleanup);
  it('uses Orbit when the reader follows the site theme', () => {
    preference.blogPostViewMode = 'standard';
    render(
      <MemoryRouter>
        <BlogPostPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Orbit reader')).toBeInTheDocument();
  });
  it('preserves an explicitly selected reader', () => {
    preference.blogPostViewMode = 'editorial';
    render(
      <MemoryRouter>
        <BlogPostPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Editorial reader')).toBeInTheDocument();
  });
  it('gives a reader URL override precedence over the saved choice', () => {
    preference.blogPostViewMode = 'galley';
    render(
      <MemoryRouter initialEntries={['/blog/penneys-game?theme=orbit']}>
        <BlogPostPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Orbit reader')).toBeInTheDocument();
  });
});
