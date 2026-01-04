import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import { CaretDown, Check } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const CustomDropdown = ({
  options,
  value,
  onChange,
  icon: Icon,
  label,
  className = '',
  variant = 'default',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the button
  const menuRef = useRef(null); // Ref for the dropdown menu
  const [dropdownMenuPosition, setDropdownMenuPosition] = useState({});

  const isBrutalist = variant === 'brutalist';
  const isPaper = variant === 'paper';

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
        className={`${
          isBrutalist
            ? 'bg-[#050505] border border-white/10 rounded-sm'
            : isPaper
              ? 'bg-[#e9e4d0] border-[#1a1a1a] rounded-sm'
              : 'bg-gray-800 border border-gray-700 rounded-md shadow-lg'
        } z-[1000] origin-top-left max-h-80 overflow-y-auto`}
        style={{
          position: 'absolute',
          top: dropdownMenuPosition.top,
          left: dropdownMenuPosition.left,
          minWidth: dropdownMenuPosition.width, // Set minWidth to button width
          width: 'max-content', // Allow content to determine width, but respect minWidth
        }}
      >
        <div className={isBrutalist || isPaper ? 'p-1' : 'py-1'}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left transition-colors ${
                isBrutalist
                  ? `text-xs font-mono uppercase tracking-widest ${
                      value === option.value
                        ? 'bg-white/10 text-emerald-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  : isPaper
                    ? `text-xs font-mono font-black uppercase tracking-widest ${
                        value === option.value
                          ? 'bg-[#1a1a1a] text-[#e9e4d0]'
                          : 'text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]'
                      }`
                    : `text-sm ${
                        value === option.value
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check
                  size={isBrutalist || isPaper ? 12 : 16}
                  className={
                    isBrutalist ? 'text-emerald-400' : isPaper ? 'text-[#e9e4d0]' : 'text-primary-400'
                  }
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>,
      document.body,
    );
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full block' : 'inline-block'} text-left ${className}`}>
      <button
        type="button"
        ref={dropdownRef} // Attach ref to the button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full gap-2 px-4 py-2 transition-all focus:outline-none ${
          isBrutalist
            ? 'bg-transparent border border-gray-800 rounded-sm text-xs font-mono uppercase tracking-widest text-gray-400 hover:border-gray-600 hover:text-white'
            : isPaper
              ? 'bg-transparent border border-[#1a1a1a] rounded-sm text-xs font-mono font-black uppercase tracking-widest text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]'
              : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm font-medium text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500'
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={isBrutalist || isPaper ? 16 : 20}
              className={isBrutalist ? 'text-emerald-500' : isPaper ? 'text-[#1a1a1a]' : 'text-gray-400'}
            />
          )}
          <span>{selectedOption ? selectedOption.label : label}</span>
        </div>
        <CaretDown
          size={isBrutalist || isPaper ? 12 : 16}
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {renderDropdownMenu()}
    </div>
  );
};

export default CustomDropdown;
