import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  DiceFiveIcon,
  ShuffleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import { random } from './fantasy-map-generator/noise';
import {
  NAMING,
  WORLD_PRESETS,
  STYLES,
  NAMING_OPTIONS,
} from './fantasy-map-generator/data';
import {
  Slider,
  Toggle,
  Select,
  Tab,
  DISPLAY,
  SANS,
  MONO,
} from './fantasy-map-generator/components';
import { generateMap } from './fantasy-map-generator/generateMap';

const TABS = [
  { id: 'realm', num: '01', label: 'Realm' },
  { id: 'land',  num: '02', label: 'Land' },
  { id: 'wilds', num: '03', label: 'Wilds' },
  { id: 'cities', num: '04', label: 'Cities' },
  { id: 'sea',   num: '05', label: 'Sea' },
  { id: 'rule',  num: '06', label: 'Rule' },
  { id: 'paper', num: '07', label: 'Paper' },
];

const FantasyMapGeneratorPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const [rendering, setRendering] = useState(false);
  const [activeTab, setActiveTab] = useState('realm');

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [nameSeed, setNameSeed] = useState(() => Math.floor(Math.random() * 1e9));

  // World identity
  const [preset, setPreset] = useState('continent');
  const [style, setStyle] = useState('riso');
  const [naming, setNaming] = useState('westron');

  // Topography
  const [waterLevel, setWaterLevel] = useState(0.40);
  const [mountains, setMountains] = useState(0.7);
  const [hills, setHills] = useState(0.4);
  const [climate, setClimate] = useState(0.55);
  const [roughness, setRoughness] = useState(0.55);

  // Biomes & wilds
  const [forestDensity, setForestDensity] = useState(0.55);
  const [swampiness, setSwampiness] = useState(0.5);
  const [stoneCount, setStoneCount] = useState(3);
  const [volcanoCount, setVolcanoCount] = useState(0);

  // Settlements
  const [cityCount, setCityCount] = useState(10);
  const [castleCount, setCastleCount] = useState(5);
  const [villageCount, setVillageCount] = useState(8);
  const [capitalCount, setCapitalCount] = useState(2);

  // Landmarks
  const [ruinCount, setRuinCount] = useState(4);
  const [towerCount, setTowerCount] = useState(2);
  const [monasteryCount, setMonasteryCount] = useState(2);
  const [lighthouseCount, setLighthouseCount] = useState(2);

  // Sea
  const [shipCount, setShipCount] = useState(3);
  const [krakenCount, setKrakenCount] = useState(1);
  const [wreckCount, setWreckCount] = useState(2);
  const [seaMonsters, setSeaMonsters] = useState(2);
  const [lakeCount, setLakeCount] = useState(4);
  const [riverCount, setRiverCount] = useState(15);

  // Politics
  const [realmCount, setRealmCount] = useState(4);
  const [showBorders, setShowBorders] = useState(true);
  const [shadeRealms, setShadeRealms] = useState(true);
  const [showRoads, setShowRoads] = useState(true);

  // Ornament
  const [showCompass, setShowCompass] = useState(true);
  const [showCartouche, setShowCartouche] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const palette = STYLES[style];
  const theme = palette.ui;
  const presetCfg = WORLD_PRESETS[preset];
  const bank = NAMING[naming];

  const worldTitle = useMemo(() => {
    const realm = bank.realm[Math.floor(random(nameSeed) * bank.realm.length)];
    const honor = ['Atlas of', 'Map of', 'Chart of', 'Codex of', 'Charta', 'Mappa', 'Cosmographia of'];
    const h = honor[Math.floor(random(nameSeed + 1) * honor.length)];
    return `${h} ${realm}`;
  }, [nameSeed, bank]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 2400;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');
    generateMap(ctx, canvas.width, canvas.height, {
      seed, nameSeed, showLabels, palette, presetCfg, bank, worldTitle,
      waterLevel, mountains, hills, climate, roughness,
      forestDensity, swampiness,
      cityCount, castleCount, villageCount, capitalCount,
      ruinCount, towerCount, monasteryCount, stoneCount, volcanoCount, lighthouseCount,
      shipCount, krakenCount, wreckCount, seaMonsters, lakeCount, riverCount,
      realmCount, showBorders, shadeRealms, showRoads,
      showCompass, showCartouche, showLegend, showScale, showGrid,
    });
  }, [
    seed, nameSeed, showLabels, palette, presetCfg, bank, worldTitle,
    waterLevel, mountains, hills, climate, roughness,
    forestDensity, swampiness,
    cityCount, castleCount, villageCount, capitalCount,
    ruinCount, towerCount, monasteryCount, stoneCount, volcanoCount, lighthouseCount,
    shipCount, krakenCount, wreckCount, seaMonsters, lakeCount, riverCount,
    realmCount, showBorders, shadeRealms, showRoads,
    showCompass, showCartouche, showLegend, showScale, showGrid,
  ]);

  useEffect(() => {
    setRendering(true);
    const id = requestAnimationFrame(() => {
      draw();
      setRendering(false);
    });
    return () => cancelAnimationFrame(id);
  }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${worldTitle.replace(/\s+/g, '_')}_${seed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast({
      title: 'Folio Pressed',
      message: 'The map has been added to your archives.',
      duration: 2500,
    });
  };

  const presetOptions = useMemo(
    () => Object.entries(WORLD_PRESETS).map(([k, v]) => ({ value: k, label: v.label })),
    [],
  );
  const styleOptions = useMemo(
    () => Object.entries(STYLES).map(([k, v]) => ({ value: k, label: v.label })),
    [],
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: theme.bg,
        color: theme.ink,
        fontFamily: SANS,
        transition: 'background 250ms ease, color 250ms ease',
      }}
    >
      <Seo
        title="Cartographia | Fezcodex"
        description="A risograph cartographer's atelier. Generate fantasy maps — continents, archipelagos, Middle-earth, deserts, frozen wastes — with realms, ruins, krakens and more."
        keywords={['fantasy', 'map', 'generator', 'middle-earth', 'kraken', 'realm', 'cartography', 'risograph']}
      />

      {/* paper-grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-multiply z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-[1500px] w-full mx-auto px-5 lg:px-8 py-5 flex flex-col flex-grow">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/apps"
            className="group inline-flex items-center gap-2 text-[12px] tracking-wide"
            style={{ color: theme.muted, fontFamily: SANS }}
          >
            <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" />
            <span className="uppercase">Library</span>
          </Link>
          <div
            className="text-[10px] tabular-nums tracking-[0.3em] uppercase"
            style={{ fontFamily: MONO, color: theme.muted }}
          >
            <span style={{ color: theme.spot }}>●</span>{' '}
            issue №{String(seed).slice(-4)} · folio {Math.floor(random(seed) * 240) + 1}/240
          </div>
        </div>

        {/* Editorial masthead */}
        <header className="relative mb-6">
          <div
            className="absolute left-0 right-0 top-0 h-[2px]"
            style={{ background: theme.ink }}
          />
          <div className="pt-5 grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-9 min-w-0">
              <div
                className="text-[10px] tracking-[0.5em] uppercase mb-2"
                style={{ fontFamily: MONO, color: theme.spot }}
              >
                ✦ The Cartographia · A Field Atlas of Imagined Lands ✦
              </div>
              <h1
                className="leading-[0.88] tracking-tight"
                style={{
                  fontFamily: DISPLAY,
                  color: theme.ink,
                  fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                  fontStyle: 'italic',
                }}
              >
                {worldTitle}
              </h1>
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  setSeed(Math.floor(Math.random() * 1e9));
                  setNameSeed(Math.floor(Math.random() * 1e9));
                }}
                className="group flex items-center gap-2 px-4 py-2.5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{
                  background: theme.spot,
                  color: theme.spotInk,
                  border: `1.5px solid ${theme.ink}`,
                  fontFamily: SANS,
                  boxShadow: `4px 4px 0 ${theme.ink}`,
                }}
              >
                <ShuffleIcon size={14} weight="bold" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                  New World
                </span>
              </button>
              <button
                onClick={() => setNameSeed(Math.floor(Math.random() * 1e9))}
                className="group flex items-center gap-2 px-4 py-2 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{
                  background: theme.surface,
                  color: theme.ink,
                  border: `1.5px solid ${theme.ink}`,
                  fontFamily: SANS,
                  boxShadow: `2px 2px 0 ${theme.spot}`,
                }}
                title="Re-roll all place names without changing the map"
              >
                <DiceFiveIcon size={13} weight="bold" />
                <span className="text-[11px] uppercase tracking-[0.2em]">
                  Rename
                </span>
              </button>
              <button
                onClick={handleDownload}
                className="group flex items-center gap-2 px-4 py-2 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{
                  background: theme.surface,
                  color: theme.ink,
                  border: `1.5px solid ${theme.ink}`,
                  fontFamily: SANS,
                  boxShadow: `2px 2px 0 ${theme.ink}`,
                }}
              >
                <DownloadSimpleIcon size={13} />
                <span className="text-[11px] uppercase tracking-[0.2em]">
                  Press a Print
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Map — full width */}
        <div className="relative">
          <div
            className="relative overflow-hidden"
            style={{
              background: palette.paper,
              border: `2px solid ${theme.ink}`,
              boxShadow: `10px 10px 0 ${theme.spot}, 0 24px 60px ${theme.ink}25`,
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
              style={{ aspectRatio: '8/5', maxHeight: '72vh' }}
            />
            {rendering && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ background: theme.bg + 'AA' }}
              >
                <div
                  className="text-[10px] tracking-[0.4em] uppercase animate-pulse"
                  style={{ fontFamily: MONO, color: theme.spot }}
                >
                  Pressing the Plate…
                </div>
              </div>
            )}
          </div>
          <div
            className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-[0.25em] uppercase"
            style={{ fontFamily: MONO, color: theme.muted }}
          >
            <span>
              Fig.{String(seed).slice(-2)} — {presetCfg.label} ·{' '}
              <span style={{ color: theme.ink }}>{palette.label}</span> printing
            </span>
            <span>folio №{seed}</span>
          </div>
        </div>

        {/* Controls — horizontal strip beneath the map */}
        <section className="mt-5">
          {/* Tab strip */}
          <div
            className="relative overflow-x-auto custom-scroll"
            style={{ borderBottom: `1.5px solid ${theme.ink}` }}
          >
            <div className="flex items-baseline gap-1 min-w-max">
              {TABS.map((t) => (
                <Tab
                  key={t.id}
                  active={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  num={t.num}
                  label={t.label}
                  theme={theme}
                />
              ))}
            </div>
          </div>

          {/* Tab body — horizontal grid */}
          <div
            className="px-5 py-4 grid gap-x-6 gap-y-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-start"
            style={{
              background: theme.surface,
              border: `1.5px solid ${theme.ink}`,
              borderTop: 'none',
            }}
          >
            <div className="col-span-2 sm:col-span-3 md:col-span-1 lg:col-span-1">
              <SectionTitle theme={theme} num={TABS.find(t => t.id === activeTab).num}>
                {{
                  realm: 'The Realm',
                  land: 'Land',
                  wilds: 'Wilds',
                  cities: 'Cities',
                  sea: 'Sea',
                  rule: 'Rule',
                  paper: 'Paper',
                }[activeTab]}
              </SectionTitle>
            </div>

            {activeTab === 'realm' && (
              <>
                <Select theme={theme} label="World Type" value={preset} options={presetOptions} onChange={setPreset} />
                <Select theme={theme} label="Style" value={style} options={styleOptions} onChange={setStyle} />
                <Select theme={theme} label="Naming" value={naming} options={NAMING_OPTIONS} onChange={setNaming} />
                <div className="col-span-2 sm:col-span-3 md:col-span-1 lg:col-span-2">
                  <PaletteStrip theme={theme} palette={palette} />
                </div>
              </>
            )}

            {activeTab === 'land' && (
              <>
                <Slider theme={theme} label="Sea Level" value={waterLevel} min={0.15} max={0.7} step={0.01} onChange={setWaterLevel} />
                <Slider theme={theme} label="Mountains" value={mountains} min={0} max={1.5} step={0.05} onChange={setMountains} />
                <Slider theme={theme} label="Hills" value={hills} min={0} max={1} step={0.05} onChange={setHills} />
                <Slider theme={theme} label="Roughness" value={roughness} min={0} max={1} step={0.05} onChange={setRoughness} />
                <Slider theme={theme} label="Climate" value={climate} min={0.1} max={1.0} step={0.05} onChange={setClimate} />
                <Slider theme={theme} label="Rivers" value={riverCount} min={0} max={30} step={1} onChange={setRiverCount} />
                <Slider theme={theme} label="Lakes" value={lakeCount} min={0} max={15} step={1} onChange={setLakeCount} />
              </>
            )}

            {activeTab === 'wilds' && (
              <>
                <Slider theme={theme} label="Forests" value={forestDensity} min={0} max={1} step={0.05} onChange={setForestDensity} />
                <Slider theme={theme} label="Swampiness" value={swampiness} min={0} max={1} step={0.05} onChange={setSwampiness} />
                <Slider theme={theme} label="Volcanoes" value={volcanoCount} min={0} max={6} step={1} onChange={setVolcanoCount} />
                <Slider theme={theme} label="Standing Stones" value={stoneCount} min={0} max={8} step={1} onChange={setStoneCount} />
                <Slider theme={theme} label="Ruins" value={ruinCount} min={0} max={10} step={1} onChange={setRuinCount} />
                <Slider theme={theme} label="Wizard Towers" value={towerCount} min={0} max={6} step={1} onChange={setTowerCount} />
                <Slider theme={theme} label="Monasteries" value={monasteryCount} min={0} max={6} step={1} onChange={setMonasteryCount} />
              </>
            )}

            {activeTab === 'cities' && (
              <>
                <Slider theme={theme} label="Capitals" value={capitalCount} min={0} max={6} step={1} onChange={setCapitalCount} />
                <Slider theme={theme} label="Cities" value={cityCount} min={0} max={30} step={1} onChange={setCityCount} />
                <Slider theme={theme} label="Villages" value={villageCount} min={0} max={20} step={1} onChange={setVillageCount} />
                <Slider theme={theme} label="Castles" value={castleCount} min={0} max={12} step={1} onChange={setCastleCount} />
                <Slider theme={theme} label="Lighthouses" value={lighthouseCount} min={0} max={6} step={1} onChange={setLighthouseCount} />
              </>
            )}

            {activeTab === 'sea' && (
              <>
                <Slider theme={theme} label="Ships" value={shipCount} min={0} max={10} step={1} onChange={setShipCount} />
                <Slider theme={theme} label="Sea Serpents" value={seaMonsters} min={0} max={6} step={1} onChange={setSeaMonsters} />
                <Slider theme={theme} label="Krakens" value={krakenCount} min={0} max={4} step={1} onChange={setKrakenCount} />
                <Slider theme={theme} label="Shipwrecks" value={wreckCount} min={0} max={6} step={1} onChange={setWreckCount} />
              </>
            )}

            {activeTab === 'rule' && (
              <>
                <Slider theme={theme} label="Realms" value={realmCount} min={0} max={6} step={1} onChange={setRealmCount} />
                <Toggle theme={theme} label="Shade realms" value={shadeRealms} onChange={setShadeRealms} />
                <Toggle theme={theme} label="Show borders" value={showBorders} onChange={setShowBorders} />
                <Toggle theme={theme} label="Trade roads" value={showRoads} onChange={setShowRoads} />
              </>
            )}

            {activeTab === 'paper' && (
              <>
                <Toggle theme={theme} label="Place names" value={showLabels} onChange={setShowLabels} />
                <Toggle theme={theme} label="Compass rose" value={showCompass} onChange={setShowCompass} />
                <Toggle theme={theme} label="Cartouche" value={showCartouche} onChange={setShowCartouche} />
                <Toggle theme={theme} label="Legend" value={showLegend} onChange={setShowLegend} />
                <Toggle theme={theme} label="Scale bar" value={showScale} onChange={setShowScale} />
                <Toggle theme={theme} label="Latitude grid" value={showGrid} onChange={setShowGrid} />
              </>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${theme.muted}80;
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: ${theme.spot}; }
        select option { background: ${theme.surface}; color: ${theme.ink}; }
      `}</style>
    </div>
  );
};

const SectionTitle = ({ theme, num, hint, children }) => (
  <div className="mb-1">
    <div className="flex items-baseline gap-3">
      <span
        className="text-[10px] tabular-nums tracking-[0.3em]"
        style={{ fontFamily: MONO, color: theme.spot }}
      >
        №{num}
      </span>
      <h2
        className="leading-none"
        style={{
          fontFamily: DISPLAY,
          fontStyle: 'italic',
          fontSize: '1.65rem',
          color: theme.ink,
        }}
      >
        {children}
      </h2>
    </div>
    {hint && (
      <p
        className="mt-1 text-[11px] italic"
        style={{ fontFamily: SANS, color: theme.muted }}
      >
        {hint}
      </p>
    )}
    <div
      className="mt-3 h-px w-full"
      style={{ background: theme.ink + '20' }}
    />
  </div>
);

const PaletteStrip = ({ theme, palette }) => (
  <div className="mt-2">
    <div
      className="text-[10px] tracking-[0.18em] uppercase mb-1.5"
      style={{ fontFamily: SANS, color: theme.muted }}
    >
      Inks on the Press
    </div>
    <div className="flex h-7 w-full" style={{ border: `1.5px solid ${theme.ink}` }}>
      {[
        palette.paper,
        palette.water,
        palette.waterDeep,
        palette.forest,
        palette.desert,
        palette.realmInk,
        palette.ink,
      ].map((c, i) => (
        <div key={i} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  </div>
);

export default FantasyMapGeneratorPage;
