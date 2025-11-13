import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/dnd.css';
import useSeo from "../../hooks/useSeo";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

function DndAuthorsPage() {
  useSeo({
    title: 'Authors | From Serfs and Frauds',
    description: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'authors'],
    ogTitle: 'Authors | From Serfs and Frauds',
    ogDescription: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Authors | From Serfs and Frauds',
    twitterDescription: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="dnd-page-container"
    >
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/stories/border-large.jpg)` }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">Authors</span>
        </h1>
        <div className="dnd-content-box" style={{ zIndex: 1 }}>
          <p>This is the Authors page. Details about authors will be displayed here.</p>
        </div>
      </div>
    </motion.div>
  );
}

export default DndAuthorsPage;
