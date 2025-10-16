import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <Router basename="/">
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;