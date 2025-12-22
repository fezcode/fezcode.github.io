import React from 'react';

const BreadcrumbTitle = ({
  title,
  slug,
  breadcrumbs,
  gradient = true,
  sansFont = false,
  lightStyle = true,
  variant = 'default',
}) => {
  // Use provided breadcrumbs array, or fallback to default ['fc', 'apps', slug]
  const parts = breadcrumbs || (slug ? ['fc', 'apps', slug] : []);
  const isBrutalist = variant === 'brutalist';

  if (isBrutalist) {
    return (
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span className={index === parts.length - 1 ? 'text-emerald-500 font-bold' : ''}>
                {part}
              </span>
              {index < parts.length - 1 && (
                <span className="text-gray-600 font-bold "> {'//'}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
          {title}
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center mb-4 ${sansFont ? 'font-playfairDisplay' : 'font-mono'} `}
    >
      <span className="min-[1376px]:absolute min-[1376px]:left-0 min-[1376px]:top-1/2 min-[1376px]:-translate-y-1/2 text-xl md:text-2xl font-mono font-normal text-gray-500 tracking-tight mb-2 min-[1376px]:mb-0 opacity-75">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span
              className={
                index === parts.length - 1
                  ? lightStyle
                    ? 'text-primary-400'
                    : 'text-rose-800'
                  : ''
              }
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
              ? lightStyle
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400'
                : 'bg-clip-text text-transparent bg-gradient-to-r from-pink-800 to-teal-800'
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
