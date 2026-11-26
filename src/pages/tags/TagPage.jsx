import React from 'react';
import StudioTagPage from '../studio-views/StudioTagPage';
import { Navigate } from 'react-router-dom';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useTagView } from './useTagData';
import BrutalistTagPage from '../brutalist-views/BrutalistTagPage';
import LuxeTagPage from '../luxe-views/LuxeTagPage';
import TerracottaTagPage from '../terracotta-views/TerracottaTagPage';
import MistTagPage from '../mist-views/MistTagPage';
import LedgerTagPage from '../ledger-views/LedgerTagPage';
import OrbitTagPage from '../orbit-views/OrbitTagPage';
import KnitTagPage from '../knit-views/KnitTagPage';
import KilimTagPage from '../kilim-views/KilimTagPage';
import BlissTagPage from '../bliss-views/BlissTagPage';

// Each theme renders /tags/:tag in its own language from the same view model.
// Imported directly, not lazily, so the themed page is the first paint.
const VIEWS = {
  brutalist: BrutalistTagPage,
  luxe: LuxeTagPage,
  terracotta: TerracottaTagPage,
  mist: MistTagPage,
  ledger: LedgerTagPage,
  studio: StudioTagPage,
  orbit: OrbitTagPage,
  knit: KnitTagPage,
  kilim: KilimTagPage,
  bliss: BlissTagPage,
};

export default function TagPage() {
  const { fezcodexTheme } = useVisualSettings();
  const view = useTagView();
  if (view.status === 'redirect')
    return <Navigate to={view.redirectTo} replace />;
  const View = VIEWS[fezcodexTheme] || VIEWS.brutalist;
  return <View view={view} />;
}
