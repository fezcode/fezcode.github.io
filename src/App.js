import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <Router>
      <ToastProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;