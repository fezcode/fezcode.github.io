import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistProjectsPage from './brutalist-views/BrutalistProjectsPage';
import LuxeProjectsPage from './luxe-views/LuxeProjectsPage';

const ProjectsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeProjectsPage />;
  }

  return <BrutalistProjectsPage />;
};

export default ProjectsPage;
