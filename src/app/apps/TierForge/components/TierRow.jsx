import React, { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  GearIcon,
  FloppyDiskIcon
} from '@phosphor-icons/react';
import DraggableItem from './DraggableItem';
import CustomColorPicker from '../../../../components/CustomColorPicker';
import BrutalistModal from '../../../../components/BrutalistModal';

const TierRow = ({
  tier,
  onDrop,
  onDragOver,
  onDragStart,
  onUpdateTier,
  onDeleteTier,
  onMoveUp,
  onMoveDown,
  onDeleteItem,
  isFirst,
  isLast
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(tier.label);
  const [tempColor, setTempColor] = useState(tier.color);

  const handleDrop = (e) => {
    onDrop(e, tier.id);
  };

  const openModal = () => {
    setTempLabel(tier.label);
    setTempColor(tier.color);
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    onUpdateTier(tier.id, { label: tempLabel, color: tempColor });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex w-full min-h-[100px] border-b border-white/10 last:border-b-0 bg-[#0a0a0a]">
        {/* Label / Header */}
        <div
          className="w-24 md:w-32 flex-shrink-0 flex flex-col justify-center items-center p-2 border-r border-white/10 relative group overflow-hidden"
          style={{ backgroundColor: tier.color }}
        >
          <span
            className="text-black font-black text-xl md:text-3xl uppercase tracking-wider text-center select-none cursor-pointer break-words w-full"
            style={{ textShadow: '0 2px 0 rgba(255,255,255,0.2)' }}
            onDoubleClick={openModal}
          >
            {tier.label}
          </span>

          {/* Controls Overlay */}
          <div
            data-html2canvas-ignore
            className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2"
          >
            <div className="flex gap-1">
              <button
                onClick={() => onMoveUp(tier.id)}
                disabled={isFirst}
                className="p-1 text-white hover:text-emerald-400 disabled:opacity-30"
              >
                <ArrowUpIcon weight="bold" />
              </button>
              <button
                onClick={() => onMoveDown(tier.id)}
                disabled={isLast}
                className="p-1 text-white hover:text-emerald-400 disabled:opacity-30"
              >
                <ArrowDownIcon weight="bold" />
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={openModal}
                className="p-1 text-white hover:text-blue-400"
              >
                <GearIcon weight="bold" />
              </button>
              <button
                onClick={() => onDeleteTier(tier.id)}
                className="p-1 text-white hover:text-red-400"
              >
                <TrashIcon weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Items Area */}
        <div
          className="flex-1 p-2 flex flex-wrap gap-2 content-start transition-colors"
          onDrop={handleDrop}
          onDragOver={onDragOver}
        >
          {tier.items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onDragStart={(e) => onDragStart(e, item.id, tier.id)}
              onDelete={(itemId) => onDeleteItem(itemId, tier.id)}
            />
          ))}
          {tier.items.length === 0 && (
            <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-10">
              <span className="font-mono text-xs uppercase tracking-widest">Drop items here</span>
            </div>
          )}
        </div>
      </div>

      <BrutalistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={{ label: 'Edit Tier', description: 'Modify tier properties.' }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-[9px] uppercase text-gray-500 tracking-widest">
              Tier Label
            </label>
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none rounded-sm transition-colors"
              placeholder="ENTER LABEL..."
            />
          </div>

          <CustomColorPicker
            label="Tier Color"
            value={tempColor}
            onChange={setTempColor}
            variant="brutalist"
          />

          <div className="pt-4">
            <button
              onClick={handleSaveChanges}
              className="group flex items-center gap-3 bg-white text-black px-6 py-3 font-mono font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all w-full justify-center"
            >
              <span>Save Changes</span>
              <FloppyDiskIcon weight="bold" size={16} />
            </button>
          </div>
        </div>
      </BrutalistModal>
    </>
  );
};

export default TierRow;
