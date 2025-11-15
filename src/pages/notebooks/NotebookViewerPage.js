import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/notebook.css';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const Page = ({ content, pageNumber, title }) => {
    return (
        <div className="page">
            <div className="page-inner">
                <div className="notebook-header">{title}</div>
                <div className="page-content">
                    <p>{content}</p>
                </div>
                <div className="notebook-footer">Page {pageNumber}</div>
            </div>
        </div>
    );
};

const NotebookCover = ({ title, author, date }) => {
    return (
        <div className="page notebook-cover">
            <div className="page-inner">
                <h2>{title}</h2>
                {author && <p className="author">{author}</p>}
                {date && <p className="date">{date}</p>}
            </div>
        </div>
    );
};

const NotebookViewerPage = () => {
    const { notebookId } = useParams();
    const [notebook, setNotebook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        fetch(`/notebooks/${notebookId}.json`)
            .then(response => response.json())
            .then(data => setNotebook(data))
            .catch(error => console.error('Error fetching notebook:', error));

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [notebookId]);

    const handleNextPage = () => {
        if (notebook) {
            const pageIncrement = isMobile ? 1 : 2;
            setCurrentPage(prev => Math.min(prev + pageIncrement, notebook.pages.length + 1));
        }
    };

    const handlePrevPage = () => {
        const pageDecrement = isMobile ? 1 : 2;
        setCurrentPage(prev => Math.max(prev - pageDecrement, 0));
    };

    if (!notebook) {
        return <div>Loading notebook...</div>;
    }

    const renderPages = () => {
        if (currentPage === 0) {
            return <NotebookCover title={notebook.title} author={notebook.author} date={notebook.date} />;
        }
        if (currentPage > notebook.pages.length) {
            return <NotebookCover title="The End" />;
        }

        if (isMobile) {
            return <Page content={notebook.pages[currentPage - 1]} pageNumber={currentPage} title={notebook.title} />;
        }

        return (
            <div style={{ display: 'flex', width: '100%' }}>
                <Page content={notebook.pages[currentPage - 1]} pageNumber={currentPage} title={notebook.title} />
                {currentPage < notebook.pages.length && (
                    <Page content={notebook.pages[currentPage]} pageNumber={currentPage + 1} title={notebook.title} />
                )}
            </div>
        );
    };

    return (
        <div className="notebook-container">
            <div className="book">
                {currentPage > 0 && (
                    <div className="clickable-edge left" onClick={handlePrevPage}>
                        <CaretLeft size={32} />
                    </div>
                )}
                {renderPages()}
                {notebook && currentPage < notebook.pages.length + 1 && (
                    <div className="clickable-edge right" onClick={handleNextPage}>
                        <CaretRight size={32} />
                    </div>
                )}
            </div>
            {notebook && (
                <div className="slider-container">
                    <input
                        type="range"
                        min="0"
                        max={notebook.pages.length + 1}
                        value={currentPage}
                        onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                        className="slider"
                    />
                    <div className="page-number-display">
                        Page {currentPage} of {notebook.pages.length + 1}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotebookViewerPage;