import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useTagView } from './useTagData';
import ClassicTagView from './ClassicTagView';

// Each theme renders /tags/:tag in its own language from the same view model.
const VIEWS = {
  brutalist: lazy(() => import('../brutalist-views/BrutalistTagPage')),
  luxe: lazy(() => import('../luxe-views/LuxeTagPage')),
  terracotta: lazy(() => import('../terracotta-views/TerracottaTagPage')),
  mist: lazy(() => import('../mist-views/MistTagPage')),
  ledger: lazy(() => import('../ledger-views/LedgerTagPage')),
  orbit: lazy(() => import('../orbit-views/OrbitTagPage')),
  knit: lazy(() => import('../knit-views/KnitTagPage')),
  bliss: lazy(() => import('../bliss-views/BlissTagPage')),
};

export default function TagPage() {
  const { fezcodexTheme } = useVisualSettings();
  const view = useTagView();
  if (view.status === 'redirect')
    return <Navigate to={view.redirectTo} replace />;
  const View = VIEWS[fezcodexTheme] || VIEWS.brutalist;
  return (
    <Suspense fallback={<ClassicTagView view={view} />}>
      <View view={view} />
    </Suspense>
  );
}
