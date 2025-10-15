import React from 'react';
import Label from './Label';

const PostMetadata = ({ metadata, readingProgress, isAtTop, overrideDate, updatedDate }) => {
  if (!metadata) {
    return null;
  }

  const displayDate = overrideDate || (metadata.date ? new Date(metadata.date).toLocaleDateString() : 'Invalid Date');

  const handleButtonClick = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky top-24">
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b pb-2 border-gray-500">About Post</h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-gray-300">{metadata.title}</p>
          </div>
          <div>
            <Label>Date</Label>
            <p className="text-gray-300">{displayDate}</p>
          </div>
          {updatedDate && (
            <div>
              <Label>Updated</Label>
              <p className="text-gray-300">{updatedDate}</p>
            </div>
          )}
          {metadata.tags && (
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map(tag => (
                  <span key={tag} className="bg-primary-400/10 text-primary-400 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Label className="mb-1">Reading Progress</Label>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className="bg-primary-500 h-2.5 rounded-full" style={{width: `${readingProgress}%`}}></div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleButtonClick}
            className="text-primary-400 hover:text-primary-500 transition-colors text-sm font-medium flex items-center justify-center w-full py-2 rounded-md bg-gray-700/50 hover:bg-gray-700"
          >
            <span className="mr-1">{isAtTop ? '↓' : '↑'}</span> {isAtTop ? 'To the bottom' : 'To the top'}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default PostMetadata;