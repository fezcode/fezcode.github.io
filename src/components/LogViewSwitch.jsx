import React from 'react';
import { Link } from 'react-router-dom';
import { BooksIcon, ListBulletsIcon } from '@phosphor-icons/react';
import {
  CLASSIC_LOGS_PATH,
  EXPLICIT_SHELF_LOGS_PATH,
  SHELF_LOGS_PATH,
} from '../utils/discoveryMode';
import { useVisualSettings } from '../context/VisualSettingsContext';
import './LogViewSwitch.css';

export default function LogViewSwitch({ view }) {
  const discoveryViewMode =
    useVisualSettings?.()?.discoveryViewMode || 'shelf';
  const views = [
    {
      id: 'classic',
      label: 'Classic',
      path: discoveryViewMode === 'classic' ? SHELF_LOGS_PATH : CLASSIC_LOGS_PATH,
      icon: ListBulletsIcon,
    },
    {
      id: 'shelf',
      label: 'Shelf',
      path:
        discoveryViewMode === 'classic'
          ? EXPLICIT_SHELF_LOGS_PATH
          : SHELF_LOGS_PATH,
      icon: BooksIcon,
    },
  ];

  return (
    <nav className="log-view-switch" aria-label="Log view">
      {views.map(({ id, label, path, icon: Icon }) => (
        <Link
          key={id}
          to={path}
          aria-label={`${label} view`}
          aria-current={view === id ? 'page' : undefined}
        >
          <Icon size={16} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
