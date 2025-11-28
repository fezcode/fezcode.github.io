import React from 'react';
import { Link } from 'react-router-dom';
import Label from '../Label';

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

  const categoryBadgeColorStyle = {
    backgroundColor:
      metadata.category === 'dev'
        ? 'var(--color-dev-badge)'
        : metadata.category === 'series'
          ? 'var(--color-series-badge)'
          : metadata.category === 'd&d'
            ? 'var(--color-dnd-badge)'
            : metadata.category === 'gist'
              ? 'var(--color-gist-badge)'
              : metadata.category === 'feat'
                ? 'var(--color-feat-badge)'
                : 'var(--color-rant-badge)',
  };

  const categoryBadgeFontColorStyle =
    metadata.category === 'gist' || metadata.category === 'gist'
      ? 'text-black'
      : 'text-white';
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
    <aside className="sticky top-24">
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b pb-2 border-gray-500">
          About Post
        </h3>
        <div className="space-y-4">
          <div>
            <Label>Original Title</Label>
            <p className="text-gray-300 ml-1 mt-1 ">{metadata.title}</p>
          </div>
          {metadata.authors && metadata.authors.length > 0 && (
            <div>
              <Label>Author(s)</Label>
              <p className="ml-1 mt-1">
                {metadata.authors.map((author, index) => (
                  <React.Fragment key={author}>
                    <span className="text-rose-400">{author}</span>
                    {index < metadata.authors.length - 1 && (
                      <span className="text-gray-300"> & </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          )}
          {metadata.category && (
            <div>
              <Label>Category</Label>
              <span
                className={`ml-1 px-2 py-1 font-arvo text-xs ${categoryBadgeFontColorStyle} rounded-md w-16 text-center`}
                style={categoryBadgeColorStyle}
              >
                {metadata.category}
              </span>
            </div>
          )}
          <div>
            <Label>Date</Label>
            <p className="text-gray-300 ml-1 mt-1">{displayDate}</p>
          </div>
          {updatedDate && (
            <div>
              <Label>Updated</Label>
              <p className="text-gray-300 ml-1 mt-1">{updatedDate}</p>
            </div>
          )}
          {estimatedReadingTime > 0 && (
            <div>
              <Label>Reading Time</Label>
              <p className="text-gray-300 ml-1 mt-1">
                {estimatedReadingTime} min read
              </p>
            </div>
          )}
          {metadata.tags && (
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-400/10 text-primary-400 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {metadata.series && seriesPosts && seriesPosts.length > 0 && (
            <>
              <div>
                <Label>Series</Label>
                <p className="text-gray-300 ml-1 mt-1">
                  {metadata.series.title}
                </p>
              </div>
              <div>
                <Label>Episodes</Label>
                <ul className="list-disc list-inside ml-4 mt-2 text-gray-300">
                  {seriesPosts.map((postInSeries) => {
                    const episodeLink = `/blog/series/${metadata.series.slug}/${postInSeries.slug}`;
                    return (
                      <li key={postInSeries.slug}>
                        <Link
                          to={episodeLink}
                          className={`hover:text-primary-400 ${postInSeries.slug === metadata.slug ? 'font-semibold text-primary-400' : ''}`}
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
        <div className="mt-6">
          <Label className="mb-1">Reading Progress</Label>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary-500 h-2.5 rounded-full"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleButtonClick}
            className="text-primary-400 hover:text-primary-500 transition-colors text-sm font-medium flex items-center justify-center w-full py-2 rounded-md bg-gray-700/50 hover:bg-gray-700"
          >
            <span className="mr-1">{isAtTop ? '↓' : '↑'}</span>{' '}
            {isAtTop ? 'To the bottom' : 'To the top'}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PostMetadata;
