import React, { useState, useEffect, useContext } from 'react';
import '../../styles/dnd.css';
import { DndContext } from '../../context/DndContext';
import { parseWallpaperName } from '../../utils/dndUtils';
import dndWallpapers from '../../utils/dndWallpapers';
import DndCard from '../../components/dnd/DndCard';
import useSeo from "../../hooks/useSeo";

const DndPage = () => {
  useSeo({
    title: 'From Serfs and Frauds | Fezcodex',
    description: 'Welcome to the world of From Serfs and Frauds, a Dungeons & Dragons campaign.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'campaign'],
    ogTitle: 'From Serfs and Frauds | Fezcodex',
    ogDescription: 'Welcome to the world of From Serfs and Frauds, a Dungeons & Dragons campaign.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'From Serfs and Frauds | Fezcodex',
    twitterDescription: 'Welcome to the world of From Serfs and Frauds, a Dungeons & Dragons campaign.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [bgImage, setBgImage] = useState('');
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context

  useEffect(() => {
    const images = dndWallpapers;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
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
            link="/stories/lore"
            backgroundImage={`${process.env.PUBLIC_URL}/images/stories/parchment.png`}
            className="dnd-card-parchment" // Add the new class
          />
          <DndCard
            title="Authors"
            description="Meet the creators of the tales."
            link="/stories/authors"
            backgroundImage={`${process.env.PUBLIC_URL}/images/stories/parchment.png`}
            className="dnd-card-parchment"
          />
        </div>
      </div>
    </div>
  );
};

export default DndPage;
