import React, {useState, useEffect} from 'react';
import {XIcon, WarningCircle} from '@phosphor-icons/react';
import './ContactModal.css'; // Reuse existing animations

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleConfirmAction = () => {
    onConfirm();
    handleClose();
  };

  if (!isOpen) return null;

  return (<div
    className={`modal-overlay z-50 ${isOpen && !isClosing ? 'fade-in' : 'fade-out'}`}
    onClick={handleClose}
  >
    <div
      className={`modal-content bg-gray-900 border border-gray-700 shadow-2xl rounded-lg max-w-md w-full mx-4 p-0 overflow-hidden ${isOpen && !isClosing ? 'slide-up' : 'slide-down'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <WarningCircle size={24} className={isDanger ? "text-red-400" : "text-yellow-400"}/>
          <h2 className="text-lg font-bold text-gray-100 font-sans">{title}</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
          <XIcon size={20}/>
        </button>
      </div>

      <div className="p-6">
        <p className="text-gray-300 text-base leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex justify-end gap-3 p-4 bg-gray-800/30 border-t border-gray-700">
        <button
          onClick={handleClose}
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirmAction}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors shadow-sm ${isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>);
};

export default ConfirmationModal;
