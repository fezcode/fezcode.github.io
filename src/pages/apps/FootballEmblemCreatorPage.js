import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
} from '@phosphor-icons/react';
import CustomDropdown from '../../components/CustomDropdown'; // Add this line
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';

const FootballEmblemCreatorPage = () => {
  useSeo({
    title: 'Football Emblem Creator | Fezcodex',
    description: 'Create your own custom football team emblem.',
    keywords: ['football', 'emblem', 'logo', 'creator', 'generator', 'soccer'],
    ogTitle: 'Football Emblem Creator | Fezcodex',
    ogDescription: 'Create your own custom football team emblem.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Football Emblem Creator | Fezcodex',
    twitterDescription: 'Create your own custom football team emblem.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();
  const svgRef = useRef(null);

  const [teamName, setTeamName] = useState('FEZ FC');
  const [foundedYear, setFoundedYear] = useState('2025');
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#1e293b');
  const [shieldShape, setShieldShape] = useState('shield1');
  const [selectedIcon, setSelectedIcon] = useState('soccer');
  const [pattern, setPattern] = useState('stripes');
  const [fontSize, setFontSize] = useState('10');
  const [foundedYearFontSize, setFoundedYearFontSize] = useState('6');
  const [showEstPrefix, setShowEstPrefix] = useState(true);

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button`;

  const icons = {
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

    const svgSize = 500;
    canvas.width = svgSize;
    canvas.height = svgSize;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, svgSize, svgSize);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${teamName.replace(/\s+/g, '_').toLowerCase()}_emblem.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      addToast({ title: 'Downloaded', message: 'Emblem saved successfully!', duration: 2000 });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Shield Paths (normalized to 100x100 roughly, will scale)
  const renderShield = () => {
    switch (shieldShape) {
      case 'shield1': // Classic
        return <path d="M10,10 L90,10 L90,30 C90,70 50,95 50,95 C50,95 10,70 10,30 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield2': // Round
        return <circle cx="50" cy="50" r="45" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield3': // Diamond
        return <path d="M50,5 L95,50 L50,95 L5,50 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      case 'shield4': // Crest
         return <path d="M10,10 Q50,0 90,10 L90,40 Q90,80 50,95 Q10,80 10,40 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
       case 'shield5': // Boxy
        return <path d="M15,10 L85,10 L85,70 L50,95 L15,70 Z" fill={primaryColor} stroke={accentColor} strokeWidth="2" />;
      default:
        return null;
    }
  };

  const renderPattern = () => {
     // Patterns overlay on top of the base shield, masked by the shield shape logic ideally.
     // Since SVG masking can be complex, I'll just draw shapes that fit generally or use a clipPath.
     // Let's use a clipPath for the shield.
     return (
        <>
            <defs>
                <clipPath id="shieldClip">
                    {renderShield()}
                </clipPath>
            </defs>
            <g clipPath="url(#shieldClip)">
                {pattern === 'stripes' && (
                    <React.Fragment>
                        <rect x="30" y="0" width="10" height="100" fill={secondaryColor} opacity="0.5" />
                        <rect x="60" y="0" width="10" height="100" fill={secondaryColor} opacity="0.5" />
                    </React.Fragment>
                )}
                 {pattern === 'half' && (
                    <rect x="50" y="0" width="50" height="100" fill={secondaryColor} opacity="0.5" />
                )}
                 {pattern === 'cross' && (
                    <React.Fragment>
                         <rect x="40" y="0" width="20" height="100" fill={secondaryColor} opacity="0.5" />
                         <rect x="0" y="40" width="100" height="20" fill={secondaryColor} opacity="0.5" />
                    </React.Fragment>
                )}
                 {pattern === 'diagonal' && (
                     <path d="M0,0 L100,100 L100,80 L20,0 Z" fill={secondaryColor} opacity="0.5" />
                 )}
                 {pattern === 'hoops' && (
                     <React.Fragment>
                         <rect x="0" y="20" width="100" height="10" fill={secondaryColor} opacity="0.5" />
                         <rect x="0" y="40" width="100" height="10" fill={secondaryColor} opacity="0.5" />
                         <rect x="0" y="60" width="100" height="10" fill={secondaryColor} opacity="0.5" />
                         <rect x="0" y="80" width="100" height="10" fill={secondaryColor} opacity="0.5" />
                     </React.Fragment>
                 )}
                 {pattern === 'checkered' && (
                     <React.Fragment>
                         <rect x="0" y="0" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="40" y="0" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="80" y="0" width="20" height="20" fill={secondaryColor} opacity="0.5" />

                         <rect x="20" y="20" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="60" y="20" width="20" height="20" fill={secondaryColor} opacity="0.5" />

                         <rect x="0" y="40" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="40" y="40" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="80" y="40" width="20" height="20" fill={secondaryColor} opacity="0.5" />

                         <rect x="20" y="60" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="60" y="60" width="20" height="20" fill={secondaryColor} opacity="0.5" />

                         <rect x="0" y="80" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="40" y="80" width="20" height="20" fill={secondaryColor} opacity="0.5" />
                         <rect x="80" y="80" width="20" height="20" fill={secondaryColor} opacity="0.5" />
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
     )
  }

  return (
    <div className="py-16 sm:py-24 text-gray-300">
       <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center justify-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">emblem</span>
        </h1>
        <hr className="border-gray-700 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Editor Controls */}
            <div className="space-y-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-app">Team Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                maxLength={20}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Founded Year</label>
                            <input
                                type="text"
                                value={foundedYear}
                                onChange={(e) => setFoundedYear(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                maxLength={4}
                            />
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="showEstPrefix"
                                checked={showEstPrefix}
                                onChange={(e) => setShowEstPrefix(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showEstPrefix" className="ml-2 block text-sm text-gray-400">
                                Show "EST." Prefix
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Team Font Size</label>
                      <CustomDropdown
                        options={[
                          { label: 'Small', value: '6' },
                          { label: 'Medium', value: '8' },
                          { label: 'Large', value: '10' },
                        ]}
                        value={fontSize}
                        onChange={setFontSize}
                        label="Select Year Size"
                        icon={TextAaIcon}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Year Font Size</label>
                      <CustomDropdown
                        options={[
                          { label: 'Small', value: '4' },
                          { label: 'Medium', value: '6' },
                          { label: 'Large', value: '8' },
                        ]}
                        value={foundedYearFontSize}
                        onChange={setFoundedYearFontSize}
                        label="Select Year Size"
                        icon={TextAaIcon}
                      />
                    </div>
                  </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4 text-app">Colors</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-400 mb-1">Primary</label>
                             <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-400 mb-1">Secondary</label>
                             <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-400 mb-1">Accent</label>
                             <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent" />
                        </div>
                    </div>
                </div>

                 <div>
                    <h3 className="text-xl font-semibold mb-4 text-app">Shape & Pattern</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-400 mb-1">Shape</label>
                             <CustomDropdown
                                options={[
                                  { label: 'Classic Shield', value: 'shield1' },
                                  { label: 'Round', value: 'shield2' },
                                  { label: 'Diamond', value: 'shield3' },
                                  { label: 'Crest', value: 'shield4' },
                                  { label: 'Boxy', value: 'shield5' },
                                ]}
                                value={shieldShape}
                                onChange={setShieldShape}
                                label="Select Shield Shape"
                                icon={TrophyIcon} // Reusing Trophy icon
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-400 mb-1">Pattern</label>
                             <CustomDropdown
                                options={[
                                  { label: 'None', value: 'none' },
                                  { label: 'Stripes', value: 'stripes' },
                                  { label: 'Half Split', value: 'half' },
                                  { label: 'Cross', value: 'cross' },
                                  { label: 'Diagonal', value: 'diagonal' },
                                  { label: 'Hoops', value: 'hoops' },
                                  { label: 'Checkered', value: 'checkered' },
                                  { label: 'Diamonds', value: 'diamonds' },
                                ]}
                                value={pattern}
                                onChange={setPattern}
                                label="Select Pattern"
                                icon={SoccerBallIcon} // Reusing SoccerBall icon
                             />
                        </div>
                    </div>
                </div>

                 <div>
                    <h3 className="text-xl font-semibold mb-4 text-app">Icon</h3>
                    <div className="grid grid-cols-6 gap-2">
                        {Object.keys(icons).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedIcon(key)}
                                className={`p-2 rounded-lg border ${selectedIcon === key ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-500'} flex justify-center items-center text-2xl transition-colors`}
                            >
                                {icons[key]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center justify-start space-y-8">
                 <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl relative">
                    <div className="absolute top-4 right-4 text-gray-500 text-sm font-mono">Preview</div>
                    <svg
                        ref={svgRef}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        className="w-80 h-80 drop-shadow-xl"
                    >
                        {renderShield()}
                        {renderPattern()}

                        {/* Text Path for Team Name (Curved if Shield1/2/4, straight for others maybe? Let's keep it simple first) */}
                        <text
                            x="50"
                            y="25"
                            fontFamily="Arial, sans-serif"
                            fontWeight="bold"
                            fontSize={fontSize}
                            textAnchor="middle"
                            fill={accentColor}
                            className="uppercase"
                            style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}
                        >
                            {teamName}
                        </text>

                         {/* Icon */}
                         <g transform="translate(30, 30)">
                            {React.cloneElement(icons[selectedIcon], { size: 40, color: accentColor, weight: 'fill' })}
                         </g>

                         {/* Founded Year */}
                         <text
                            x="50"
                            y="85"
                            fontFamily="Arial, sans-serif"
                            fontSize={foundedYearFontSize}
                            textAnchor="middle"
                            fill={accentColor}
                            fontWeight="bold"
                         >
                            {showEstPrefix && "EST. "} {foundedYear}
                         </text>
                    </svg>
                 </div>

                 <button
                    onClick={handleDownload}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15"
                 >
                    <DownloadSimpleIcon size={20} className="inline-block mr-2" />
                    Download Emblem
                 </button>

                 <div className="text-sm text-gray-500 max-w-md text-center">
                    Note: The downloaded image will be a high-quality PNG.
                 </div>
            </div>
        </div>
       </div>
    </div>
  );
};

export default FootballEmblemCreatorPage;
