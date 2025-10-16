import React from 'react';
import Label from './Label';
import { Star } from '@phosphor-icons/react';

const LogMetadata = ({ metadata }) => {
  if (!metadata) {
    return null;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<Star key={i} size={16} weight="fill" className="text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={16} weight="fill" className="text-gray-500" />);
      }
    }
    return <div className="flex ml-1 mt-1">{stars}</div>;
  };

  return (
    <aside className="sticky top-24">
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b pb-2 border-gray-500">About Log</h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-gray-300 ml-1 mt-1">{metadata.title}</p>
          </div>
          <div>
            <Label>Category</Label>
            <p className="text-gray-300 ml-1 mt-1">{metadata.category}</p>
          </div>
          {metadata.author && (
            <div>
              <Label>Author</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.author}</p>
            </div>
          )}
          {metadata.director && (
            <div>
              <Label>Director</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.director}</p>
            </div>
          )}
          {metadata.platform && (
            <div>
              <Label>Platform</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.platform}</p>
            </div>
          )}
          {metadata.source && (
            <div>
              <Label>Source</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.source}</p>
            </div>
          )}
          {metadata.artist && (
            <div>
              <Label>Artist</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.artist}</p>
            </div>
          )}
          {metadata.year && (
            <div>
              <Label>Year</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.year}</p>
            </div>
          )}
          {metadata.creator && (
            <div>
              <Label>Creator</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.creator}</p>
            </div>
          )}
          <div>
            <Label>Date</Label>
            <p className="text-gray-300 ml-1 mt-1">{metadata.date}</p>
          </div>
          {metadata.rating !== undefined && metadata.rating !== null && (
            <div>
              <Label>Rating</Label>
              {renderStars(metadata.rating)}
            </div>
          )}
          {metadata.link && (
            <div>
              <Label>Link</Label>
              <p className="text-gray-300 ml-1 mt-1"><a href={metadata.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">View</a></p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default LogMetadata;