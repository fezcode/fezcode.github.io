import React from 'react';
import { Link } from 'react-router-dom';

const DndAuthorCard = ({ authorName, authorWebsite, authorImage, authorAlias, booksWritten }) => {
  return (
    <div className="dnd-author-card">
      <img src={authorImage} alt={authorName} className="dnd-author-image" />
      <h3 className="dnd-author-name">{authorName}</h3>
      {authorAlias && (
        <p className="dnd-author-alias">
          <span className="dnd-author-label">Alias:</span> {authorAlias}
        </p>
      )}
      {authorWebsite && (
        <p className="dnd-author-website">
          <a href={authorWebsite} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        </p>
      )}
      {booksWritten && booksWritten.length > 0 && (
        <div className="dnd-author-books">
          <h4>Books:</h4>
          <hr className="dnd-author-books-separator" />
          <ul>
            {booksWritten.map((book, index) => (
              <li key={index}>
                <Link to={`/stories/books/${book.bookId}`}>{book.bookTitle}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DndAuthorCard;
