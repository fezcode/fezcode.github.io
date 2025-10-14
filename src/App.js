import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;