import React from 'react';
import Navbar from './Navbar';
import ClassicSidebar from './ClassicSidebar';
import BrutalistSidebar from './BrutalistSidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import Search from './Search';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DigitalFlowers from './DigitalFlowers';
import DigitalLeaves from './DigitalLeaves';
import NaturalRain from './NaturalRain';
import SidePanel from './SidePanel';
import Banner from './Banner';

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
    sidebarColor,
    sidebarMode,
    isSidebarOpen,
    toggleSidebar,
  } = useVisualSettings();
  const location = useLocation();

  // Check if we are on the about page or graph page to conditionally render layout elements
  const isAboutPage = location.pathname.startsWith('/about');
  const isGraphPage = location.pathname === '/graph';
  const hideLayout = isAboutPage || isGraphPage;

  if (location.pathname.startsWith('/stories')) {
    return (
      <DndProvider>
        {children}
      </DndProvider>
    );
  }

  return (
    <>
      <Banner />
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
      <div className="bg-[#050505] min-h-screen font-sans flex">
        {!hideLayout &&
          (sidebarMode === 'classic' ? (
            <ClassicSidebar
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              toggleModal={toggleModal}
              setIsPaletteOpen={setIsPaletteOpen}
              sidebarColor={sidebarColor}
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
          className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen && !hideLayout ? (sidebarMode === 'classic' ? 'md:ml-64' : 'md:ml-72') : 'md:ml-0'}`}
        >
          {!hideLayout && (
            <Navbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          )}
          {!hideLayout && isSearchVisible && (
            <Search isVisible={isSearchVisible} />
          )}
          <main className="flex-grow">{children}</main>
          {!hideLayout &&
            location.pathname !== '/projects' &&
            location.pathname !== '/blog' &&
            location.pathname !== '/commands' && <Footer />}
        </div>
      </div>
    </>
  );
};

export default Layout;
