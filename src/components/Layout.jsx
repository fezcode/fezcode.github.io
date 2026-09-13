import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LuxeNavbar from './LuxeNavbar';
import LuxeFooter from './LuxeFooter';
import TerracottaNavbar from './TerracottaNavbar';
import TerracottaFooter from './TerracottaFooter';
import MistNavbar from './MistNavbar';
import MistFooter from './MistFooter';
import LedgerNavbar from './LedgerNavbar';
import LedgerFooter from './LedgerFooter';
import BrutalistSidebar from './BrutalistSidebar';
import LuxeSidebar from './LuxeSidebar';
import TerracottaSidebar from './TerracottaSidebar';
import MistSidebar from './MistSidebar';
import LedgerSidebar from './LedgerSidebar';
import OrbitSidebar from './OrbitSidebar';
import OrbitNavbar from './OrbitNavbar';
import OrbitFooter from './OrbitFooter';
import { useOrbitPalette } from './orbit';
import { useAnimation } from '../context/AnimationContext';
import '../styles/Orbit.css';
import '../styles/Ledger.css';
import { useLocation } from 'react-router-dom';
import Search from './Search';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DigitalFlowers from './DigitalFlowers';
import DigitalLeaves from './DigitalLeaves';
import NaturalRain from './NaturalRain';
import FalloutOverlay from './FalloutOverlay';
import SidePanel from './SidePanel';
import Banner from './Banner';
import SyntaxSprite from './SyntaxSprite';
import { useProjects } from '../utils/projectParser';

import { DndProvider } from '../context/DndContext';
import { SnfProvider } from '../context/SnfContext';
import { SnfV3Provider } from '../context/SnfV3Context';

