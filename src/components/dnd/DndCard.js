import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dnd.css';

const DndCard = ({
  title,
  author,
  link,
  backgroundImage,
  className,
  overlayColor,
}) => {
  return (
    <Link
      to={link}
      className={`dnd-card ${className || ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        position: 'relative',
      }}
    >
      {overlayColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overlayColor,
            opacity: 0.1,
            zIndex: 1,
            borderRadius: '10px', // Match card border-radius
          }}
        ></div>
      )}
      <h3 style={{ zIndex: 2 }}>{title}</h3>
      {author && (
        <p className="author-text" style={{ zIndex: 2 }}>
          {author}
        </p>
      )}
    </Link>
  );
};

export default DndCard;
