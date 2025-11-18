import React, { useContext } from 'react';
import { DndContext } from '../../context/DndContext';
import DndLogo from './DndLogo'; // Import DndLogo

const DndFooter = () => {
  const { bgImageName } = useContext(DndContext);

  return (
    <footer className="dnd-footer">
      <div className="dnd-footer-logo-section">
        <DndLogo />
        <p className="dnd-footer-copyright">From Serfs and Frauds</p>
      </div>
      <div className="dnd-footer-column">
        <h3>About Us</h3>
        <p>
          We are a group of adventurers and storytellers, dedicated to bringing
          you epic tales from the realms of fantasy.
        </p>
      </div>
      <div className="dnd-footer-column">
        <h3>Legal & Info</h3>
        <p>&copy; 2025 From Serfs and Frauds. All rights reserved.</p>
        <p>Unsplash: {bgImageName}</p>
      </div>
    </footer>
  );
};

export default DndFooter;
