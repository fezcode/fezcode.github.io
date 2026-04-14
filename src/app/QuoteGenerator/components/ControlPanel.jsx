import React from 'react';
import {
  TextTIcon,
  PaletteIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  QuotesIcon,
} from '@phosphor-icons/react';
import CustomSlider from '../../../components/CustomSlider';
import CustomColorPicker from '../../../components/CustomColorPicker';
import CustomDropdown from '../../../components/CustomDropdown';

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Courier New', label: 'Courier New (Typewriter)' },
  { value: 'Cinzel', label: 'Cinzel (Fantasy)' },
  { value: 'Impact', label: 'Impact (Meme)' },
  { value: 'Caveat', label: 'Caveat (Handwritten)' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'UnifrakturMaguntia', label: 'UnifrakturMaguntia (Old English)' },
];

const THEME_PRESETS = [
  {
    name: 'Modern',
    config: {
      fontFamily: 'Inter',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontWeight: 800,
      themeType: 'standard',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Typewriter',
    config: {
      fontFamily: 'Courier New',
      backgroundColor: '#f4f4f0',
      textColor: '#333333',
      fontWeight: 400,
      themeType: 'typewriter',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Genius',
    config: {
      fontFamily: 'Inter',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      fontWeight: 900,
      themeType: 'standard',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Pastoral',
    config: {
      fontFamily: 'Playfair Display',
      backgroundColor: '#e3dcd2',
      textColor: '#2c3e50',
      fontWeight: 500,
      themeType: 'standard',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Highlighted',
    config: {
      fontFamily: 'Oswald',
      backgroundColor: '#ffffff', // In WordBox mode, this is Text Color (inverted logic in render)
      textColor: '#000000', // This is Box Color
      fontWeight: 700,
      themeType: 'wordbox',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Newspaper',
    config: {
      fontFamily: 'Playfair Display', // Legible serif for body
      backgroundColor: '#fdf6e3', // Aged paper
      textColor: '#1a1a1a', // Dark grey ink
      fontWeight: 700,
      themeType: 'newspaper',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Minimalist',
    config: {
      fontFamily: 'Inter',
      backgroundColor: '#f8f9fa',
      textColor: '#343a40',
      fontWeight: 400,
      themeType: 'standard',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Neon Nights',
    config: {
      fontFamily: 'Space Mono',
      backgroundColor: '#0a0a0a',
      textColor: '#00ffcc',
      fontWeight: 700,
      themeType: 'neon',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Polaroid',
    config: {
      fontFamily: 'Caveat',
      backgroundColor: '#222222', // Photo background if no image
      textColor: '#111111', // Text color on white polaroid frame
      fontWeight: 700,
      themeType: 'polaroid',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Brutalism',
    config: {
      fontFamily: 'Impact',
      backgroundColor: '#ff3366',
      textColor: '#ffffff',
      fontWeight: 900,
      themeType: 'brutalist',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Cinematic',
    config: {
      fontFamily: 'Cinzel',
      backgroundColor: '#050505',
      textColor: '#e5e5e5',
      fontWeight: 400,
      themeType: 'standard',
      textAlign: 'center',
      overlayOpacity: 0.3,
    },
  },
  {
    name: 'Rome',
    config: {
      fontFamily: 'Cinzel',
      backgroundType: 'radial',
      gradientColor1: '#ffffff',
      gradientColor2: '#d4c5b9',
      textColor: '#3b2f2f',
      fontWeight: 700,
      themeType: 'rome',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Science',
    config: {
      fontFamily: 'Space Mono',
      backgroundType: 'solid',
      backgroundColor: '#02040a',
      textColor: '#00ff41',
      fontWeight: 400,
      themeType: 'science',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Drama',
    config: {
      fontFamily: 'Playfair Display',
      backgroundType: 'solid',
      backgroundColor: '#000000',
      textColor: '#ff0033',
      fontWeight: 900,
      themeType: 'wordbox',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Comedy',
    config: {
      fontFamily: 'Caveat',
      backgroundType: 'linear',
      gradientColor1: '#ffeb3b',
      gradientColor2: '#ff9800',
      gradientAngle: 45,
      textColor: '#000000',
      fontWeight: 700,
      themeType: 'standard',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Life',
    config: {
      fontFamily: 'Montserrat',
      backgroundType: 'radial',
      gradientColor1: '#a8e063',
      gradientColor2: '#56ab2f',
      textColor: '#ffffff',
      fontWeight: 800,
      themeType: 'standard',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Birds',
    config: {
      fontFamily: 'Inter',
      backgroundType: 'linear',
      gradientColor1: '#87ceeb',
      gradientColor2: '#e0f6ff',
      gradientAngle: 180,
      textColor: '#1a4f66',
      fontWeight: 400,
      themeType: 'birds',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Kings & Queens',
    config: {
      fontFamily: 'UnifrakturMaguntia',
      backgroundType: 'solid',
      backgroundColor: '#2e0b3c',
      textColor: '#ffd700',
      fontWeight: 400,
      themeType: 'kings',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'French Girl',
    config: {
      fontFamily: 'Caveat',
      backgroundType: 'solid',
      backgroundColor: '#f5efe6',
      textColor: '#3e3e3e',
      fontWeight: 700,
      themeType: 'french-girl',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'CIA',
    config: {
      fontFamily: 'Courier New',
      backgroundType: 'solid',
      backgroundColor: '#e6e6e6',
      textColor: '#1a1a1a',
      fontWeight: 800,
      themeType: 'cia',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'FBI',
    config: {
      fontFamily: 'Impact',
      backgroundType: 'solid',
      backgroundColor: '#0a1b3f',
      textColor: '#f1c40f',
      fontWeight: 400,
      themeType: 'fbi',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Espionage',
    config: {
      fontFamily: 'Space Mono',
      backgroundType: 'radial',
      gradientColor1: '#1a1a1a',
      gradientColor2: '#000000',
      textColor: '#ffb300',
      fontWeight: 400,
      themeType: 'espionage',
      textAlign: 'left',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Control Panel',
    config: {
      fontFamily: 'Inter',
      backgroundType: 'linear',
      gradientColor1: '#2c3e50',
      gradientColor2: '#3498db',
      gradientAngle: 90,
      textColor: '#ffffff',
      fontWeight: 700,
      themeType: 'control-panel',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Basketball',
    config: {
      fontFamily: 'Oswald',
      backgroundType: 'radial',
      gradientColor1: '#ff8c00',
      gradientColor2: '#d35400',
      textColor: '#ffffff',
      fontWeight: 700,
      themeType: 'basketball',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Football',
    config: {
      fontFamily: 'Impact',
      backgroundType: 'solid',
      backgroundColor: '#2ecc71',
      textColor: '#ffffff',
      fontWeight: 400,
      themeType: 'football',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'River',
    config: {
      fontFamily: 'Caveat',
      backgroundType: 'linear',
      gradientColor1: '#2980b9',
      gradientColor2: '#6dd5fa',
      gradientAngle: 180,
      textColor: '#ffffff',
      fontWeight: 700,
      themeType: 'river',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Mountain',
    config: {
      fontFamily: 'Cinzel',
      backgroundType: 'linear',
      gradientColor1: '#bdc3c7',
      gradientColor2: '#2c3e50',
      gradientAngle: 180,
      textColor: '#ffffff',
      fontWeight: 700,
      themeType: 'mountain',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    name: 'Cats',
    config: {
      fontFamily: 'Caveat',
      backgroundType: 'solid',
      backgroundColor: '#ffb6c1',
      textColor: '#4a148c',
      fontWeight: 700,
      themeType: 'cats',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
];

const ControlPanel = ({ state, updateState }) => {
  const handleChange = (key, value) => {
    updateState({ [key]: value });
  };

  const applyPreset = (preset) => {
    updateState({ ...state, ...preset.config });
  };

  return (
    <div className="space-y-6">
      {/* Themes */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <QuotesIcon weight="fill" />
          Themes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary-500 text-xs font-mono text-gray-300 transition-all rounded-sm text-left"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <TextTIcon weight="fill" />
          Content
        </h3>

        <div>
          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
            Quote
          </label>
          <textarea
            value={state.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={4}
            className="w-full bg-black border border-white/10 px-3 py-2 text-white font-sans text-sm focus:border-primary-500 outline-none transition-colors rounded-sm resize-y"
            placeholder="Enter your quote here..."
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
            Author
          </label>
          <input
            type="text"
            value={state.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="w-full bg-black border border-white/10 px-3 py-2 text-white font-sans text-sm focus:border-primary-500 outline-none transition-colors rounded-sm"
            placeholder="Author Name"
          />
        </div>
      </div>

      {/* Typography */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <TextTIcon weight="fill" />
          Typography
        </h3>

        <CustomDropdown
          label="Font Family"
          options={FONT_OPTIONS}
          value={state.fontFamily}
          onChange={(val) => handleChange('fontFamily', val)}
          variant="brutalist"
          icon={TextTIcon}
        />

        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleChange('textAlign', 'left')}
            className={`flex-1 p-2 border ${state.textAlign === 'left' ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
          >
            <TextAlignLeftIcon className="mx-auto" />
          </button>
          <button
            onClick={() => handleChange('textAlign', 'center')}
            className={`flex-1 p-2 border ${state.textAlign === 'center' ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
          >
            <TextAlignCenterIcon className="mx-auto" />
          </button>
          <button
            onClick={() => handleChange('textAlign', 'right')}
            className={`flex-1 p-2 border ${state.textAlign === 'right' ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
          >
            <TextAlignRightIcon className="mx-auto" />
          </button>
        </div>

        <CustomSlider
          variant="brutalist"
          label="Font Size"
          min={12}
          max={128}
          value={state.fontSize}
          onChange={(val) => handleChange('fontSize', val)}
        />
        <CustomSlider
          variant="brutalist"
          label="Line Height"
          min={0.8}
          max={3}
          step={0.1}
          value={state.lineHeight}
          onChange={(val) => handleChange('lineHeight', val)}
        />
        <CustomSlider
          variant="brutalist"
          label="Font Weight"
          min={100}
          max={900}
          step={100}
          value={state.fontWeight}
          onChange={(val) => handleChange('fontWeight', val)}
        />
      </div>

      {/* Canvas */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <PaletteIcon weight="fill" />
          Canvas
        </h3>

        <CustomSlider
          variant="brutalist"
          label="Width"
          min={500}
          max={2000}
          step={10}
          value={state.width}
          onChange={(val) => handleChange('width', val)}
        />
        <CustomSlider
          variant="brutalist"
          label="Height"
          min={500}
          max={2000}
          step={10}
          value={state.height}
          onChange={(val) => handleChange('height', val)}
        />
      </div>

      {/* Colors & Visuals */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <PaletteIcon weight="fill" />
          Visuals
        </h3>

        <CustomDropdown
          label="Background Type"
          options={[
            { value: 'solid', label: 'Solid Color' },
            { value: 'linear', label: 'Linear Gradient' },
            { value: 'radial', label: 'Radial Gradient' },
          ]}
          value={state.backgroundType || 'solid'}
          onChange={(val) => handleChange('backgroundType', val)}
          variant="brutalist"
        />

        {(!state.backgroundType || state.backgroundType === 'solid') ? (
          <CustomColorPicker
            label="Background Color"
            value={state.backgroundColor}
            onChange={(val) => handleChange('backgroundColor', val)}
            variant="brutalist"
          />
        ) : (
          <div className="space-y-4 pt-2 border-t border-white/5">
            <CustomColorPicker
              label="Color 1"
              value={state.gradientColor1 || '#ff0000'}
              onChange={(val) => handleChange('gradientColor1', val)}
              variant="brutalist"
            />
            <CustomColorPicker
              label="Color 2"
              value={state.gradientColor2 || '#0000ff'}
              onChange={(val) => handleChange('gradientColor2', val)}
              variant="brutalist"
            />
            {state.backgroundType === 'linear' && (
              <CustomSlider
                variant="brutalist"
                label="Gradient Angle"
                min={0}
                max={360}
                value={state.gradientAngle || 135}
                onChange={(val) => handleChange('gradientAngle', val)}
              />
            )}
          </div>
        )}

        <CustomColorPicker
          label="Text Color"
          value={state.textColor}
          onChange={(val) => handleChange('textColor', val)}
          variant="brutalist"
        />

        <div className="pt-4 border-t border-white/5">
          <CustomSlider
            variant="brutalist"
            label="Padding"
            min={0}
            max={200}
            value={state.padding}
            onChange={(val) => handleChange('padding', val)}
          />
        </div>

        <div className="pt-4 border-t border-white/5">
          <CustomDropdown
            label="Theme Style"
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'wordbox', label: 'Wordbox' },
              { value: 'typewriter', label: 'Typewriter' },
              { value: 'newspaper', label: 'Newspaper' },
              { value: 'neon', label: 'Neon' },
              { value: 'polaroid', label: 'Polaroid' },
              { value: 'brutalist', label: 'Brutalist' },
              { value: 'science', label: 'Science' },
              { value: 'french-girl', label: 'French Girl' },
              { value: 'kings', label: 'Kings' },
              { value: 'birds', label: 'Birds' },
              { value: 'cia', label: 'CIA' },
              { value: 'fbi', label: 'FBI' },
              { value: 'espionage', label: 'Espionage' },
              { value: 'control-panel', label: 'Control Panel' },
              { value: 'basketball', label: 'Basketball' },
              { value: 'football', label: 'Football' },
              { value: 'river', label: 'River' },
              { value: 'mountain', label: 'Mountain' },
              { value: 'cats', label: 'Cats' },
            ]}
            value={state.themeType}
            onChange={(val) => handleChange('themeType', val)}
            variant="brutalist"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
