import React, { useState } from 'react';

const ListInputModal = ({ isOpen, onClose, onSave }) => {
  const [list, setList] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-2xl w-full max-w-md border border-zinc-700">
        <h2 className="text-2xl font-arvo font-normal mb-4">Load from List</h2>
        <textarea
          className="w-full h-48 p-2 bg-gray-900/50 rounded-md border border-gray-700"
          value={list}
          onChange={(e) => setList(e.target.value)}
          placeholder="Paste your list here, each line is an entry (max 30 entries)"
        />
        <p className="text-sm text-gray-400 mt-2">Only the first 30 entries will be added.</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out border-app/100 bg-app/50 text-white hover:bg-app/70"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListInputModal;
