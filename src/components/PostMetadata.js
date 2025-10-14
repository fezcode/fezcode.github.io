import React from 'react';
import Label from './Label';

const PostMetadata = ({ metadata }) => {
  if (!metadata) {
    return null;
  }

  return (
    <aside className="sticky top-24">
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">About Post</h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-gray-300">{metadata.title}</p>
          </div>
          <div>
            <Label>Date</Label>
            <p className="text-gray-300">{metadata.date.toLocaleDateString()}</p>
          </div>
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
      </div>
    </aside>
  );
};

export default PostMetadata;