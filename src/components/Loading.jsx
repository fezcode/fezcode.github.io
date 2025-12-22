import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#050505] text-white font-mono uppercase tracking-widest gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
        <span className="animate-pulse">Loading_System_Resources...</span>
      </div>
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 animate-progress origin-left" />
      </div>
    </div>
  );
};

export default Loading;
