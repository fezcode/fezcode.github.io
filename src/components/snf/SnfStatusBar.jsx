import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSnf } from '../../context/SnfContext';

const SnfStatusBar = () => {
  const location = useLocation();
  const { settings, language } = useSnf();
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const path = location.pathname.replace('/snf', '/snf') || '/snf';

  return (
    <footer className="snf-statusbar relative z-[80] px-3 md:px-5 py-1.5 flex items-center justify-between snf-mono text-[10px] tracking-[0.14em]">
      <div className="flex items-center gap-3 min-w-0">
        <span className="snf-rec flex-none" aria-hidden />
        <span className="snf-phos-text">REC</span>
        <span className="snf-divider w-5 hidden sm:block" />
        <span className="snf-dim truncate">
          {language === 'tr' ? 'YOL' : 'PATH'}: {path}
        </span>
      </div>
      <div className="flex items-center gap-3 md:gap-5 flex-none">
        <span className="snf-dim hidden sm:inline">
          CRT::{settings.crt.toUpperCase()}
        </span>
        <span className="snf-dim hidden md:inline">
          {language === 'tr' ? 'AĞ' : 'LINK'}::SECURE
        </span>
        <span className="snf-phos-text snf-glow-soft tabular-nums">{clock}</span>
      </div>
    </footer>
  );
};

export default SnfStatusBar;
