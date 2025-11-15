import React from 'react';

const NotebookCover = ({ title }) => {
    return (
        <div className="relative w-full pb-[141.4%] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 p-4"> {/* Added padding here to create space for the inner border */}
                <div className="w-full h-full border-2 border-gray-300 flex items-center justify-center p-2"> {/* Inner border div */}
                    <h2 className="text-gray-800 text-xl font-bold text-center font-playfairDisplay">{title}</h2>
                </div>
            </div>
        </div>
    );
};

export default NotebookCover;
