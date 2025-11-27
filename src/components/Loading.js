import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-900 text-primary-500">
      <CircleNotch size={48} className="animate-spin" />
    </div>
  );
};

export default Loading;
