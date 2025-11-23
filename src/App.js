import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import GenericModal from './components/GenericModal';
import { AnimationProvider } from './context/AnimationContext'; // Import AnimationProvider

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [genericModalContent, setGenericModalContent] = useState({ title: '', content: null });

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

  return (
    <AnimationProvider>
      {' '}
      {/* Wrap the entire app with AnimationProvider */}
      <Router>
        <ScrollToTop />
        <ToastProvider>
          <Layout
            toggleModal={toggleModal}
            isSearchVisible={isSearchVisible}
            toggleSearch={toggleSearch}
            openGenericModal={openGenericModal}
          >
            <AnimatedRoutes />
          </Layout>
          <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
          <GenericModal
            isOpen={isGenericModalOpen}
            onClose={closeGenericModal}
            title={genericModalContent.title}
          >
            {genericModalContent.content}
          </GenericModal>
        </ToastProvider>
      </Router>
    </AnimationProvider>
  );
}

export default App;
