import React from 'react';

const NotebookCover = ({ title }) => {
    return (
        <div className="w-full h-64 bg-[#d2b48c] rounded-lg shadow-md flex items-center justify-center p-4">
            <h2 className="text-white text-xl font-bold text-center">{title}</h2>
        </div>
    );
};

export default NotebookCover;
