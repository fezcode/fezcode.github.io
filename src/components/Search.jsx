import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSearch from './BrutalistSearch';
import LuxeSearch from './LuxeSearch';
import TerracottaSearch from './TerracottaSearch';
import MistSearch from './MistSearch';
import LedgerSearch from './LedgerSearch';
import OrbitSearch from './OrbitSearch';
import MarquetrySearch from './MarquetrySearch';
import KnitSearch from './KnitSearch';

const Search = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSearch {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSearch {...props} />;
  if (fezcodexTheme === 'mist') return <MistSearch {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerSearch {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitSearch {...props} />;
  if (fezcodexTheme === 'marquetry') return <MarquetrySearch {...props} />;
  if (fezcodexTheme === 'knit') return <KnitSearch {...props} />;
  return <BrutalistSearch {...props} />;
};

export default Search;
