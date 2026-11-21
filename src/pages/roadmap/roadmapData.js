import {
  CheckCircleIcon,
  CircleIcon,
  PauseCircleIcon,
  XCircleIcon,
  CircleHalfIcon,
} from '@phosphor-icons/react';

export const stages = [
  {
    name: 'In Progress',
    label: 'In progress',
    key: 'active',
    icon: CircleHalfIcon,
    empty: 'No issues in progress.',
  },
  {
    name: 'Planned',
    label: 'Planned',
    key: 'planned',
    icon: CircleIcon,
    empty: 'No planned issues.',
  },
  {
    name: 'On Hold',
    label: 'On hold',
    key: 'paused',
    icon: PauseCircleIcon,
    empty: 'No work is on hold.',
  },
  {
    name: 'Completed',
    label: 'Shipped',
    key: 'shipped',
    icon: CheckCircleIcon,
    empty: 'Completed work will appear here.',
  },
  {
    name: "Won't Do",
    label: "Won't do",
    key: 'wont-do',
    icon: XCircleIcon,
    empty: 'No declined issues.',
  },
  {
    name: 'Cancelled',
    label: 'Cancelled',
    key: 'cancelled',
    icon: XCircleIcon,
    empty: 'No cancelled work.',
  },
];

export const normalizeStatus = (status = '') => {
  const value = status.toLowerCase();
  if (value.includes('progress')) return 'In Progress';
  if (value.includes('complet') || value === 'done') return 'Completed';
  if (value.replace(/’/g, "'") === "won't do") return "Won't Do";
  if (value.includes('cancel')) return 'Cancelled';
  if (value.includes('hold') || value === 'backlog') return 'On Hold';
  return 'Planned';
};

export const flattenIssues = (items) =>
  (Array.isArray(items) ? items : [items])
    .filter(Boolean)
    .flatMap((item) =>
      item.issues
        ? flattenIssues(item.issues)
        : [{ ...item, status: normalizeStatus(item.status) }],
    );

export const sortIssues = (items) =>
  [...items].sort((a, b) => {
    const dateOrder =
      (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
    return (
      dateOrder ||
      (b.id || '').localeCompare(a.id || '', undefined, { numeric: true })
    );
  });
export const getStatusLabel = (status) =>
  stages.find((stage) => stage.name === normalizeStatus(status)).label;
