import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [dropdownMenuPosition, setDropdownMenuPosition] = useState({});

  const isBrutalist = variant === 'brutalist';
  const isPaper = variant === 'paper';
  const isTerracotta = variant === 'terracotta';

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
        top: rect.bottom + window.scrollY + 8,
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
              : isTerracotta
                ? 'bg-[#F3ECE0] border border-[#1A161320] shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)]'
                : 'bg-gray-800 border border-gray-700 rounded-md shadow-lg'
        } z-[1000] origin-top-left max-h-80 overflow-y-auto`}
        style={{
          position: 'absolute',
          top: dropdownMenuPosition.top,
          left: dropdownMenuPosition.left,
          minWidth: dropdownMenuPosition.width,
          width: 'max-content',
        }}
      >
        <div
          className={isBrutalist || isPaper || isTerracotta ? 'p-1' : 'py-1'}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center justify-between w-full px-4 py-2 text-left transition-colors ${
                  isBrutalist
                    ? `text-xs font-mono uppercase tracking-widest ${
                        isSelected
                          ? 'bg-white/10 text-emerald-400'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    : isPaper
                      ? `text-xs font-mono font-black uppercase tracking-widest ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-[#e9e4d0]'
                            : 'text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]'
                        }`
                      : isTerracotta
                        ? `font-fraunces text-[15px] tracking-tight ${
                            isSelected
                              ? 'bg-[#E8DECE] text-[#9E4A2F] italic'
                              : 'text-[#1A1613] hover:bg-[#E8DECE]/60 hover:italic'
                          }`
                        : `text-sm ${
                            isSelected
                              ? 'bg-primary-500/10 text-primary-400'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                }`}
                style={
                  isTerracotta
                    ? {
                        fontVariationSettings: isSelected
                          ? '"opsz" 18, "SOFT" 80, "WONK" 1, "wght" 440'
                          : '"opsz" 18, "SOFT" 30, "WONK" 0, "wght" 420',
                      }
                    : undefined
                }
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check
                    size={isBrutalist || isPaper || isTerracotta ? 12 : 16}
                    className={
                      isBrutalist
                        ? 'text-emerald-400'
                        : isPaper
                          ? 'text-[#e9e4d0]'
                          : isTerracotta
                            ? 'text-[#C96442]'
                            : 'text-primary-400'
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>,
      document.body,
    );
  };

  return (
    <div
      className={`relative ${fullWidth ? 'w-full block' : 'inline-block'} text-left ${className}`}
    >
      <button
        type="button"
        ref={dropdownRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full gap-2 px-4 py-2 transition-all focus:outline-none ${
          isBrutalist
            ? 'bg-transparent border border-gray-800 rounded-sm text-xs font-mono uppercase tracking-widest text-gray-400 hover:border-gray-600 hover:text-white'
            : isPaper
              ? 'bg-transparent border border-[#1a1a1a] rounded-sm text-xs font-mono font-black uppercase tracking-widest text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]'
              : isTerracotta
                ? 'bg-[#F3ECE0] border border-[#1A161320] text-[#1A1613] font-fraunces italic text-[15px] hover:border-[#1A1613] hover:bg-[#E8DECE]/50'
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm font-medium text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500'
        }`}
        style={
          isTerracotta
            ? {
                fontVariationSettings:
                  '"opsz" 18, "SOFT" 80, "WONK" 1, "wght" 420',
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={isBrutalist || isPaper || isTerracotta ? 16 : 20}
              className={
                isBrutalist
                  ? 'text-emerald-500'
                  : isPaper
                    ? 'text-[#1a1a1a]'
                    : isTerracotta
                      ? 'text-[#C96442]'
                      : 'text-gray-400'
              }
            />
          )}
          <span>{selectedOption ? selectedOption.label : label}</span>
        </div>
        <CaretDown
          size={isBrutalist || isPaper || isTerracotta ? 12 : 16}
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isTerracotta ? 'text-[#9E4A2F]' : ''
          }`}
        />
      </button>

      {renderDropdownMenu()}
    </div>
  );
};

export default CustomDropdown;
