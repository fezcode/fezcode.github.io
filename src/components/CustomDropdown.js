import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import { CaretDown, Check } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({
  options,
  value,
  onChange,
  icon: Icon,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the button
  const menuRef = useRef(null); // Ref for the dropdown menu
  const [dropdownMenuPosition, setDropdownMenuPosition] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideButton =
        dropdownRef.current && dropdownRef.current.contains(event.target);
      const isClickInsideMenu =
        menuRef.current && menuRef.current.contains(event.target);

      if (!isClickInsideButton && !isClickInsideMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownMenuPosition({
        top: rect.bottom + window.scrollY + 8, // 8px for mt-2
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  // Render the dropdown menu (options list) using a Portal
  const renderDropdownMenu = () => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 origin-top-left max-h-80 overflow-y-auto" // Added max-h-80 and overflow-y-auto
        style={{
          position: 'absolute',
          top: dropdownMenuPosition.top,
          left: dropdownMenuPosition.left,
          minWidth: dropdownMenuPosition.width, // Set minWidth to button width
          width: 'max-content', // Allow content to determine width, but respect minWidth
        }}
      >
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors ${
                value === option.value
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check size={16} className="text-primary-400" />
              )}
            </button>
          ))}
        </div>
      </motion.div>,
      document.body,
    );
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        ref={dropdownRef} // Attach ref to the button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={20} className="text-gray-400" />}
          <span>{selectedOption ? selectedOption.label : label}</span>
        </div>
        <CaretDown
          size={16}
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {renderDropdownMenu()}
    </div>
  );
};

export default CustomDropdown;
