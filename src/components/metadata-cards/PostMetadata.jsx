import React from 'react';
import { Link } from 'react-router-dom';
import Label from '../Label';
import { ArrowUp, ArrowDown } from '@phosphor-icons/react';

const getCategoryStyles = (category) => {
  switch (category) {
    case 'dev':
      return 'text-blue-300 bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40';
    case 'series':
      return 'text-rose-300 bg-rose-900/20 border border-rose-900/50 hover:bg-rose-900/40';
    case 'd&d':
    case 'dnd':
      return 'text-pink-300 bg-pink-900/20 border border-pink-900/50 hover:bg-pink-900/40';
    case 'gist':
      return 'text-amber-300 bg-amber-900/20 border border-amber-900/50 hover:bg-amber-900/40';
    case 'feat':
      return 'text-purple-300 bg-purple-900/20 border border-purple-900/50 hover:bg-purple-900/40';
    case 'rant':
      return 'text-emerald-300 bg-emerald-900/20 border border-emerald-900/50 hover:bg-emerald-900/40';
    default:
      return 'text-cyan-300 bg-cyan-900/20 border border-cyan-900/50 hover:bg-cyan-900/40';
  }
};

const PostMetadata = ({
  metadata,
  readingProgress,
  isAtTop,
  overrideDate,
  updatedDate,
  seriesPosts,
  estimatedReadingTime,
}) => {
  if (!metadata) {
    return null;
  }

  const displayDate =
    overrideDate ||
    (metadata.date
      ? new Date(metadata.date).toLocaleDateString()
      : 'Invalid Date');

  const handleButtonClick = () => {
    if (isAtTop) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-full">
      <div className="p-6 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg relative overflow-hidden group">
        {/* Decor element */}
        <div className="absolute top-0 right-0 p-3 opacity-50">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <h3 className="text-sm font-mono font-bold text-cyan-400 mb-6 border-b border-gray-800 pb-3 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span>
          Post Data
        </h3>

        <div className="space-y-6">
          <div>
            <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
              Original Title
            </Label>
            <p className="text-gray-200 mt-1 font-medium">{metadata.title}</p>
          </div>
          {metadata.authors && metadata.authors.length > 0 && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Author(s)
              </Label>
              <p className="mt-1">
                {metadata.authors.map((author, index) => (
                  <React.Fragment key={author}>
                    <span className="text-cyan-300 font-mono text-sm">
                      {author}
                    </span>
                    {index < metadata.authors.length - 1 && (
                      <span className="text-gray-500"> & </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          )}
          {metadata.category && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Category
              </Label>
              <div className="mt-1">
                <span
                  className={`inline-block px-2 py-1 font-mono text-xs rounded uppercase ${getCategoryStyles(metadata.category)}`}
                >
                  {metadata.category}
                </span>
              </div>
            </div>
          )}
          <div>
            <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
              Date
            </Label>
            <p className="text-gray-300 mt-1 font-mono text-sm">
              {displayDate}
            </p>
          </div>
          {updatedDate && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Updated
              </Label>
              <p className="text-gray-300 mt-1 font-mono text-sm">
                {updatedDate}
              </p>
            </div>
          )}
          {estimatedReadingTime > 0 && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Reading Time
              </Label>
              <p className="text-gray-300 mt-1 font-mono text-sm">
                {estimatedReadingTime} min read
              </p>
            </div>
          )}
          {metadata.tags && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-cyan-900/20 text-cyan-300 border border-cyan-900/50 text-xs font-mono px-2 py-1 rounded hover:bg-cyan-900/40 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {metadata.series && seriesPosts && seriesPosts.length > 0 && (
            <>
              <div className="pt-4 border-t border-gray-800">
                <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                  Series
                </Label>
                <p className="text-cyan-400 mt-1 font-bold">
                  {metadata.series.title}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                  Episodes
                </Label>
                <ul className="space-y-2 mt-2">
                  {seriesPosts.map((postInSeries) => {
                    const episodeLink = `/blog/series/${metadata.series.slug}/${postInSeries.slug}`;
                    const isActive = postInSeries.slug === metadata.slug;
                    return (
                      <li
                        key={postInSeries.slug}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-cyan-500 animate-pulse' : 'bg-gray-700'}`}
                        ></span>
                        <Link
                          to={episodeLink}
                          className={`transition-colors ${isActive ? 'text-cyan-400 font-bold' : 'text-gray-400 hover:text-cyan-300'}`}
                        >
                          {postInSeries.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono mb-2 block">
            Reading Progress
          </Label>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-cyan-500 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleButtonClick}
            className="group flex items-center justify-center w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-cyan-400 transition-all duration-300 border border-transparent hover:border-cyan-500/30 text-sm font-mono uppercase tracking-wider"
          >
            {isAtTop ? (
              <>
                <ArrowDown
                  className="mr-2 group-hover:translate-y-1 transition-transform"
                  size={16}
                />
                To Bottom
              </>
            ) : (
              <>
                <ArrowUp
                  className="mr-2 group-hover:-translate-y-1 transition-transform"
                  size={16}
                />
                To Top
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PostMetadata;
