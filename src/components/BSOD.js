import React, { useEffect } from 'react';

const BSOD = ({ isActive, toggleBSOD }) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = () => {
        toggleBSOD();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, toggleBSOD]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 bg-[#0000AA] text-white font-mono p-4 sm:p-10 z-[9999] text-base sm:text-xl overflow-hidden cursor-pointer select-none flex flex-col"
      onClick={toggleBSOD}
    >
      <p>A problem has been detected and Fezcodex has been shut down to prevent damage to your browser.</p>
      <br />
      <p className="mb-8 font-bold">FEZ_CODEX_FATAL_ERROR</p>
      <p>If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
      <br />
      <p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</p>
      <br />
      <p>If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing.</p>
      <br />
      <p>Technical Information:</p>
      <br />
      <p>*** STOP: 0x00000000 (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
      <br />
      <p className="mt-4">Beginning dump of physical memory...</p>
      <p>Physical memory dump complete.</p>
      <p>Contact your system administrator or technical support group for further assistance.</p>
      <div className="absolute bottom-10 left-4 sm:left-10 animate-pulse">
        Press any key to reboot...
      </div>
    </div>
  );
};

export default BSOD;
