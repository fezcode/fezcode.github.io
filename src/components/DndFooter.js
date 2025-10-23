import React, { useContext } from 'react';
import { DndContext } from '../context/DndContext';

const DndFooter = () => {
  const { bgImageName } = useContext(DndContext);

  return (
    <footer className="dnd-footer">
      <div className="dnd-footer-left">
        <p>&copy; 2025 From Serfs and Frauds. All rights reserved.</p>
      </div>
      <div className="dnd-footer-right">
        <p> Unsplash: {bgImageName}</p>
      </div>
    </footer>
  );
};

export default DndFooter;
