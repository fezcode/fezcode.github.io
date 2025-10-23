import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './components/ToastProvider';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;
