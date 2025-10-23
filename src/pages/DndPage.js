import React, { useState, useEffect, useContext } from 'react';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext';
import { parseWallpaperName } from '../utils/dndUtils';
import usePageTitle from '../utils/usePageTitle';

const DndPage = () => {
  usePageTitle('From Serfs and Frauds');
  const [bgImage, setBgImage] = useState('');
  const { setBgImageName } = useContext(DndContext);

  useEffect(() => {
    const images = [
      '/images/wallies/artem-sapegin-XGDBdSQ70O0-unsplash.jpg',
      '/images/wallies/ember-navarro-3q2TzsUUVIo-unsplash.jpg',
      '/images/wallies/jr-korpa-RADGP_E2pBk-unsplash.jpg',
      '/images/wallies/muhammad-haikal-sjukri--RMBf_xSf2U-unsplash.jpg',
      '/images/wallies/vida-huang-XHiLiBfp7UM-unsplash.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  return (
    <div className="dnd-page-container">
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})` }}>
        <h1>
          <span className="dnd-hero-title-white">Welcome to the</span>
          <br />
          <span>From Serfs and Frauds</span>
        </h1>
      </div>
      {/* I will add the store content here later */}
    </div>
  );
};

export default DndPage;
