import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './components/ToastProvider';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import { AnimationProvider } from './context/AnimationContext'; // Import AnimationProvider

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  return (
    <AnimationProvider> {/* Wrap the entire app with AnimationProvider */}
      <Router>
        <ScrollToTop />
        <ToastProvider>
          <Layout toggleModal={toggleModal} isSearchVisible={isSearchVisible} toggleSearch={toggleSearch}>
            <AnimatedRoutes />
          </Layout>
          <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
        </ToastProvider>
      </Router>
    </AnimationProvider>
  );
}

export default App;
