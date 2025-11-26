import React from 'react';

const BreadcrumbTitle = ({ title, slug, breadcrumbs, gradient = true }) => {
  // Use provided breadcrumbs array, or fallback to default ['fc', 'apps', slug]
  const parts = breadcrumbs || (slug ? ['fc', 'apps', slug] : []);

  return (
    <div className="relative flex flex-col items-center justify-center mb-4">
      <span className="min-[1376px]:absolute min-[1376px]:left-0 min-[1376px]:top-1/2 min-[1376px]:-translate-y-1/2 text-xl md:text-2xl font-mono font-normal text-gray-500 tracking-tight mb-2 min-[1376px]:mb-0 opacity-75">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span
              className={index === parts.length - 1 ? 'text-primary-400' : ''}
            >
              {part}
            </span>
            {index < parts.length - 1 && (
              <span className="text-gray-700">::</span>
            )}
          </React.Fragment>
        ))}
      </span>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-center">
        <span
          className={
            gradient
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400'
              : 'text-white'
          }
        >
          {title}
        </span>
      </h1>
    </div>
  );
};

export default BreadcrumbTitle;