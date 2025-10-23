import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dnd.css';

const DndCard = ({ title, description, link }) => {
  return (
    <Link to={link} className="dnd-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default DndCard;
