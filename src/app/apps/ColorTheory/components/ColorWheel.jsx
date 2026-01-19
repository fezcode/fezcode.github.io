import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hslToHex, hslToRgb } from '../utils/colorUtils';

const ColorWheel = () => {
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState({ h: 0, s: 100, l: 50 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Draw Color Wheel
    for (let i = 0; i < 360; i++) {
      const startAngle = (i * Math.PI) / 180;
      const endAngle = ((i + 1) * Math.PI) / 180;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'hsl(0, 0%, 50%)'); // Center is Gray (S=0, L=50)
      gradient.addColorStop(1, `hsl(${i}, 100%, 50%)`); // Edge is Pure Color (S=100, L=50)

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, []);

  const handleInteraction = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    // Calculate saturation based on distance from center
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(centerX, centerY) - 10;
    let saturation = (distance / radius) * 100;
    if (saturation > 100) saturation = 100;

    setSelectedColor(prev => ({ ...prev, h: Math.round(angle), s: Math.round(saturation) }));
  };

  const hex = hslToHex(selectedColor.h, selectedColor.s, selectedColor.l);
  const rgb = hslToRgb(selectedColor.h, selectedColor.s, selectedColor.l);

    return (

      <div className="flex flex-col xl:flex-row gap-12 items-center justify-center p-8 min-h-full font-nunito">

        {/* Canvas Area */}

        <div className="relative group">

          <div className="absolute inset-0 rounded-full border-4 border-[#1a1a1a] translate-x-2 translate-y-2 bg-[#1a1a1a]" />

          <canvas

            ref={canvasRef}

            width={400}

            height={400}

            className="relative rounded-full cursor-crosshair border-4 border-[#1a1a1a] bg-white z-10"

            onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}

            onMouseMove={(e) => { if (isDragging) handleInteraction(e); }}

            onMouseUp={() => setIsDragging(false)}

            onMouseLeave={() => setIsDragging(false)}

            onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}

            onTouchMove={(e) => { if (isDragging) handleInteraction(e); }}

            onTouchEnd={() => setIsDragging(false)}

          />

          {/* Selector Indicator */}

          <div

              className="absolute w-8 h-8 border-4 border-white rounded-full pointer-events-none shadow-[0px_4px_8px_rgba(0,0,0,0.3)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 z-20"

              style={{

                  left: `calc(50% + ${Math.cos(selectedColor.h * Math.PI / 180) * (selectedColor.s / 100 * 190)}px)`,

                  top: `calc(50% + ${Math.sin(selectedColor.h * Math.PI / 180) * (selectedColor.s / 100 * 190)}px)`,

                  backgroundColor: hex

              }}

          />

        </div>

        <div className="flex-1 w-full max-w-md space-y-6">

                  <motion.div

                      layout

                      className="p-6 rounded-2xl bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a]"

                  >

                      <h2 className="text-3xl font-normal mb-6 flex items-center gap-4 font-instr-serif text-[#1a1a1a]">

                          <span className="w-12 h-12 rounded-full border-2 border-[#1a1a1a]" style={{ backgroundColor: hex }}></span>

                          Selected Color

                      </h2>

              <div className="space-y-4 font-mono text-sm">

                  <div className="flex justify-between items-center p-3 border-2 border-[#1a1a1a] rounded-lg bg-[#f4f4f0]">

                      <span className="font-bold text-[#666]">HEX</span>

                      <span className="text-xl font-bold text-[#1a1a1a] selectable">{hex.toUpperCase()}</span>

                  </div>

                  <div className="flex justify-between items-center p-3 border-2 border-[#1a1a1a] rounded-lg bg-[#f4f4f0]">

                      <span className="font-bold text-[#666]">RGB</span>

                      <span className="text-lg font-bold text-[#1a1a1a]">{rgb.r}, {rgb.g}, {rgb.b}</span>

                  </div>

                  <div className="flex justify-between items-center p-3 border-2 border-[#1a1a1a] rounded-lg bg-[#f4f4f0]">

                      <span className="font-bold text-[#666]">HSL</span>

                      <span className="text-lg font-bold text-[#1a1a1a]">{selectedColor.h}°, {selectedColor.s}%, {selectedColor.l}%</span>

                  </div>

              </div>

          </motion.div>

          <div className="p-6 rounded-2xl bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a]">

              <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-widest mb-4">Tints & Shades</h3>

              <div className="space-y-2">

                  <div className="flex rounded-lg overflow-hidden h-16 border-2 border-[#1a1a1a]">

                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(lightness => (

                          <div

                              key={`l-${lightness}`}

                              className="flex-1 hover:flex-[2] transition-all duration-300 relative group cursor-pointer"

                              style={{ backgroundColor: `hsl(${selectedColor.h}, ${selectedColor.s}%, ${lightness}%)` }}

                              onClick={() => setSelectedColor(prev => ({ ...prev, l: lightness }))}

                          >

                          </div>

                      ))}

                  </div>

                  <p className="text-xs text-center text-[#666] mt-2 font-bold font-mono">Click stripe to set lightness</p>

              </div>

          </div>

        </div>

      </div>

    );
};

export default ColorWheel;
