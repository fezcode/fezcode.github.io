import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const { isPaletteOpen, setIsPaletteOpen } = useCommandPalette();
  const { isGarden, isAutumn, isRain, sidebarColor } = useVisualSettings();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      {isGarden && <DigitalFlowers />}
      {isAutumn && <DigitalLeaves />}
      {isRain && <NaturalRain />}
      <CommandPalette
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
        openGenericModal={openGenericModal}
        toggleDigitalRain={toggleDigitalRain}
        toggleBSOD={toggleBSOD}
      />
      <SidePanel />
      <div className="bg-gray-950 min-h-screen font-sans flex">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          setIsPaletteOpen={setIsPaletteOpen} // Pass setIsPaletteOpen to Sidebar
          sidebarColor={sidebarColor} // Pass sidebarColor to Sidebar
        />{' '}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
        >
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            isSearchVisible={isSearchVisible}
            toggleSearch={toggleSearch}
          />
          {isSearchVisible && <Search isVisible={isSearchVisible} />}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
