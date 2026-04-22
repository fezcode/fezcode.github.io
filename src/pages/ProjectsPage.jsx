import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistProjectsPage from './brutalist-views/BrutalistProjectsPage';
import LuxeProjectsPage from './luxe-views/LuxeProjectsPage';
import TerracottaProjectsPage from './terracotta-views/TerracottaProjectsPage';

const ProjectsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeProjectsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaProjectsPage />;
  return <BrutalistProjectsPage />;
};

export default ProjectsPage;
