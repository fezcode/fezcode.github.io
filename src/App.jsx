import React, { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import GenericModal from './components/GenericModal';
import DigitalRain from './components/DigitalRain';
import BSOD from './components/BSOD';
import { AnimationProvider, useAnimation } from './context/AnimationContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import {
  VisualSettingsProvider,
  useVisualSettings,
} from './context/VisualSettingsContext';
import { AchievementProvider } from './context/AchievementContext';
import AchievementListeners from './components/AchievementListeners';
import { SidePanelProvider } from './context/SidePanelContext';
import { HomepageOrderProvider } from './context/HomepageOrderContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { CloudMusicProvider } from './context/CloudMusicContext';
import { DndProvider } from './context/DndContext';
import TinyCloudPlayer from './app/apps/CloudMusicPlayer/components/TinyCloudPlayer';
import { MotionConfig } from 'framer-motion';
import { isShelfLogLocation } from './utils/discoveryMode';

const DiscoveryPage = lazy(() => import('./pages/discovery/DiscoveryPage'));

const MotionConfigWrapper = ({ children }) => {
  const { reduceMotion } = useAnimation();
  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
};

function AppShell({
  isModalOpen,
  toggleModal,
  isSearchVisible,
  toggleSearch,
  isGenericModalOpen,
  genericModalContent,
  openGenericModal,
  closeGenericModal,
  isRainActive,
  toggleDigitalRain,
  isBSODActive,
  toggleBSOD,
}) {
  const location = useLocation();
  const discoveryViewMode =
    useVisualSettings?.()?.discoveryViewMode || 'shelf';
  const isDiscoveryPage = isShelfLogLocation(location, discoveryViewMode);

  return (
    <>
      {!isDiscoveryPage && (
        <>
          <DigitalRain isActive={isRainActive} />
          <BSOD isActive={isBSODActive} toggleBSOD={toggleBSOD} />
          <ScrollToTop />
          <TinyCloudPlayer />
        </>
      )}
      <CommandPaletteProvider>
        <SidePanelProvider>
          {isDiscoveryPage ? (
            <Suspense
              fallback={
                <div
                  role="status"
                  style={{
                    minHeight: '100dvh',
                    display: 'grid',
                    placeItems: 'center',
                    background: '#111318',
                    color: '#eceef2',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Opening discovery…
                </div>
              }
            >
              {/* One unkeyed route retains the feed while a showcase opens. */}
              <Routes>
                <Route
                  path="/logs/:category?/:slug?"
                  element={<DiscoveryPage />}
                />
                <Route
                  path="/discovery/:category?/:slug?"
                  element={<DiscoveryPage />}
                />
                <Route
                  path="/discovery/*"
                  element={<Navigate to="/discovery" replace />}
                />
              </Routes>
            </Suspense>
          ) : (
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
          )}
        </SidePanelProvider>
      </CommandPaletteProvider>
      {!isDiscoveryPage && (
        <>
          <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
          <GenericModal
            isOpen={isGenericModalOpen}
            onClose={closeGenericModal}
            title={genericModalContent.title}
          >
            {genericModalContent.content}
          </GenericModal>
        </>
      )}
    </>
  );
}

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
      <MotionConfigWrapper>
        <ToastProvider>
          <SiteConfigProvider>
            <CloudMusicProvider>
              <DndProvider>
                <AchievementProvider>
                  <AchievementListeners />
                  <HomepageOrderProvider>
                    <VisualSettingsProvider>
                      <AppShell
                        isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                        isSearchVisible={isSearchVisible}
                        toggleSearch={toggleSearch}
                        isGenericModalOpen={isGenericModalOpen}
                        genericModalContent={genericModalContent}
                        openGenericModal={openGenericModal}
                        closeGenericModal={closeGenericModal}
                        isRainActive={isRainActive}
                        toggleDigitalRain={toggleDigitalRain}
                        isBSODActive={isBSODActive}
                        toggleBSOD={toggleBSOD}
                      />
                    </VisualSettingsProvider>
                  </HomepageOrderProvider>
                </AchievementProvider>
              </DndProvider>
            </CloudMusicProvider>
          </SiteConfigProvider>
        </ToastProvider>
      </MotionConfigWrapper>
    </AnimationProvider>
  );
}
export default App;
