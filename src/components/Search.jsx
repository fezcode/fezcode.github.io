import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSearch from './BrutalistSearch';
import LuxeSearch from './LuxeSearch';

const Search = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeSearch {...props} />;
  }

  return <BrutalistSearch {...props} />;
};

export default Search;