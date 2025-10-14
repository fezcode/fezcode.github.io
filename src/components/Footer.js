import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-8">
      <div className="container mx-auto text-center text-gray-300">
        &copy; {new Date().getFullYear()} My Blog. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;