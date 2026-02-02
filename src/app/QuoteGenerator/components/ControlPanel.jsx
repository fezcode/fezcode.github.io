import React from 'react';
import {
    TextTIcon,
    PaletteIcon,
    TextAlignLeftIcon,  TextAlignCenterIcon,
  TextAlignRightIcon,
  QuotesIcon
} from '@phosphor-icons/react';
import CustomSlider from '../../../components/CustomSlider';
import CustomColorPicker from '../../../components/CustomColorPicker';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomToggle from '../../../components/CustomToggle';

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
            overlayOpacity: 0
        }
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
            overlayOpacity: 0
        }
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
            overlayOpacity: 0
        }
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
            overlayOpacity: 0
        }
    },
    {
        name: 'Highlighted',
        config: {
            fontFamily: 'Oswald',
            backgroundColor: '#ffffff', // In WordBox mode, this is Text Color (inverted logic in render)
            textColor: '#000000',      // This is Box Color
            fontWeight: 700,
            themeType: 'wordbox',
            textAlign: 'center',
            overlayOpacity: 0
        }
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
            overlayOpacity: 0
        }
    }
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
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Quote</label>
            <textarea
                value={state.text}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={4}
                className="w-full bg-black border border-white/10 px-3 py-2 text-white font-sans text-sm focus:border-primary-500 outline-none transition-colors rounded-sm resize-y"
                placeholder="Enter your quote here..."
            />
        </div>
        <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Author</label>
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

      {/* Colors & Visuals */}
      <div className="bg-[#111] border border-white/5 p-4 rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <PaletteIcon weight="fill" />
            Visuals
        </h3>

        <CustomColorPicker
            label="Background Color"
            value={state.backgroundColor}
            onChange={(val) => handleChange('backgroundColor', val)}
            variant="brutalist"
        />
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

        {/* Wordbox Toggle */}
        <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-gray-500 uppercase">Text Highlight Box</span>
            <CustomToggle
                variant="brutalist"
                checked={state.themeType === 'wordbox'}
                onChange={() => handleChange('themeType', state.themeType === 'wordbox' ? 'standard' : 'wordbox')}
            />
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;
