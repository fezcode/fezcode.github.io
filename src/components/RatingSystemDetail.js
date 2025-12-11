import React from 'react';
import {StarIcon} from '@phosphor-icons/react';

const RatingSystemDetail = () => {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={14}
            weight="fill"
            className={i < rating ? 'text-yellow-500' : 'text-gray-700'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h3 className="text-white font-bold mb-2">Philosophy</h3>
        <p className="text-sm text-gray-400">
          Ratings are subjective and reflect personal enjoyment at the time of
          consumption. Context matters—a "bad" movie might be a 5-star
          experience with the right friends.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-bold border-b border-gray-800 pb-2">
          The Scale
        </h3>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-bold">Masterpiece</span>
            {renderStars(5)}
          </div>
          <p className="text-xs text-gray-500">
            Life-changing, genre-defining, or simply perfect in its execution.
            These are rare and cherished.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-bold">Excellent</span>
            {renderStars(4)}
          </div>
          <p className="text-xs text-gray-500">
            Highly recommended. Thoroughly enjoyable with minor flaws or just
            missing that "spark" of perfection.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-blue-400 font-bold">Good</span>
            {renderStars(3)}
          </div>
          <p className="text-xs text-gray-500">
            Worth your time. Solid, entertaining, but perhaps forgettable or
            flawed in noticeable ways.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-bold">Mediocre</span>
            {renderStars(2)}
          </div>
          <p className="text-xs text-gray-500">
            Has moments of merit but largely disappoints. Frustrating or simply
            boring.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-bold">Poor</span>
            {renderStars(1)}
          </div>
          <p className="text-xs text-gray-500">
            Active dislike. A waste of time. Avoid unless you enjoy suffering.
          </p>
        </div>
      </div>
      <div className="space-y-2 pt-4">
        <h3 className="text-white font-bold border-b border-gray-800 pb-2">Inspiration</h3>
        <p className="text-sm text-gray-400">
          This rating system is heavily inspired by the classic <strong>X-Play (G4TV)</strong> scale.
          We believe in the sanctity of the 3-star review: a 3 is not bad, it
          is <strong>average</strong> or <strong>solid</strong>.
          Grade inflation has no place here.
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-600 italic">
        * Ratings may change upon re-evaluation.
      </div>
    </div>
  );
};
export default RatingSystemDetail;
