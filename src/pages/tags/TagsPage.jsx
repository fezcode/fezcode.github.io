import React, { Suspense, lazy } from 'react';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useTagsIndexView } from './useTagData';
import ClassicTagsView from './ClassicTagsView';

// Each theme renders /tags in its own language from the same view model.
const VIEWS = {
  brutalist: lazy(() => import('../brutalist-views/BrutalistTagsPage')),
  luxe: lazy(() => import('../luxe-views/LuxeTagsPage')),
  terracotta: lazy(() => import('../terracotta-views/TerracottaTagsPage')),
  mist: lazy(() => import('../mist-views/MistTagsPage')),
  ledger: lazy(() => import('../ledger-views/LedgerTagsPage')),
  orbit: lazy(() => import('../orbit-views/OrbitTagsPage')),
  knit: lazy(() => import('../knit-views/KnitTagsPage')),
  bliss: lazy(() => import('../bliss-views/BlissTagsPage')),
};

export default function TagsPage() {
  const { fezcodexTheme } = useVisualSettings();
  const view = useTagsIndexView();
  const View = VIEWS[fezcodexTheme] || VIEWS.brutalist;
  return (
    <Suspense fallback={<ClassicTagsView view={view} />}>
      <View view={view} />
    </Suspense>
  );
}
