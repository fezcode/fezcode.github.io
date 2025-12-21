import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BrutalistSidebar from './BrutalistSidebar';
import Footer from './Footer';
import DndNavbar from './dnd/DndNavbar';
import DndFooter from './dnd/DndFooter';
import { useLocation } from 'react-router-dom';
import Search from './Search';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import DigitalFlowers from './DigitalFlowers';
import DigitalLeaves from './DigitalLeaves';
import NaturalRain from './NaturalRain';
import SidePanel from './SidePanel';

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

  // Check if we are on the about page to conditionally render layout elements
  const isAboutPage = location.pathname.startsWith('/about');

  if (location.pathname.startsWith('/stories')) {
    return (
      <DndProvider>
        <div className="bg-gray-950 min-h-screen font-sans flex flex-col">
          <DndNavbar />
          <main className="flex-grow">{children}</main>
          <DndFooter />
        </div>
      </DndProvider>
    );
  }

  return (
    <>
      {isGarden && !isAboutPage && <DigitalFlowers />}
      {isAutumn && !isAboutPage && <DigitalLeaves />}
      {isRain && !isAboutPage && <NaturalRain />}
      <CommandPalette
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
        openGenericModal={openGenericModal}
        toggleDigitalRain={toggleDigitalRain}
        toggleBSOD={toggleBSOD}
      />
      {!isAboutPage && <SidePanel />}
      <div className="bg-gray-950 min-h-screen font-sans flex">
        {!isAboutPage &&
          (sidebarMode === 'classic' ? (
            <Sidebar
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
          className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen && !isAboutPage ? (sidebarMode === 'classic' ? 'md:ml-64' : 'md:ml-72') : 'md:ml-0'}`}
        >
          {!isAboutPage && (
            <Navbar
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isSearchVisible={isSearchVisible}
              toggleSearch={toggleSearch}
            />
          )}
          {!isAboutPage && isSearchVisible && (
            <Search isVisible={isSearchVisible} />
          )}
          <main className="flex-grow">{children}</main>
          {!isAboutPage &&
            location.pathname !== '/projects' &&
            location.pathname !== '/blog' &&
            location.pathname !== '/commands' && <Footer />}
        </div>
      </div>
    </>
  );
};

export default Layout;
