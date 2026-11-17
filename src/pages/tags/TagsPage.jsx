import React from 'react';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useTagsIndexView } from './useTagData';
import BrutalistTagsPage from '../brutalist-views/BrutalistTagsPage';
import LuxeTagsPage from '../luxe-views/LuxeTagsPage';
import TerracottaTagsPage from '../terracotta-views/TerracottaTagsPage';
import MistTagsPage from '../mist-views/MistTagsPage';
import LedgerTagsPage from '../ledger-views/LedgerTagsPage';
import OrbitTagsPage from '../orbit-views/OrbitTagsPage';
import KnitTagsPage from '../knit-views/KnitTagsPage';
import KilimTagsPage from '../kilim-views/KilimTagsPage';
import BlissTagsPage from '../bliss-views/BlissTagsPage';

// Each theme renders /tags in its own language from the same view model.
// Imported directly, not lazily, so the themed page is the first paint.
const VIEWS = {
  brutalist: BrutalistTagsPage,
  luxe: LuxeTagsPage,
  terracotta: TerracottaTagsPage,
  mist: MistTagsPage,
  ledger: LedgerTagsPage,
  orbit: OrbitTagsPage,
  knit: KnitTagsPage,
  kilim: KilimTagsPage,
  bliss: BlissTagsPage,
};

export default function TagsPage() {
  const { fezcodexTheme } = useVisualSettings();
  const view = useTagsIndexView();
  const View = VIEWS[fezcodexTheme] || VIEWS.brutalist;
  return <View view={view} />;
}
