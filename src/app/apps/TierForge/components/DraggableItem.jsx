import React from 'react';
import { XCircleIcon } from '@phosphor-icons/react';

const DraggableItem = ({ item, onDragStart, onDelete }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      className="relative group w-20 h-20 bg-black/50 border border-white/10 rounded-sm overflow-hidden cursor-grab active:cursor-grabbing hover:border-emerald-500/50 transition-colors shrink-0"
    >
      {item.type === 'image' ? (
        <img
          src={item.content}
          alt="Tier Item"
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <div className="w-full h-full grid place-items-center p-1 bg-[#111] text-white overflow-hidden">
          <span className="item-text-content text-[10px] font-mono text-center break-words leading-tight w-full">
            {item.content}
          </span>
        </div>
      )}

      <button
        onClick={() => onDelete(item.id)}
        className="absolute top-0 right-0 bg-black/80 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-bl-sm hover:text-red-400"
        title="Remove Item"
        data-html2canvas-ignore
      >
        <XCircleIcon size={16} weight="fill" />
      </button>
    </div>
  );
};

export default DraggableItem;
