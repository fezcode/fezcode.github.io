import React from 'react';
import { CheckIcon } from '@phosphor-icons/react';
import { SITE_THEMES } from '../utils/siteThemes';
import { useVisualSettings } from '../context/VisualSettingsContext';

const ThemePicker = ({ currentTheme, onSelect }) => {
  const { fezcodexTheme } = useVisualSettings();
  const activeTheme = fezcodexTheme || currentTheme;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {SITE_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          aria-pressed={activeTheme === theme.id}
          onClick={() => onSelect(theme.id)}
          className="text-left p-6 rounded-xl border-2 transition-colors"
          style={{
            background: theme.background,
            color: theme.foreground,
            borderColor:
              activeTheme === theme.id ? theme.accent : `${theme.foreground}30`,
          }}
        >
          <span className="flex justify-between items-center gap-3 mb-5">
            <span
              className="text-3xl"
              style={{ color: theme.accent }}
              aria-hidden="true"
            >
              {theme.id === 'orbit' ? '◎' : 'Aa'}
            </span>
            {activeTheme === theme.id && (
              <CheckIcon size={20} aria-label="Selected" />
            )}
          </span>
          <strong className="block text-lg">{theme.name}</strong>
          <span className="block text-sm mt-1">{theme.description}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;
