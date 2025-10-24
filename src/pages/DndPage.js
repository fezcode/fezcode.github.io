import React, { useState, useEffect, useContext } from 'react';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext';
import { parseWallpaperName } from '../utils/dndUtils';
import dndWallpapers from '../utils/dndWallpapers';
import usePageTitle from '../utils/usePageTitle';

import DndCard from '../components/DndCard';

const DndPage = () => {
  usePageTitle('From Serfs and Frauds');
  const [bgImage, setBgImage] = useState('');
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context

  useEffect(() => {
    const images = dndWallpapers;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
    setBreadcrumbs([
      { label: 'S&F', path: '/dnd' },
    ]);
  }, [setBgImageName, setBreadcrumbs]);

  return (
    <div className="dnd-page-container">
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})` }}>
        <h1 className="dnd-title-box">
          <span style={{ color: 'white' }}>Welcome to the</span>
          <br />
          <span>From Serfs and Frauds</span>
        </h1>
        <div className="dnd-cards-container">
          <DndCard
            title="Lore"
            description="Explore the world's history and tales."
            link="/dnd/lore"
            backgroundImage={`${process.env.PUBLIC_URL}/images/dnd/parchment.png`}
            className="dnd-card-parchment" // Add the new class
          />
        </div>
      </div>
    </div>
  );
};

export default DndPage;
