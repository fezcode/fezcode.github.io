import React from 'react';

export default function PoiRating() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Rating of Person of Interest</strong>{' '}
        is <strong className="text-emerald-500 text-lg">100</strong> out of 5.{' '}
        <span className="italic text-gray-400">This is not a mistake</span>...
        It does not fit well with the rest of the ratings or the rating system
        itself. Because it is an exceptional show. It is the only{' '}
        <strong className="text-current">AI</strong> related work of art that
        captured the true essence of being{' '}
        <strong className="text-current">human</strong>.
      </p>
      <p>Some might even say, it used to be my favorite tv show...</p>
    </div>
  );
}
