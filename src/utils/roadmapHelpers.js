const STATUS_COLORS = {
  'Planned': 'blue',
  'In Progress': 'orange',
  'Completed': 'green',
  'On Hold': 'red',
};

const PRIORITY_COLORS = {
  'High': 'red',
  'Medium': 'yellow',
  'Low': 'green',
};

// Define explicit styles so Tailwind JIT can detect them
const BADGE_STYLES = {
  blue: 'bg-blue-500/20 border border-blue-500/50 text-blue-300',
  orange: 'bg-orange-500/20 border border-orange-500/50 text-orange-300',
  green: 'bg-green-500/20 border border-green-500/50 text-green-300',
  red: 'bg-red-500/20 border border-red-500/50 text-red-300',
  yellow: 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300',
  gray: 'bg-gray-500/20 border border-gray-500/50 text-gray-300',
};

const getBadgeStyle = (color) => {
  return BADGE_STYLES[color] || BADGE_STYLES['gray'];
};

const getStatusClasses = (status) => {
  const color = STATUS_COLORS[status] || 'gray';
  return getBadgeStyle(color);
};

const getPriorityClasses = (priority) => {
  const color = PRIORITY_COLORS[priority] || 'gray';
  return getBadgeStyle(color);
};

const getOnlyBgStatusColor = (status) => {
  const color = STATUS_COLORS[status] || 'gray';
  // Return explicit classes for JIT
  const bgColors = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
  };
  return bgColors[color] || 'bg-gray-500';
};

const statusTextColor = (status) => {
  return ''; // Text color is now handled in getStatusClasses/getPriorityClasses
};

export { getStatusClasses, getPriorityClasses, getOnlyBgStatusColor, statusTextColor };
