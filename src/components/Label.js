import React from 'react';


const Label = ({ children, onClick }) => {
  return (
    <span className="inline-block bg-gray-700 text-gray-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full" onClick={onClick}>
      {children}
    </span>
  );
};

export default Label;