import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistProjectsPage from './brutalist-views/BrutalistProjectsPage';
import LuxeProjectsPage from './luxe-views/LuxeProjectsPage';
import TerracottaProjectsPage from './terracotta-views/TerracottaProjectsPage';
import MistProjectsPage from './mist-views/MistProjectsPage';
import LedgerProjectsPage from './ledger-views/LedgerProjectsPage';
import OrbitProjectsPage from './orbit-views/OrbitProjectsPage';

const ProjectsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeProjectsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaProjectsPage />;
  if (fezcodexTheme === 'mist') return <MistProjectsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerProjectsPage />;
  if (fezcodexTheme === 'orbit') return <OrbitProjectsPage />;
  return <BrutalistProjectsPage />;
};

export default ProjectsPage;
