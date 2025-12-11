import React from 'react';

const GrainOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {/* Noise Texture */}
    <div
      className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}
    />

    {/* Subtle Dirt Specks (Randomly positioned using gradients) */}
    <div
      className="absolute inset-0 opacity-20 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:400px_400px]"/>
    <div
      className="absolute inset-0 opacity-10 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:600px_600px] [background-position:100px_100px]"/>

    {/* Vignette for old paper look */}
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(60,50,40,0.1)_100%)] mix-blend-multiply"/>
  </div>
);

export default GrainOverlay;
