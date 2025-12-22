import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DndContext } from '../../context/DndContext';
import { CaretRight, House } from '@phosphor-icons/react';

const DndNavbar = () => {
  const { breadcrumbs } = useContext(DndContext);

  const formatBreadcrumbLabel = (label) => {
    return label.indexOf(':') !== -1 ? label.substring(0, label.indexOf(':')) : label;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[300] dnd-nav-modern border-b-2 border-dnd-gold">
      {/* Top Bar: Navigation & Breadcrumbs */}
      <div className="bg-black/40 px-12 py-2 flex items-center justify-between border-b border-white/5 mt-[25px]">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-dnd-gold transition-colors">
            <House size={18} weight="fill" />
          </Link>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em]">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path || index}>
                  <CaretRight size={10} className="text-white/40" />
                  {crumb.path ? (
                    <Link to={crumb.path} className="text-white/60 hover:text-white transition-colors">
                      {formatBreadcrumbLabel(crumb.label)}
                    </Link>
                  ) : (
                    <span className="text-white font-bold">
                      {formatBreadcrumbLabel(crumb.label)}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <Link to="/" className="text-[10px] font-mono font-bold tracking-[0.4em] text-white/40 hover:text-dnd-gold transition-colors">
          FEZCODEX_SYSTEM
        </Link>
      </div>

      {/* Main Bar: Title */}
      <div className="px-6 py-4 flex items-center justify-center relative bg-gradient-to-b from-dnd-crimson to-transparent">
        <span className="text-3xl md:text-4xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter drop-shadow-2xl">
          From Serfs & Frauds
        </span>
      </div>
    </nav>
  );
};
export default DndNavbar;
