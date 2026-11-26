import React from 'react';
import StudioLogsPage from './studio-views/StudioLogsPage';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogsPage from './brutalist-views/BrutalistLogsPage';
import LuxeLogsPage from './luxe-views/LuxeLogsPage';
import TerracottaLogsPage from './terracotta-views/TerracottaLogsPage';
import MistLogsPage from './mist-views/MistLogsPage';
import LedgerLogsPage from './ledger-views/LedgerLogsPage';
import OrbitLogsPage from './orbit-views/OrbitLogsPage';
import KnitLogsPage from './knit-views/KnitLogsPage';
import KilimLogsPage from './kilim-views/KilimLogsPage';
import BlissLogsPage from './bliss-views/BlissLogsPage';
import LogViewSwitch from '../components/LogViewSwitch';

const CLASSIC_VIEWS = {
  studio: StudioLogsPage,
  luxe: LuxeLogsPage,
  terracotta: TerracottaLogsPage,
  mist: MistLogsPage,
  ledger: LedgerLogsPage,
  orbit: OrbitLogsPage,
  knit: KnitLogsPage,
  kilim: KilimLogsPage,
  bliss: BlissLogsPage,
};

const LogsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  const ClassicView = CLASSIC_VIEWS[fezcodexTheme] || BrutalistLogsPage;
  return (
    <div className="logs-view-page" data-theme={fezcodexTheme}>
      <div className="logs-view-controls">
        <LogViewSwitch view="classic" />
      </div>
      <ClassicView />
    </div>
  );
};

export default LogsPage;
