import React, { useRef, useState } from 'react';
import { UploadSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import DraggableItem from './DraggableItem';

const ItemPool = ({
    items,
    onDrop,
    onDragOver,
    onDragStart,
    onAddItems,
    onDelete
}) => {
  const fileInputRef = useRef(null);
  const [textInput, setTextInput] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            newItems.push({
                id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'image',
                content: event.target.result
            });
            if (newItems.length === files.length) {
                onAddItems(newItems);
            }
        };
        reader.readAsDataURL(file);
    });
    // Reset input
    e.target.value = null;
  };

  const handleTextAdd = () => {
      if (!textInput.trim()) return;
      const newItem = {
          id: `txt-${Date.now()}`,
          type: 'text',
          content: textInput.trim()
      };
      onAddItems([newItem]);
      setTextInput('');
  };

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          handleTextAdd();
      }
  };

  const handleDrop = (e) => {
    onDrop(e, 'pool');
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] p-4 rounded-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold whitespace-nowrap">
            Unranked_Assets ({items.length})
        </h3>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
             <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-sm px-2">
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add text item..."
                    className="bg-transparent border-none text-xs font-mono text-white focus:ring-0 w-32 placeholder-gray-600"
                />
                <button
                    onClick={handleTextAdd}
                    className="text-emerald-500 hover:text-emerald-400 p-1"
                >
                    <PlusIcon weight="bold" />
                </button>
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors text-xs font-mono uppercase text-emerald-400"
            >
                <UploadSimpleIcon size={14} weight="bold"/>
                <span>Upload</span>
            </button>
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
      </div>

      <div
        className="min-h-[120px] bg-black/40 border border-white/5 border-dashed rounded-sm p-4 flex flex-wrap gap-2 transition-colors hover:border-white/10"
        onDrop={handleDrop}
        onDragOver={onDragOver}
      >
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            onDragStart={(e) => onDragStart(e, item.id, 'pool')}
            onDelete={(itemId) => onDelete(itemId, 'pool')}
          />
        ))}
         {items.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center text-gray-600 py-8 gap-2 pointer-events-none">
                <PlusIcon size={24} />
                <span className="font-mono text-xs uppercase tracking-widest">Upload or drop items here</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default ItemPool;
