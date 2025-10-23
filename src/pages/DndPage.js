import React, { useState, useEffect, useContext } from 'react';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext';
import { parseWallpaperName } from '../utils/dndUtils';
import usePageTitle from '../utils/usePageTitle';

import DndCard from '../components/DndCard';

const DndPage = () => {
  usePageTitle('From Serfs and Frauds');
  const [bgImage, setBgImage] = useState('');
  const { setBgImageName } = useContext(DndContext);

  useEffect(() => {
    const images = [
      '/images/dnd/wallies/artem-sapegin-XGDBdSQ70O0-unsplash.jpg',
      '/images/dnd/wallies/ember-navarro-3q2TzsUUVIo-unsplash.jpg',
      '/images/dnd/wallies/jr-korpa-RADGP_E2pBk-unsplash.jpg',
      '/images/dnd/wallies/muhammad-haikal-sjukri--RMBf_xSf2U-unsplash.jpg',
      '/images/dnd/wallies/vida-huang-XHiLiBfp7UM-unsplash.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  return (
    <div className="dnd-page-container">
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})` }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">Welcome to the</span>
          <br />
          <span>From Serfs and Frauds</span>
        </h1>
        <div className="dnd-cards-container">
          <DndCard
            title="Characters"
            description="Meet the heroes of our story."
            link="/dnd/characters"
          />
          <DndCard
            title="World Map"
            description="Explore the world of Aerthos."
            link="/dnd/world-map"
          />
          <DndCard
            title="Session Recaps"
            description="Catch up on the latest adventures."
            link="/dnd/session-recaps"
          />
        </div>
      </div>
    </div>
  );
};

export default DndPage;
