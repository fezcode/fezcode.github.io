import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSearch from './BrutalistSearch';
import LuxeSearch from './LuxeSearch';
import TerracottaSearch from './TerracottaSearch';

const Search = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSearch {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSearch {...props} />;
  return <BrutalistSearch {...props} />;
};

export default Search;
