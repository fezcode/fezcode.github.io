import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hslToHex } from '../utils/colorUtils';

const HarmonyExplorer = () => {
  const [baseHue, setBaseHue] = useState(0);
  const [harmonyType, setHarmonyType] = useState('complementary');

  const getHarmonies = (h, type) => {
    switch (type) {
      case 'complementary':
        return [h, (h + 180) % 360];
      case 'analogous':
        return [(h - 30 + 360) % 360, h, (h + 30) % 360];
      case 'triadic':
        return [h, (h + 120) % 360, (h + 240) % 360];
      case 'split-complementary':
        return [h, (h + 150) % 360, (h + 210) % 360];
      case 'tetradic':
        return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
      case 'monochromatic':
        // For monochromatic we vary lightness, not hue, handled separately in render
        return [h, h, h, h];
      default:
        return [h];
    }
  };

  const harmonies = getHarmonies(baseHue, harmonyType);

  return (
    <div className="p-8 min-h-full flex flex-col items-center font-nunito bg-[#f4f4f0]">
      <div className="w-full max-w-5xl space-y-12">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between bg-white p-8 rounded-3xl border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a]">
          <div className="flex-1 w-full">
             <label className="block text-sm font-black text-[#1a1a1a] uppercase tracking-wider mb-4">Base Hue: <span className="bg-[#1a1a1a] text-white px-2 py-1 rounded-md">{baseHue}°</span></label>
             <input
                type="range"
                min="0"
                max="360"
                value={baseHue}
                onChange={(e) => setBaseHue(parseInt(e.target.value))}
                className="w-full h-6 rounded-full appearance-none cursor-pointer border-2 border-[#1a1a1a]"
                style={{
                    background: `linear-gradient(to right, 
                        hsl(0, 100%, 50%), 
                        hsl(60, 100%, 50%), 
                        hsl(120, 100%, 50%), 
                        hsl(180, 100%, 50%), 
                        hsl(240, 100%, 50%), 
                        hsl(300, 100%, 50%), 
                        hsl(360, 100%, 50%)
                    )`
                }}
             />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-black text-[#1a1a1a] uppercase tracking-wider mb-4">Harmony Rule</label>
            <div className="flex flex-wrap gap-2">
                {['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'monochromatic'].map(type => (
                    <button
                        key={type}
                        onClick={() => setHarmonyType(type)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 border-[#1a1a1a] transition-all 
                        ${harmonyType === type
                            ? 'bg-[#1a1a1a] text-white shadow-[4px_4px_0px_0px_#666]'
                            : 'bg-white text-[#1a1a1a] hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_#1a1a1a]'}`}
                    >
                        {type.replace('-', ' ')}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-80">
           {harmonyType === 'monochromatic' ? (
                // Special render for monochromatic (varying lightness)
                [20, 40, 60, 80].map((lightness, i) => {
                     const hex = hslToHex(baseHue, 80, lightness);
                     return (
                        <motion.div
                            layout
                            key={i}
                            className="h-full rounded-2xl border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col items-center justify-center relative group overflow-hidden"
                            style={{ backgroundColor: hex }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                             <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-[#1a1a1a] font-mono font-bold border-2 border-[#1a1a1a] bg-white px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#1a1a1a]">{hex.toUpperCase()}</span>
                             </div>
                        </motion.div>
                     )
                })
           ) : (
               harmonies.map((hue, i) => {
                    const hex = hslToHex(hue, 80, 50);
                    return (
                        <motion.div
                            layout
                            key={`${hue}-${i}`}
                            className="h-full rounded-2xl border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col items-center justify-center relative group overflow-hidden"
                            style={{ backgroundColor: hex }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                            <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-[#1a1a1a] font-mono font-bold border-2 border-[#1a1a1a] bg-white px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#1a1a1a]">{hex.toUpperCase()}</span>
                            </div>
                        </motion.div>
                    );
               })
           )}
        </div>

        {/* Explanation */}
        <div className="p-8 rounded-3xl bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a]">
            <h3 className="text-2xl font-normal mb-4 text-[#1a1a1a] font-instr-serif">How it works</h3>
            <p className="text-[#333] text-lg leading-relaxed font-medium">
                {harmonyType === 'complementary' && "Complementary colors are opposite each other on the color wheel. They create the strongest contrast and visual tension."}
                {harmonyType === 'analogous' && "Analogous colors are next to each other on the wheel. They usually match well and create serene and comfortable designs."}
                {harmonyType === 'triadic' && "Triadic color schemes use colors that are evenly spaced around the color wheel. They tend to be quite vibrant, even if you use pale or unsaturated versions of your hues."}
                {harmonyType === 'split-complementary' && "The split-complementary color scheme is a variation of the complementary color scheme. In addition to the base color, it uses the two colors adjacent to its complement."}
                {harmonyType === 'tetradic' && "The tetradic (rectangle) color scheme uses four colors arranged into two complementary pairs. This rich color scheme offers plenty of possibilities for variation."}
                {harmonyType === 'monochromatic' && "Monochromatic color schemes are derived from a single base hue and extended using its shades, tones and tints."}
            </p>
        </div>

      </div>
    </div>
  );
};

export default HarmonyExplorer;
