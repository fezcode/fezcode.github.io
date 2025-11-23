import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import DndNavbar from './dnd/DndNavbar';
import DndFooter from './dnd/DndFooter';
import { useLocation } from 'react-router-dom';
import Search from './Search';
import CommandPalette from './CommandPalette';

import { DndProvider } from '../context/DndContext';

const Layout = ({ children, toggleModal, isSearchVisible, toggleSearch, openGenericModal, toggleDigitalRain }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 'k') {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
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
      <CommandPalette isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen} openGenericModal={openGenericModal} toggleDigitalRain={toggleDigitalRain} />
      <div className="bg-gray-950 min-h-screen font-sans flex">
              <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                toggleModal={toggleModal}
                setIsPaletteOpen={setIsPaletteOpen} // Pass setIsPaletteOpen to Sidebar
              />        <div
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
