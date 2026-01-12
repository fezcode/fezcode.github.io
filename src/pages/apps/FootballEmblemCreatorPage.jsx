import React, {useState, useRef, useContext} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrophyIcon,
  StarIcon,
  HeartIcon,
  SkullIcon,
  PawPrintIcon,
  AtomIcon,
  LightningIcon,
  SoccerBallIcon,
  CrownIcon,
  FireIcon,
  SwordIcon,
  AnchorIcon,
  DownloadSimpleIcon,
  TextAaIcon,
  AlienIcon,
  GhostIcon,
  RobotIcon,
  SmileyIcon,
  ShieldIcon,
  GameControllerIcon,
  BasketballIcon,
  BaseballIcon,
  VolleyballIcon,
  FootballIcon,
  TennisBallIcon,
  HockeyIcon,
  BirdIcon,
  CatIcon,
  DogIcon,
  FishIcon,
  BugIcon,
  TreeIcon,
  LeafIcon,
  SunIcon,
  MoonIcon,
  SnowflakeIcon,
  RocketIcon,
  BoatIcon,
  AirplaneIcon,
  CarIcon,
  BicycleIcon,
  PizzaIcon,
  HamburgerIcon,
  CoffeeIcon,
  MusicNoteIcon,
  HeadphonesIcon,
  GlobeHemisphereWestIcon,
  LightbulbIcon,
  InfinityIcon,
  BrainIcon,
  PercentIcon,
  PaletteIcon,
  GearSixIcon,
  EyeIcon,
  CornersOutIcon,
} from '@phosphor-icons/react';
import CustomDropdown from '../../components/CustomDropdown';
import Seo from '../../components/Seo';
import {ToastContext} from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const FootballEmblemCreatorPage = () => {
  const appName = 'Emblem Creator';

  const {addToast} = useContext(ToastContext);
  const svgRef = useRef(null);

  const [teamName, setTeamName] = useState('FEZ FC');
  const [foundedYear, setFoundedYear] = useState('2025');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#050505');
  const [shieldShape, setShieldShape] = useState('shield1');
  const [selectedIcon, setSelectedIcon] = useState('soccer');
  const [pattern, setPattern] = useState('stripes');
  const [fontSize, setFontSize] = useState('10');
  const foundedYearFontSize = '6';
  const [showEstPrefix, setShowEstPrefix] = useState(true);
  const [opacity, setOpacity] = useState('0.5');

  const iconMap = {
    soccer: <SoccerBallIcon weight="fill" />,
    trophy: <TrophyIcon weight="fill" />,
    star: <StarIcon weight="fill" />,
    heart: <HeartIcon weight="fill" />,
    skull: <SkullIcon weight="fill" />,
    paw: <PawPrintIcon weight="fill" />,
    atom: <AtomIcon weight="fill" />,
    lightning: <LightningIcon weight="fill" />,
    crown: <CrownIcon weight="fill" />,
    fire: <FireIcon weight="fill" />,
    sword: <SwordIcon weight="fill" />,
    anchor: <AnchorIcon weight="fill" />,
    alien: <AlienIcon weight="fill" />,
    ghost: <GhostIcon weight="fill" />,
    robot: <RobotIcon weight="fill" />,
    smiley: <SmileyIcon weight="fill" />,
    shield: <ShieldIcon weight="fill" />,
    game: <GameControllerIcon weight="fill" />,
    basketball: <BasketballIcon weight="fill" />,
    baseball: <BaseballIcon weight="fill" />,
    volleyball: <VolleyballIcon weight="fill" />,
    football: <FootballIcon weight="fill" />,
    tennis: <TennisBallIcon weight="fill" />,
    hockey: <HockeyIcon weight="fill" />,
    bird: <BirdIcon weight="fill" />,
    cat: <CatIcon weight="fill" />,
    dog: <DogIcon weight="fill" />,
    fish: <FishIcon weight="fill" />,
    bug: <BugIcon weight="fill" />,
    tree: <TreeIcon weight="fill" />,
    leaf: <LeafIcon weight="fill" />,
    sun: <SunIcon weight="fill" />,
    moon: <MoonIcon weight="fill" />,
    snowflake: <SnowflakeIcon weight="fill" />,
    rocket: <RocketIcon weight="fill" />,
    boat: <BoatIcon weight="fill" />,
    airplane: <AirplaneIcon weight="fill" />,
    car: <CarIcon weight="fill" />,
    bicycle: <BicycleIcon weight="fill" />,
    pizza: <PizzaIcon weight="fill" />,
    hamburger: <HamburgerIcon weight="fill" />,
    coffee: <CoffeeIcon weight="fill" />,
    music: <MusicNoteIcon weight="fill" />,
    headphones: <HeadphonesIcon weight="fill" />,
    globe: <GlobeHemisphereWestIcon weight="fill" />,
    lightbulb: <LightbulbIcon weight="fill" />,
    infinity: <InfinityIcon weight="fill" />,
    brain: <BrainIcon weight="fill" />,
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgSize = 1000; // High res
    canvas.width = svgSize;
    canvas.height = svgSize;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, svgSize, svgSize);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${teamName.replace(/\s+/g, '_').toLowerCase()}_emblem.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      addToast({
        message: 'EMBLEM_EXPORT_SUCCESSFUL',
        type: 'success',
      });
    };

    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const renderShield = () => {
    switch (shieldShape) {
      case 'shield1':
        return <path d="M10,10 L90,10 L90,30 C90,70 50,95 50,95 C50,95 10,70 10,30 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield2':
        return <circle cx="50" cy="50" r="45" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield3':
        return <path d="M50,5 L95,50 L50,95 L5,50 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield4':
        return <path d="M10,10 Q50,0 90,10 L90,40 Q90,80 50,95 Q10,80 10,40 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield5':
        return <path d="M15,10 L85,10 L85,70 L50,95 L15,70 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      default:
        return null;
    }
  };

  const renderPattern = () => {
    return (
      <>
        <defs>
          <clipPath id="shieldClip">{renderShield()}</clipPath>
        </defs>
        <g clipPath="url(#shieldClip)">
          {pattern === 'stripes' && (
            <React.Fragment>
              <rect x="30" y="0" width="10" height="100" fill={secondaryColor} opacity={opacity} />
              <rect x="60" y="0" width="10" height="100" fill={secondaryColor} opacity={opacity} />
            </React.Fragment>
          )}
          {pattern === 'half' && <rect x="50" y="0" width="50" height="100" fill={secondaryColor} opacity={opacity} />}
          {pattern === 'cross' && (
            <React.Fragment>
              <rect x="40" y="0" width="20" height="100" fill={secondaryColor} opacity={opacity} />
              <rect x="0" y="40" width="100" height="20" fill={secondaryColor} opacity={opacity} />
            </React.Fragment>
          )}
          {pattern === 'diagonal' && <path d="M0,0 L100,100 L100,80 L20,0 Z" fill={secondaryColor} opacity={opacity} />}
          {pattern === 'hoops' && (
            <React.Fragment>
              {[20, 40, 60, 80].map(y => <rect key={y} x="0" y={y} width="100" height="10" fill={secondaryColor} opacity={opacity} />)}
            </React.Fragment>
          )}
          {pattern === 'checkered' && (
            <React.Fragment>
              {[0, 40, 80].map(x => [0, 40, 80].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="20" height="20" fill={secondaryColor} opacity={opacity} />))}
              {[20, 60].map(x => [20, 60].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="20" height="20" fill={secondaryColor} opacity={opacity} />))}
            </React.Fragment>
          )}
          {pattern === 'diamonds' && (
            <React.Fragment>
              <path d="M50,0 L100,50 L50,100 L0,50 Z" fill={secondaryColor} opacity="0.25" />
              <path d="M50,25 L75,50 L50,75 L25,50 Z" fill={secondaryColor} opacity="0.25" />
            </React.Fragment>
          )}
        </g>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Emblem Creator | Fezcodex"
        description="Create your own custom football team emblem in a high-contrast brutalist environment."
        keywords={['football', 'emblem', 'logo', 'creator', 'generator', 'soccer', 'brutalist']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold"/>
            <span>Applications</span>
          </Link>
          <BreadcrumbTitle title={appName} slug="emblem" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Vector-based identity constructor. Define your team's{' '}
                <span className="text-emerald-400 font-bold">visual signature</span>.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Active_Team
                </span>
                <span className="text-3xl font-black text-emerald-500 truncate max-w-[200px]">
                  {teamName || 'NULL_ID'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Est_Date
                </span>
                <span className="text-3xl font-black text-white">{foundedYear}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <GearSixIcon weight="fill"/>
                Identity_Config
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Team_Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase"
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Foundation_Year</label>
                    <input
                      type="text"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showEstPrefix"
                    checked={showEstPrefix}
                    onChange={(e) => setShowEstPrefix(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 bg-white/10 border-white/20 rounded-sm"
                  />
                  <label htmlFor="showEstPrefix" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest cursor-pointer">
                    Prefix "EST." Enabled
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <CornersOutIcon /> Shape_Matrix
                    </label>
                    <CustomDropdown
                      fullWidth
                      options={[
                        {label: 'CLASSIC_SHIELD', value: 'shield1'},
                        {label: 'RADIAL_DISK', value: 'shield2'},
                        {label: 'DIAMOND_GRID', value: 'shield3'},
                        {label: 'ANCIENT_CREST', value: 'shield4'},
                        {label: 'LINEAR_BLOCK', value: 'shield5'},
                      ]}
                      value={shieldShape}
                      onChange={setShieldShape}
                      variant="brutalist"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <PaletteIcon /> Pattern_Overlay
                    </label>
                    <CustomDropdown
                      fullWidth
                      options={[
                        {label: 'NONE', value: 'none'},
                        {label: 'VERTICAL_STRIPES', value: 'stripes'},
                        {label: 'BI_SECTION', value: 'half'},
                        {label: 'AXIAL_CROSS', value: 'cross'},
                        {label: 'ANGULAR_PATH', value: 'diagonal'},
                        {label: 'HORIZONTAL_HOOPS', value: 'hoops'},
                        {label: 'CHECKERED_GRID', value: 'checkered'},
                        {label: 'DIAMOND_MAP', value: 'diamonds'},
                      ]}
                      value={pattern}
                      onChange={setPattern}
                      variant="brutalist"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <PaletteIcon /> Color_Spectrum
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[['Primary', primaryColor, setPrimaryColor], ['Secondary', secondaryColor, setSecondaryColor], ['Accent', accentColor, setAccentColor]].map(([label, val, set]) => (
                      <div key={label} className="space-y-2">
                        <div className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">{label}</div>
                        <input
                          type="color"
                          value={val}
                          onChange={(e) => set(e.target.value)}
                          className="w-full h-10 bg-transparent border border-white/10 rounded-sm cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TextAaIcon /> Label_Scale
                    </label>
                    <CustomDropdown
                      fullWidth
                      options={[
                        {label: 'MINIMAL (6)', value: '6'},
                        {label: 'STANDARD (8)', value: '8'},
                        {label: 'MAXIMUM (10)', value: '10'},
                      ]}
                      value={fontSize}
                      onChange={setFontSize}
                      variant="brutalist"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <PercentIcon /> Pattern_Alpha
                    </label>
                    <CustomDropdown
                      fullWidth
                      options={[
                        {label: '25%', value: '0.25'},
                        {label: '50%', value: '0.5'},
                        {label: '75%', value: '0.75'},
                        {label: '100%', value: '1.0'},
                      ]}
                      value={opacity}
                      onChange={setOpacity}
                      variant="brutalist"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <ShieldIcon size={20} weight="bold"/>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Vector_Notice
                </h4>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                All emblems are generated as high-fidelity SVG assets. Exporting will rasterize the output to high-resolution PNG format.
              </p>
            </div>
          </div>

          {/* Display Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3
              className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500"/>
              Raster_Preview
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-12 flex flex-col items-center justify-center gap-12 relative">
              <div className="bg-gray-900 p-8 rounded-sm shadow-2xl relative overflow-hidden group/svg">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:10px_10px]" />
                <svg
                  ref={svgRef}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl relative z-10"
                >
                  {renderShield()}
                  {renderPattern()}

                  <text
                    x="50"
                    y="25"
                    fontFamily="monospace"
                    fontWeight="900"
                    fontSize={fontSize}
                    textAnchor="middle"
                    fill={accentColor}
                    className="uppercase tracking-tighter"
                  >
                    {teamName}
                  </text>

                  <g transform="translate(30, 35)">
                    {React.cloneElement(iconMap[selectedIcon], {
                      size: 40,
                      color: accentColor,
                      weight: 'fill',
                    })}
                  </g>

                  <text
                    x="50"
                    y="85"
                    fontFamily="monospace"
                    fontSize={foundedYearFontSize}
                    textAnchor="middle"
                    fill={accentColor}
                    fontWeight="bold"
                    className="uppercase"
                  >
                    {showEstPrefix && 'EST. '} {foundedYear}
                  </text>
                </svg>
              </div>

              <div className="w-full max-w-lg space-y-6">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {Object.keys(iconMap).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedIcon(key)}
                      className={`aspect-square rounded-sm border transition-all flex items-center justify-center text-xl
                        ${selectedIcon === key ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:text-white'}
                      `}
                    >
                      {React.cloneElement(iconMap[key], {size: 20})}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <DownloadSimpleIcon weight="bold" size={18}/>
                  Download_Identity_Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootballEmblemCreatorPage;