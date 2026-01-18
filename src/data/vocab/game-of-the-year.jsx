import React from 'react';

const WINNERS = [
  { year: '2025', game: 'Clair Obscur: Expedition 33' },
  { year: '2024', game: 'Astro Bot' },
  { year: '2023', game: "Baldur's Gate 3" },
  { year: '2022', game: 'Elden Ring' },
  { year: '2021', game: 'It Takes Two' },
  { year: '2020', game: 'The Last of Us Part II' },
  { year: '2019', game: 'Sekiro: Shadows Die Twice' },
  { year: '2018', game: 'God of War' },
  { year: '2017', game: 'The Legend of Zelda: Breath of the Wild' },
  { year: '2016', game: 'Overwatch' },
  { year: '2015', game: 'The Witcher 3: Wild Hunt' },
  { year: '2014', game: 'Dragon Age: Inquisition' },
  { year: '2013', game: 'Grand Theft Auto V' },
  { year: '2012', game: 'The Walking Dead' },
  { year: '2011', game: 'The Elder Scrolls V: Skyrim' },
  { year: '2010', game: 'Red Dead Redemption' },
  { year: '2009', game: 'Uncharted 2: Among Thieves' },
  { year: '2008', game: 'Grand Theft Auto IV' },
  { year: '2007', game: 'BioShock' },
  { year: '2006', game: 'The Elder Scrolls IV: Oblivion' },
  { year: '2005', game: 'Resident Evil 4' },
  { year: '2004', game: 'Grand Theft Auto: San Andreas' },
  { year: '2003', game: 'Madden NFL 2004' },
];

export default function GameOfTheYear() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-white">Game of the Year (GOTY)</strong> is an award given by various
        gaming publications, websites, and events to a video game that is
        considered the best or most outstanding of a particular year.
      </p>
      <p>
        These awards recognize excellence in areas such as design, narrative,
        gameplay innovation, artistic direction, and overall impact on the
        gaming industry and culture. Winning GOTY is a prestigious honor often
        associated with critical acclaim and significant commercial success.
      </p>

      <div className="mt-8">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
          Notable Winners (TGA & VGA)
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {WINNERS.map((winner) => (
            <div key={winner.year} className="flex gap-4 text-xs group">
              <span className="text-emerald-500 font-bold min-w-[40px]">{winner.year}</span>
              <span className="text-gray-400 group-hover:text-white transition-colors">{winner.game}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
