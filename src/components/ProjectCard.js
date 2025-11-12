import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Dot from './Dot'; // Import the Dot component

const ProjectCard = ({ project, size = 1 }) => {
  const colSpanClass =
    size === 2 ? 'md:col-span-2' : size === 3 ? 'md:col-span-3' : 'col-span-1';

  const [dots, setDots] = useState([]);
  const cardRef = useRef(null);
  const dotIdRef = useRef(0);

  const handleAnimationEnd = useCallback((id) => {
    setDots((prevDots) => prevDots.filter((dot) => dot.id !== id));
  }, []);

  useEffect(() => {
    const spawnDot = () => {
      if (cardRef.current && dots.length < 20) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const newDot = {
          id: dotIdRef.current++,
          size: Math.floor(Math.random() * 5) + 3,
          color: `hsl(0, ${Math.floor(Math.random() * 30) + 70}%, ${Math.floor(Math.random() * 20) + 60}%)`, // Tones of red
          initialX: Math.random() * cardRect.width,
          initialY: -5, // Start slightly off-screen top
          animationDuration: Math.random() * 3 + 2, // Duration between 2 and 5 seconds
        };
        setDots((prevDots) => [...prevDots, newDot]);
      }
    };

    const interval = setInterval(spawnDot, 500); // Spawn a new dot every 0.5 seconds

    return () => clearInterval(interval);
  }, [dots.length]);

  return (
    <div
      ref={cardRef}
      className={`block bg-gray-500/10 p-6 rounded-lg shadow-lg hover:bg-gray-500/20 transition-colors border border-gray-700/50 cursor-pointer flex flex-col relative overflow-hidden ${colSpanClass}`}
    >
      {dots.map((dot) => (
        <Dot
          key={dot.id}
          id={dot.id}
          size={dot.size}
          color={dot.color}
          initialX={dot.initialX}
          initialY={dot.initialY}
          animationDuration={dot.animationDuration}
          onAnimationEnd={handleAnimationEnd}
        />
      ))}
      <Link to={`/projects/${project.slug}`} className="flex flex-col flex-grow relative z-10">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-2 text-gray-400 flex-grow">{project.description}</p>
      </Link>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-red-500 hover:text-red-300 transition-colors mt-auto flex items-center relative z-10"
        >
          View Project <FaExternalLinkAlt className="ml-1" size={12} />
        </a>
      )}
    </div>
  );
};

export default ProjectCard;
