import React from 'react';

const CustomToggle = ({ id, checked, onChange, label, disabled }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <label
        htmlFor={id}
        className={`text-lg cursor-pointer ${disabled ? 'text-gray-500' : 'text-white'}`}
      >
        {label}
      </label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ></div>
      </label>
    </div>
  );
};

export default CustomToggle;
