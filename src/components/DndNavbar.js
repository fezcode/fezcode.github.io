import React from 'react';
import { Link } from 'react-router-dom';
import DndLogo from './DndLogo';

const DndNavbar = () => {
  return (
    <nav className="dnd-navbar">
      <div className="dnd-navbar-left">
        <Link to="/" className="dnd-navbar-link">Back to Home</Link>
      </div>
      <div className="dnd-navbar-center">
        <span className="dnd-navbar-title">From Serfs and Frauds</span>
      </div>
      <div className="dnd-navbar-right">
        <DndLogo />
      </div>
    </nav>
  );
};

export default DndNavbar;
