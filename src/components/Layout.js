import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import DndNavbar from './DndNavbar';
import DndFooter from './DndFooter';
import { useLocation } from 'react-router-dom';

import { DndProvider } from '../context/DndContext';

const Layout = ({ children, toggleModal }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
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

  if (location.pathname.startsWith('/dnd')) {
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
    <div className="bg-gray-950 min-h-screen font-sans flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
