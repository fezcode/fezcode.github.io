import React from 'react';
import './ContactModal.css';
import {X, Envelope, LinkedinLogo, TwitterLogo} from '@phosphor-icons/react';

const colorizeText = (text) => {
  return text.split(' ').map((word, index) => {
    if (index % 2 === 1) {
      return <span key={index} className="red-text text-lg font-normal tracking-tight">{word} </span>;
    } else {
      return <span key={index} className="text-lg font-normal tracking-tight">{word} </span>;
    }
  });
};

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{colorizeText('Contact Me')}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p className="text-lg font-normal tracking-tight">{colorizeText('You can reach me at:')}</p>
          <div className="contact-links">
            <a href="mailto:samil.bulbul@gmail.com" className="contact-link">
              <Envelope size={24} />
              <span>{colorizeText('samil.bulbul at gmail.com')}</span>
            </a>
            <a href="https://tr.linkedin.com/in/ahmed-samil-bulbul" target="_blank" rel="noopener noreferrer" className="contact-link">
              <LinkedinLogo size={24} />
              <span>{colorizeText('LinkedIn')}</span>
            </a>
            <a href="https://x.com/fezcoddy" target="_blank" rel="noopener noreferrer" className="contact-link">
              <TwitterLogo size={24} />
              <span>{colorizeText('Twitter (x.com)')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
