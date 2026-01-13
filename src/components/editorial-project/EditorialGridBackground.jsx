import React from 'react';

const EditorialGridBackground = () => {
  return (
    <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <svg
        className="w-full h-full opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 2455 3344"
      >
        <line className="stroke-white/10" x1="100.6059" y1="0" x2="100.6059" y2="3344" strokeWidth="1" />
        <line className="stroke-white/10" x1="664.3046" y1="0" x2="664.3046" y2="3344" strokeWidth="1" />
        <line className="stroke-white/10" x1="1228.0033" y1="0" x2="1228.0033" y2="3344" strokeWidth="1" />
        <line className="stroke-white/10" x1="1603.4669" y1="0" x2="1603.4669" y2="3344" strokeWidth="1" />
        <line className="stroke-white/10" x1="1978.9305" y1="0" x2="1978.9305" y2="3344" strokeWidth="1" />
        <line className="stroke-white/10" x1="2354.3941" y1="0" x2="2354.3941" y2="3344" strokeWidth="1" />
      </svg>
            {/* Background Image Overlay */}
            <img
              src="/images/bg/tim_simon.jpg"
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover mix-blend-normal opacity-40"
              style={{ maskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)' }}
            />    </div>
  );
};

export default EditorialGridBackground;
