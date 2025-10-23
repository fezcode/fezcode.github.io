import React, { createContext, useState } from 'react';

export const DndContext = createContext();

export const DndProvider = ({ children }) => {
  const [bgImageName, setBgImageName] = useState('');

  return (
    <DndContext.Provider value={{ bgImageName, setBgImageName }}>
      {children}
    </DndContext.Provider>
  );
};
