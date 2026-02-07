import React from 'react';
import Label from '../Label';
import { StarIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';

const LogMetadata = ({ metadata }) => {
  if (!metadata) {
    return null;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <StarIcon key={i} size={16} weight="fill" className="text-yellow-400" />,
        );
      } else {
        stars.push(
          <StarIcon key={i} size={16} weight="fill" className="text-gray-500" />,
        );
      }
    }
    return <div className="flex ml-1 mt-1">{stars}</div>;
  };

  return (
    <aside className="sticky top-24">
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor:
            colors[`${metadata.category.toLowerCase()}-alpha-10`],
          borderColor: colors[`${metadata.category.toLowerCase()}-alpha-50`],
        }}
      >
        <h3
          className="text-lg font-semibold mb-4 border-b pb-2 border-gray-500"
          style={{ color: colors[metadata.category.toLowerCase()] }}
        >
          About Log
        </h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-gray-300 ml-1 mt-1">{metadata.title}</p>
          </div>
          <div>
            <Label>Category</Label>
            <p className="text-gray-300 ml-1 mt-1">{metadata.category}</p>
          </div>
          {metadata.tags && metadata.tags.length > 0 && (
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
          {metadata.updated && (
            <div>
              <Label>Updated</Label>
              <p className="text-gray-300 ml-1 mt-1">{metadata.updated}</p>
            </div>
          )}
          {metadata.rating !== undefined && metadata.rating !== null && (
            <div>
              <Label>Rating</Label>
              {renderStars(metadata.rating)}
            </div>
          )}
          {metadata.link && (
            <div>
              <Label>Link</Label>
              <p className="text-gray-300 ml-1 mt-1">
                <a
                  href={metadata.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 inline-flex items-center gap-1"
                >
                  View <ArrowSquareOutIcon size={14} />
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LogMetadata;
