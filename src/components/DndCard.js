import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dnd.css';

const DndCard = ({ title, author, link, backgroundImage, className }) => {
  return (
    <Link to={link} className={`dnd-card ${className || ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h3>{title}</h3>
      {author && <p className="author-text">{author}</p>}
    </Link>
  );
};

export default DndCard;
