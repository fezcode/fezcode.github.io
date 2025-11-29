const getStatusClasses = (status) => {
  let bgColor = '';
  let borderColor = '';
  switch (status) {
    case 'Planned':
      bgColor = 'bg-blue-500';
      borderColor = 'border-blue-700';
      break;
    case 'In Progress':
      bgColor = 'bg-orange-500';
      borderColor = 'border-orange-700';
      break;
    case 'Completed':
      bgColor = 'bg-green-500';
      borderColor = 'border-green-700';
      break;
    case 'On Hold':
      bgColor = 'bg-red-500';
      borderColor = 'border-red-700';
      break;
    default:
      bgColor = 'bg-gray-500';
      borderColor = 'border-gray-700';
  }
  return `${bgColor} ${borderColor}`;
};

const getPriorityClasses = (priority) => {
  let textColor = '';
  let borderColor = '';
  switch (priority) {
    case 'High':
      textColor = 'text-red-400';
      borderColor = 'border-red-700';
      break;
    case 'Medium':
      textColor = 'text-yellow-400';
      borderColor = 'border-yellow-700';
      break;
    case 'Low':
      textColor = 'text-green-400';
      borderColor = 'border-green-700';
      break;
    default:
      textColor = 'text-gray-400';
      borderColor = 'border-gray-700';
  }
  return `${textColor} ${borderColor}`;
};

const getOnlyBgStatusColor = (status) => {
  const classes = getStatusClasses(status);
  return classes.split(' ')[0]; // Returns only the bgColor class (e.g., "bg-blue-500")
};

const statusTextColor = (status) => {
  if (status === 'Planned') return 'text-white';
  return 'text-black';
};

export { getStatusClasses, getPriorityClasses, getOnlyBgStatusColor, statusTextColor };
