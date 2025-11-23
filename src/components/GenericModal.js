import React, { useState, useEffect } from 'react';
import './ContactModal.css'; // Reusing the same CSS for animations
import { XIcon } from '@phosphor-icons/react';

const GenericModal = ({ isOpen, onClose, title, children }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Corresponds to animation duration
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`modal-overlay ${isOpen && !isClosing ? 'fade-in' : 'fade-out'}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${isOpen && !isClosing ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-xl font-playfairDisplay text-rose-400">{title}</h2>
          <button onClick={handleClose} className="close-button">
            <XIcon size={24} />
          </button>
        </div>
        <hr className="border-gray-500" />
        <div className="modal-body text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
