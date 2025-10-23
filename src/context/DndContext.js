import React, { createContext, useState } from 'react';

export const DndContext = createContext();

export const DndProvider = ({ children }) => {
  const [bgImageName, setBgImageName] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]); // Add breadcrumbs state

  return (
    <DndContext.Provider value={{ bgImageName, setBgImageName, breadcrumbs, setBreadcrumbs }}>
      {children}
    </DndContext.Provider>
  );
};
