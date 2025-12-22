import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import GenericModal from './components/GenericModal';
import DigitalRain from './components/DigitalRain';
import BSOD from './components/BSOD';
import { AnimationProvider } from './context/AnimationContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { VisualSettingsProvider } from './context/VisualSettingsContext';
import { AchievementProvider } from './context/AchievementContext';
import AchievementListeners from './components/AchievementListeners';
import { SidePanelProvider } from './context/SidePanelContext';
import { HomepageOrderProvider } from './context/HomepageOrderContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [genericModalContent, setGenericModalContent] = useState({
    title: '',
    content: null,
  });
  const [isRainActive, setIsRainActive] = useState(false); // State for Digital Rain
  const [isBSODActive, setIsBSODActive] = useState(false); // State for BSOD

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openGenericModal = (title, content) => {
    setGenericModalContent({ title, content });
    setIsGenericModalOpen(true);
  };

  const closeGenericModal = () => {
    setIsGenericModalOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };
  const toggleDigitalRain = () => {
    setIsRainActive((prev) => !prev);
  };
  const toggleBSOD = () => {
    setIsBSODActive((prev) => !prev);
  };

  return (
    <AnimationProvider>
      <Router>
        <ToastProvider>
          <SiteConfigProvider>
            <AchievementProvider>
              <AchievementListeners />
            <HomepageOrderProvider>
              <VisualSettingsProvider>
                <DigitalRain isActive={isRainActive} />
                <BSOD isActive={isBSODActive} toggleBSOD={toggleBSOD} />
                <ScrollToTop />
                <CommandPaletteProvider>
                  <SidePanelProvider>
                    <Layout
                      toggleModal={toggleModal}
                      isSearchVisible={isSearchVisible}
                      toggleSearch={toggleSearch}
                      openGenericModal={openGenericModal}
                      toggleDigitalRain={toggleDigitalRain}
                      toggleBSOD={toggleBSOD}
                    >
                      <AnimatedRoutes />
                    </Layout>
                  </SidePanelProvider>
                </CommandPaletteProvider>
                <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
                <GenericModal
                  isOpen={isGenericModalOpen}
                  onClose={closeGenericModal}
                  title={genericModalContent.title}
                >
                  {genericModalContent.content}
                </GenericModal>
              </VisualSettingsProvider>
            </HomepageOrderProvider>
          </AchievementProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </Router>
  </AnimationProvider>
  );
}
export default App;
