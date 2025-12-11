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
      className="fixed inset-0 bg-[#0000AA] text-[#C0C0C0] font-mono p-4 sm:p-20 z-[9999] text-base sm:text-2xl leading-snug overflow-hidden cursor-pointer select-none flex flex-col justify-center items-center"
      onClick={toggleBSOD}
    >
      <div className="max-w-4xl w-full text-center sm:text-left">
        <span className="bg-[#C0C0C0] text-[#0000AA] inline-block px-2 mb-8 font-bold text-lg sm:text-xl">
          FEZCODEX
        </span>
        <p>
          A fatal exception 0xFEZ has occurred at 0028:C0DE1337 in VXD VMM(01) +
          00010E36. The current application will be terminated.
        </p>

        <p className="mt-8">
          A problem has been detected and Fezcodex has been shut down to prevent
          damage to your browser.
        </p>

        <p className="mt-4">
          If this is the first time you've seen this stop error screen, restart
          your computer. If this screen appears again, follow these steps:
        </p>

        <ul className="list-none mt-4 space-y-2">
          <li>
            * Check to make sure any new hardware or software is properly
            installed.
          </li>
          <li>
            * If problems continue, disable or remove any newly installed
            hardware or software.
          </li>
          <li>* Disable BIOS memory options such as caching or shadowing.</li>
        </ul>

        <p className="mt-8">Technical Information:</p>
        <p>
          *** STOP: 0x00000000 (0x00000000, 0x00000000, 0x00000000, 0x00000000)
        </p>

        <p className="mt-16 text-center animate-pulse">
          Press any key to continue_
        </p>
      </div>
    </div>
  );
};

export default BSOD;
