import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSnfV3 } from '../../context/SnfV3Context';
import '../../styles/snf-v3.css';

/** Shared root for /snf-v3: applies the `.snf3` scroll container + theme attrs. */
const SnfV3Root = ({ children, className = '' }) => {
  const { settings, scrollRef } = useSnfV3();
  const location = useLocation();
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, scrollRef]);

  return (
    <div
      ref={scrollRef}
      className={`snf3 ${className}`}
      data-snf3-theme={settings.theme}
      data-snf3-size={settings.size}
      data-snf3-typeface={settings.typeface}
    >
      {children}
    </div>
  );
};

export default SnfV3Root;
