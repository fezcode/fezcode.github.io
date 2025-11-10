import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './components/ToastProvider';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <Layout toggleModal={toggleModal} isSearchVisible={isSearchVisible} toggleSearch={toggleSearch}>
          <AnimatedRoutes />
        </Layout>
        <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
      </ToastProvider>
    </Router>
  );
}

export default App;
