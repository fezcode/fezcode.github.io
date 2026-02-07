import React, { useState, useEffect } from 'react';
import BrutalistDialog from '../../../../components/BrutalistDialog';

const AdjustFastModal = ({ isOpen, onClose, fast, onUpdate }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [targetLength, setTargetLength] = useState(16);

  useEffect(() => {
    if (fast && isOpen) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const start = new Date(fast.start);
      start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
      setStartTime(start.toISOString().slice(0, 16));

      if (fast.end) {
        const end = new Date(fast.end);
        end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
        setEndTime(end.toISOString().slice(0, 16));
      } else {
        setEndTime('');
      }
      setTargetLength(fast.targetLength || 16);
    }
  }, [fast, isOpen]);

  const handleSave = () => {
    const updatedData = {
      start: new Date(startTime).getTime(),
      targetLength: parseInt(targetLength),
    };
    if (endTime) {
      updatedData.end = new Date(endTime).getTime();
    }
    onUpdate(fast.id, updatedData);
    onClose();
  };

  if (!fast) return null;

  return (
    <BrutalistDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Fasting Time"
      variant="paper"
    >
      <div className="space-y-8 py-6 font-arvo text-[#1a1a1a]">
        <p className="text-[10px] font-mono font-black uppercase tracking-widest border-b border-[#1a1a1a]/10 pb-2">
          Change your fasting hours
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3 font-bold">
              Started At
            </label>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-4 text-lg text-[#1a1a1a] focus:outline-none font-mono font-black"
            />
          </div>

          {fast.end && (
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3 font-bold">
                Ended At
              </label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-4 text-lg text-[#1a1a1a] focus:outline-none font-mono font-black"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3 font-bold">
              Goal (Hours)
            </label>

            <input
              type="number"
              value={targetLength}
              onChange={(e) => setTargetLength(e.target.value)}
              className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-4 text-2xl text-[#1a1a1a] focus:outline-none font-mono font-black"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-5 bg-[#1a1a1a] text-[#e9e4d0] font-black uppercase tracking-[0.4em] hover:opacity-90 transition-all text-xs mt-8 shadow-xl"
        >
          Confirm Changes
        </button>
      </div>
    </BrutalistDialog>
  );
};

export default AdjustFastModal;
