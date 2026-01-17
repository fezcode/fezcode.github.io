import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import Loading from './Loading';

const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const StylishProjectDetailsPage = lazy(() => import('../pages/StylishProjectDetailsPage'));
const EditorialProjectDetailsPage = lazy(() => import('../pages/EditorialProjectDetailsPage'));
const MinimalModernProjectPage = lazy(() => import('../pages/MinimalModernProjectPage'));
const MuseumProjectPage = lazy(() => import('../pages/MuseumProjectPage'));

const ProjectRouteHandler = () => {
  const { slug } = useParams();
  const { projects, loading } = useProjects();

  if (loading) return <Loading />;

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <Suspense fallback={<Loading />}><ProjectPage /></Suspense>;
  }

  // Handle different project styles
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

  return (
    <Suspense fallback={<Loading />}>
      <ProjectPage />
    </Suspense>
  );
};

export default ProjectRouteHandler;
