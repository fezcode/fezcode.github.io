import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DndContext } from '../../context/DndContext'; // Import DndContext

const DndNavbar = () => {
  const { breadcrumbs } = useContext(DndContext); // Get breadcrumbs from context

  const formatBreadcrumbLabel = (label) => {
    const colonIndex = label.indexOf(':');
    return colonIndex !== -1 ? label.substring(0, colonIndex) : label;
  };

  return (
    <nav className="dnd-navbar">
      <div className="dnd-navbar-left">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="dnd-breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path || index}>
                {index > 0 && (
                  <span className="dnd-breadcrumb-separator">&rarr;</span>
                )}
                {crumb.path ? (
                  <Link to={crumb.path} className="dnd-breadcrumb-link">
                    {formatBreadcrumbLabel(crumb.label)}
                  </Link>
                ) : (
                  <span className="dnd-breadcrumb-current">
                    {formatBreadcrumbLabel(crumb.label)}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <Link to="/" className="dnd-navbar-link">
            Back to Home
          </Link>
        )}
      </div>
      <div className="dnd-navbar-center">
        <span
          className="text-2xl font-semibold tracking-tight"
          style={{
            color: '#FFFACD',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          From Serfs and Frauds
        </span>
      </div>
      <div className="dnd-navbar-right">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-semibold tracking-tight text-white">
            fez<span className="text-primary-400">codex</span>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default DndNavbar;
