import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, BookOpen } from '@phosphor-icons/react';

const DndAuthorCard = ({
  authorName,
  authorWebsite,
  authorImage,
  authorAlias,
  booksWritten,
}) => {
  return (
    <div className="dnd-parchment-container p-8 md:p-12 shadow-xl group transition-all duration-500 hover:-translate-y-2">
      <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-6 !h-6" />
      <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-6 !h-6" />
      <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-6 !h-6" />
      <div className="dnd-ornate-corner dnd-ornate-corner-br !w-6 !h-6" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-dnd-gold rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
          <img
            src={authorImage}
            alt={authorName}
            className="w-32 h-32 rounded-full object-cover border-4 border-dnd-gold shadow-lg grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        <h3 className="text-3xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-1">
          {authorName}
        </h3>

        {authorAlias && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-dnd-crimson/40 mb-4">
            Known as // {authorAlias}
          </span>
        )}

        {authorWebsite && (
          <a
            href={authorWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-dnd-crimson/60 hover:text-dnd-crimson transition-colors mb-8"
          >
            <Globe size={14} />
            Digital Signal
          </a>
        )}

        {booksWritten && booksWritten.length > 0 && (
          <div className="w-full pt-6 border-t border-dnd-crimson/10">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
              <BookOpen size={16} />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Compiled Tomes</span>
            </div>
            <div className="space-y-2">
              {booksWritten.map((book, index) => (
                <Link
                  key={index}
                  to={`/stories/books/${book.bookId}`}
                  className="block text-sm font-arvo font-bold text-dnd-crimson/80 hover:text-dnd-crimson transition-colors"
                >
                  {book.bookTitle}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DndAuthorCard;
