import React from 'react';
import { motion } from 'framer-motion';
import usePageTitle from '../utils/usePageTitle';
import '../styles/dnd.css'; // Assuming D&D styling is desired

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

function DndNotFoundPage() {
  usePageTitle('404 - Page Not Found (D&D)');

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="dnd-page-container" // Use D&D styling
    >
      <div className="dnd-hero" style={{ backgroundColor: 'rgb(255, 142, 142)', position: 'relative' }}> {/* Adjust height for 404 */}
        <img
          src={`${process.env.PUBLIC_URL}/images/dnd/dragon-left.png`}
          alt="Dragon Left"
          style={{ position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)', width: '400px', zIndex: 1 }}
        />
        <img
          src={`${process.env.PUBLIC_URL}/images/dnd/dragon-left.png`}
          alt="Dragon Right Symmetrical"
          style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%) scaleX(-1)', width: '400px', zIndex: 1 }}
        />
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">404</span>
          <br />
          <span>Lost in the Dungeon!</span>
        </h1>
        <p className="dnd-hero-title-white" style={{ position: 'relative', zIndex: 1 }}>
          The page you are looking for does not exist in this realm.
        </p>
        <p className="dnd-hero-title-white" style={{ position: 'relative', zIndex: 1 }}>
          Perhaps you took a wrong turn at the last crossroads.
        </p>
      </div>
    </motion.div>
  );
}

export default DndNotFoundPage;
