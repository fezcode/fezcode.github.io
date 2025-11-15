import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotebookCover from "./NotebookCover";

const NotebooksPage = () => {
    const [notebooks, setNotebooks] = useState([]);

    useEffect(() => {
        fetch('/notebooks/notebooks.json')
            .then(response => response.json())
            .then(data => setNotebooks(data))
            .catch(error => console.error('Error fetching notebooks:', error));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Notebooks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {notebooks.map(notebook => (
                    <Link key={notebook.id} to={`/notebooks/${notebook.id}`}>
                        <NotebookCover title={notebook.title} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NotebooksPage;
