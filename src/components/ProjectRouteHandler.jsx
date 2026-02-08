import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import { useVisualSettings } from '../context/VisualSettingsContext';
import Loading from './Loading';

const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const StylishProjectDetailsPage = lazy(
  () => import('../pages/project-pages/StylishProjectDetailsPage'),
);
const EditorialProjectDetailsPage = lazy(
  () => import('../pages/project-pages/EditorialProjectDetailsPage'),
);
const MinimalModernProjectPage = lazy(
  () => import('../pages/project-pages/MinimalModernProjectPage'),
);
const MuseumProjectPage = lazy(() => import('../pages/project-pages/MuseumProjectPage'));
const LuxeProjectDetailPage = lazy(
  () => import('../pages/luxe-views/LuxeProjectDetailPage'),
);
const BentoProjectPage = lazy(() => import('../pages/project-pages/BentoProjectPage'));

const ProjectRouteHandler = () => {
  const { slug } = useParams();
  const { projects, loading } = useProjects();
  const { fezcodexTheme } = useVisualSettings();

  if (loading) return <Loading />;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <Suspense fallback={<Loading />}>
        <ProjectPage />
      </Suspense>
    );
  }

  // Handle different project styles first
  const projectStyle = project.style || 'default';

  if (projectStyle === 'stylish') {
    return (
      <Suspense fallback={<Loading />}>
        <StylishProjectDetailsPage />
      </Suspense>
    );
  }

  if (projectStyle === 'editorial') {
    return (
      <Suspense fallback={<Loading />}>
        <EditorialProjectDetailsPage />
      </Suspense>
    );
  }

  if (projectStyle === 'minimal-modern') {
    return (
      <Suspense fallback={<Loading />}>
        <MinimalModernProjectPage />
      </Suspense>
    );
  }

  if (projectStyle === 'museum') {
    return (
      <Suspense fallback={<Loading />}>
        <MuseumProjectPage />
      </Suspense>
    );
  }

  if (projectStyle === 'bento') {
    return (
      <Suspense fallback={<Loading />}>
        <BentoProjectPage />
      </Suspense>
    );
  }

  // Fallback to theme based routing if style is default
  if (fezcodexTheme === 'luxe') {
    return (
      <Suspense fallback={<Loading />}>
        <LuxeProjectDetailPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <ProjectPage />
    </Suspense>
  );
};

export default ProjectRouteHandler;
