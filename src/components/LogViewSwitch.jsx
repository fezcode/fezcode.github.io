import React from 'react';
import { Link } from 'react-router-dom';
import { BooksIcon, ListBulletsIcon } from '@phosphor-icons/react';
import { CLASSIC_LOGS_PATH, SHELF_LOGS_PATH } from '../utils/discoveryMode';
import './LogViewSwitch.css';

const VIEWS = [
  {
    id: 'classic',
    label: 'Classic',
    path: CLASSIC_LOGS_PATH,
    icon: ListBulletsIcon,
  },
  { id: 'shelf', label: 'Shelf', path: SHELF_LOGS_PATH, icon: BooksIcon },
];

export default function LogViewSwitch({ view }) {
  return (
    <nav className="log-view-switch" aria-label="Log view">
      {VIEWS.map(({ id, label, path, icon: Icon }) => (
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