const Layout = ({
  children,
  toggleModal,
  isSearchVisible,
  toggleSearch,
  openGenericModal,
  toggleDigitalRain,
  toggleBSOD,
}) => {
  const { isPaletteOpen, setIsPaletteOpen } = useCommandPalette();
  useOrbitPalette();
  const { reduceMotion } = useAnimation();
  const {
    isGarden,
    isAutumn,
    isRain,
    isSidebarOpen,
    toggleSidebar,
    isAppFullscreen,
    fezcodexTheme,
  } = useVisualSettings();
  const location = useLocation();
  const { projects } = useProjects();

  // Check if we are on the about page or graph page to conditionally render layout elements
  const isTheVaguePage = location.pathname.startsWith('/the-vague');
  const isAboutPage = location.pathname.startsWith('/about');
  const isOrbitAboutPage =
    fezcodexTheme === 'orbit' &&
    ['/about', '/about/', '/about/orbit', '/about/orbit/'].includes(
      location.pathname,
    );
  const isGraphPage = location.pathname.startsWith('/graph');
  const isTerminalPage = location.pathname.startsWith('/terminal');
  const isBookshelfPage = location.pathname.startsWith('/bookshelf');
  const isSnfPage = location.pathname.startsWith('/snf');
  const isSnfAny = isSnfPage || isBookshelfPage;

  // Check for special project styles that require hiding the default layout
  const projectSlug = location.pathname.startsWith('/projects/')
    ? location.pathname.split('/')[2]
    : null;
  const project = projectSlug
    ? projects.find((p) => p.slug === projectSlug)
    : null;

  const projectStyle = project?.style || 'default';
  const isSpecialProject =
    projectStyle === 'stylish' ||
    projectStyle === 'editorial' ||
    projectStyle === 'minimal-modern' ||
    projectStyle === 'museum' ||
    projectStyle === 'landscape' ||
    projectStyle === 'ruby' ||
    projectStyle === 'neon-slideshow' ||
    projectStyle === 'bento' ||
    projectStyle === 'atlas' ||
    projectStyle === 'hifi' ||
    [
      'eaves',
      'panes',
      'graph',
      'filmstrip',
      'shelf',
      'document',
      'page',
      'gallery',
    ].includes(projectStyle);
  // Check if we are inside a specific app (but not the apps listing page)
  const isAppDetail =
    location.pathname.startsWith('/apps/') && location.pathname !== '/apps/';
  const isDemystifyPage = location.pathname.startsWith('/demystify');
  const hideLayout =
    (isAboutPage && !isOrbitAboutPage) ||
    isGraphPage ||
    isSpecialProject ||
    isTheVaguePage ||
    isTerminalPage ||
    isSnfAny ||
    isDemystifyPage ||
    (isAppDetail && isAppFullscreen);

  const mainContent = location.pathname.startsWith('/stories') ? (
    <DndProvider>{children}</DndProvider>
  ) : isBookshelfPage ? (
    <SnfV3Provider>{children}</SnfV3Provider>
  ) : isSnfPage ? (
    <SnfProvider>{children}</SnfProvider>
  ) : (
    <div
      className={`${
        fezcodexTheme === 'luxe'
          ? 'bg-[#F5F5F0]'
          : fezcodexTheme === 'terracotta'
            ? 'bg-[#F3ECE0]'
            : fezcodexTheme === 'mist'
              ? 'bg-[#EEF2F1]'
              : fezcodexTheme === 'ledger'
                ? 'ldg-appframe'
                : fezcodexTheme === 'orbit'
                  ? `orb-appframe ${reduceMotion ? 'orb-reduce-motion' : ''}`
                  : 'bg-[#050505]'
      } min-h-screen font-sans flex`}
    >
      {!hideLayout &&
        (fezcodexTheme === 'luxe' ? (
          <LuxeSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ) : fezcodexTheme === 'terracotta' ? (
          <TerracottaSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ) : fezcodexTheme === 'mist' ? (
          <MistSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ) : fezcodexTheme === 'ledger' ? (
          <LedgerSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ) : fezcodexTheme === 'orbit' ? (
          <OrbitSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ) : (
          <BrutalistSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ))}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen && !hideLayout ? (fezcodexTheme === 'orbit' ? 'orb-content-open' : 'md:ml-72') : 'md:ml-0'}`}
      >
        {!hideLayout &&
          (fezcodexTheme === 'terracotta' ? (
            <TerracottaNavbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ) : fezcodexTheme === 'luxe' ? (
            <LuxeNavbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ) : fezcodexTheme === 'mist' ? (
            <MistNavbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ) : fezcodexTheme === 'ledger' ? (
            <LedgerNavbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ) : fezcodexTheme === 'orbit' ? (
            <OrbitNavbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ) : (
            <Navbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ))}
        {!hideLayout && isSearchVisible && (
          <Search isVisible={isSearchVisible} toggleSearch={toggleSearch} />
        )}
        <main className="flex-grow">{children}</main>
        {!hideLayout &&
          location.pathname !== '/projects' &&
          location.pathname !== '/blog' &&
          !location.pathname.startsWith('/blog/series') &&
          location.pathname !== '/commands' &&
          (fezcodexTheme === 'terracotta' ? (
            <TerracottaFooter />
          ) : fezcodexTheme === 'luxe' ? (
            <LuxeFooter />
          ) : fezcodexTheme === 'mist' ? (
            <MistFooter />
          ) : fezcodexTheme === 'ledger' ? (
            <LedgerFooter />
          ) : fezcodexTheme === 'orbit' ? (
            <OrbitFooter />
          ) : (
            <Footer />
          ))}
      </div>
    </div>
  );

  return (
    <>
      {!isSnfAny && <Banner />}
      {!isSnfAny && <FalloutOverlay />}
      {isGarden && !hideLayout && <DigitalFlowers />}
      {isAutumn && !hideLayout && <DigitalLeaves />}
      {isRain && !hideLayout && <NaturalRain />}
      <CommandPalette
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
        openGenericModal={openGenericModal}
        toggleDigitalRain={toggleDigitalRain}
        toggleBSOD={toggleBSOD}
      />
      {!hideLayout && <SidePanel />}
      {mainContent}
      {!isSnfAny && <SyntaxSprite />}
    </>
  );
};

export default Layout;
