import React from 'react';
import Navbar from './Navbar';
import BrutalistSidebar from './BrutalistSidebar';
import Footer from './Footer';
import LuxeSidebar from './LuxeSidebar';
import LuxeNavbar from './LuxeNavbar';
import LuxeFooter from './LuxeFooter';
import TerracottaSidebar from './TerracottaSidebar';
import TerracottaNavbar from './TerracottaNavbar';
import TerracottaFooter from './TerracottaFooter';
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
  const {
    isGarden,
    isAutumn,
    isRain,
    isSidebarOpen,
    toggleSidebar,
    isAppFullscreen,
    fezcodexTheme,
    headerFont,
    bodyFont,
  } = useVisualSettings();

  const FONT_FAMILY = {
    'font-sans': "'Space Mono', monospace",
    'font-mono': "'JetBrains Mono', monospace",
    'font-inter': "'Inter', sans-serif",
    'font-arvo': "'Arvo', serif",
    'font-playfairDisplay': "'Playfair Display', serif",
    'font-syne': "'Syne', sans-serif",
    'font-outfit': "'Outfit', sans-serif",
    'font-ibm-plex-mono': "'IBM Plex Mono', monospace",
    'font-instr-serif': "'Instrument Serif', serif",
    'font-nunito': "'Nunito', sans-serif",
    'font-fraunces': "'Fraunces', 'Times New Roman', serif",
  };

  const themedFontCss =
    fezcodexTheme === 'terracotta' || fezcodexTheme === 'luxe'
      ? `
        [data-fezcodex-theme="${fezcodexTheme}"],
        [data-fezcodex-theme="${fezcodexTheme}"] p,
        [data-fezcodex-theme="${fezcodexTheme}"] li,
        [data-fezcodex-theme="${fezcodexTheme}"] span,
        [data-fezcodex-theme="${fezcodexTheme}"] div,
        [data-fezcodex-theme="${fezcodexTheme}"] a,
        [data-fezcodex-theme="${fezcodexTheme}"] button,
        [data-fezcodex-theme="${fezcodexTheme}"] blockquote {
          font-family: ${FONT_FAMILY[bodyFont] || FONT_FAMILY['font-outfit']};
        }
        [data-fezcodex-theme="${fezcodexTheme}"] h1,
        [data-fezcodex-theme="${fezcodexTheme}"] h2,
        [data-fezcodex-theme="${fezcodexTheme}"] h3,
        [data-fezcodex-theme="${fezcodexTheme}"] h4,
        [data-fezcodex-theme="${fezcodexTheme}"] h5,
        [data-fezcodex-theme="${fezcodexTheme}"] h6 {
          font-family: ${FONT_FAMILY[headerFont] || FONT_FAMILY['font-outfit']};
        }
        /* Respect explicit monospace labels — mono stays mono regardless */
        [data-fezcodex-theme="${fezcodexTheme}"] code,
        [data-fezcodex-theme="${fezcodexTheme}"] pre,
        [data-fezcodex-theme="${fezcodexTheme}"] kbd,
        [data-fezcodex-theme="${fezcodexTheme}"] .font-mono,
        [data-fezcodex-theme="${fezcodexTheme}"] .font-ibm-plex-mono {
          font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
        }
      `
      : '';
  const location = useLocation();
  const { projects } = useProjects();

  // Check if we are on the about page or graph page to conditionally render layout elements
  const isTheVaguePage = location.pathname.startsWith('/the-vague');
  const isAboutPage = location.pathname.startsWith('/about');
  const isGraphPage = location.pathname.startsWith('/graph');
  const isTerminalPage = location.pathname.startsWith('/terminal');

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
    projectStyle === 'bento';
  // Check if we are inside a specific app (but not the apps listing page)
  const isAppDetail =
    location.pathname.startsWith('/apps/') && location.pathname !== '/apps/';
  const hideLayout =
    isAboutPage ||
    isGraphPage ||
    isSpecialProject ||
    isTheVaguePage ||
    isTerminalPage ||
    (isAppDetail && isAppFullscreen);

  const mainContent = location.pathname.startsWith('/stories') ? (
    <DndProvider>{children}</DndProvider>
  ) : (
    <div
      data-fezcodex-theme={fezcodexTheme}
      className={`${
        fezcodexTheme === 'luxe'
          ? 'bg-[#F5F5F0]'
          : fezcodexTheme === 'terracotta'
            ? 'bg-[#F3ECE0]'
            : 'bg-[#050505]'
      } min-h-screen font-sans flex`}
    >
      {themedFontCss && <style>{themedFontCss}</style>}
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
        ) : (
          <BrutalistSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            setIsPaletteOpen={setIsPaletteOpen}
          />
        ))}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen && !hideLayout ? 'md:ml-72' : 'md:ml-0'}`}
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
          ) : (
            <Navbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          ))}
        {!hideLayout && isSearchVisible && (
          <Search isVisible={isSearchVisible} />
        )}
        <main className="flex-grow">{children}</main>
        {!hideLayout &&
          location.pathname !== '/projects' &&
          location.pathname !== '/blog' &&
          location.pathname !== '/commands' &&
          (fezcodexTheme === 'terracotta' ? (
            <TerracottaFooter />
          ) : fezcodexTheme === 'luxe' ? (
            <LuxeFooter />
          ) : (
            <Footer />
          ))}
      </div>
    </div>
  );

  return (
    <>
      <Banner />
      <FalloutOverlay />
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
      <SyntaxSprite />
    </>
  );
};

export default Layout;
