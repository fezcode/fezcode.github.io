import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import '../styles/PickerWheel.css';
import {
  TrashIcon,
  PlusIcon,
  ListBulletsIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react';
import ListInputModal from './ListInputModal';
import GenerativeArt from './GenerativeArt';

const PickerWheel = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const animationFrameId = useRef(null);
  const newEntryInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colorPalette = useMemo(
    () => [
      '#FDE2E4',
      '#E2ECE9',
      '#BEE1E6',
      '#F0EFEB',
      '#DFE7FD',
      '#CDDAFD',
      '#EAD5E6',
      '#F4C7C3',
      '#D6E2E9',
      '#B9E2E6',
      '#F9D8D6',
      '#D4E9E6',
      '#A8DADC',
      '#E9E4F2',
      '#D0D9FB',
      '#C0CFFB',
      '#E3C8DE',
      '#F1BDBD',
      '#C9D5DE',
      '#A1D5DB',
      '#F6C4C1',
      '#C1E0DA',
      '#92D2D2',
      '#E2DDF0',
      '#C3CEFA',
      '#B3C4FA',
      '#DBBBD1',
      '#EDB3B0',
      '#BCC8D3',
      '#8DCED1',
    ],
    [],
  );

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const arc = (2 * Math.PI) / (entries.length || 1);

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);
    ctx.translate(-width / 2, -height / 2);

    for (let i = 0; i < entries.length; i++) {
      const angle = i * arc;
      ctx.fillStyle = colorPalette[i % colorPalette.length];
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width / 2 - 10, angle, angle + arc);
      ctx.arc(width / 2, height / 2, 0, angle + arc, angle, true);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px "Space Mono"';
      ctx.translate(
        width / 2 + Math.cos(angle + arc / 2) * (width / 2 - 80),
        height / 2 + Math.sin(angle + arc / 2) * (height / 2 - 80),
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      const text = entries[i].toUpperCase();
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
    ctx.restore();
  }, [entries, rotation, colorPalette]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const getColorData = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
  };

  const addEntry = () => {
    if (newEntry.trim() && entries.length < 30) {
      setEntries([...entries, newEntry.trim()]);
      setNewEntry('');
      newEntryInputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addEntry();
  };

  const deleteEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const spin = () => {
    if (entries.length > 1 && !spinning) {
      setSpinning(true);
      setWinner(null);
      const duration = 7000;
      const startTime = performance.now();
      const startRotation = rotation;
      const randomSpins = Math.random() * 5 + 5;
      const endRotation = startRotation + randomSpins * 2 * Math.PI;

      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOut(progress);

        const newRotation =
          startRotation + (endRotation - startRotation) * easedProgress;
        setRotation(newRotation);

        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const pinX = canvas.width / 2;
          const pinY = 30;
          const pixel = ctx.getImageData(pinX, pinY, 1, 1).data;
          const pixelColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          for (let i = 0; i < entries.length; i++) {
            const colorData = getColorData(
              colorPalette[i % colorPalette.length],
            );
            const color = `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})`;
            if (color === pixelColor) {
              setWinner(entries[i]);
              break;
            }
          }
          setSpinning(false);
        }
      };

      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  const handleSaveList = (list) => {
    const newEntries = list
      .split('\n')
      .map((entry) => entry.trim())
      .filter((entry) => entry);
    setEntries([...entries, ...newEntries].slice(0, 30));
  };

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
          <GenerativeArt seed="picker-wheel" className="w-full h-full" />
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="flex flex-col items-center gap-8">
              <div className="picker-wheel-container">
                <div className="wheel-wrapper">
                  <div className="pin"></div>
                  <canvas
                    ref={canvasRef}
                    width="600"
                    height="600"
                    className={`wheel ${entries.length > 1 && !spinning ? 'slow-spin' : ''}`}
                  ></canvas>
                  <button
                    onClick={spin}
                    className="spin-button font-black uppercase tracking-widest text-xs"
                    disabled={spinning || entries.length < 2}
                  >
                    {spinning ? '...' : winner ? winner.toUpperCase() : 'SPIN'}
                  </button>
                </div>
              </div>

              <div className="h-12 flex items-center">
                {spinning ? (
                  <div className="flex items-center gap-3 text-emerald-500 font-mono text-xs uppercase tracking-[0.3em]">
                    <ArrowsClockwiseIcon className="animate-spin" />
                    <span>Spinning...</span>
                  </div>
                ) : winner ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      The winner is
                    </span>
                    <span className="text-3xl font-black text-white uppercase tracking-tighter italic">
                      {winner}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Options
                </h2>
                <div className="flex gap-4">
                  <input
                    ref={newEntryInputRef}
                    type="text"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add an option (max 30)"
                    className="flex-1 bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-emerald-500 outline-none transition-colors text-white"
                    disabled={entries.length >= 30}
                  />
                  <button
                    onClick={addEntry}
                    disabled={entries.length >= 30}
                    className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all disabled:opacity-20"
                  >
                    <PlusIcon weight="bold" size={20} />
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ListBulletsIcon weight="bold" size={16} />
                  Load from List
                </button>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  {entries.length} / 30 options added
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar-terminal pr-4">
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className="group/item flex items-center justify-between bg-white/5 border border-white/5 p-3 hover:border-white/20 transition-all"
                    >
                      <span className="text-xs font-mono uppercase truncate mr-2 text-white">
                        {entry}
                      </span>
                      <button
                        onClick={() => deleteEntry(index)}
                        className="p-1 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                      >
                        <TrashIcon size={14} weight="bold" />
                      </button>
                    </div>
                  ))}
                  {entries.length === 0 && (
                    <div className="col-span-full py-12 border border-dashed border-white/10 text-center">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        No options added
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <ArrowsClockwiseIcon weight="bold" className="text-emerald-500" />
          How it works
        </h2>
        <ul className="space-y-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
          <li>• Add entries one by one or load a list.</li>
          <li>• The wheel divides space equally among all options.</li>
          <li>• Click the center to spin.</li>
          <li>• The stop position is determined by physical pixel sampling.</li>
        </ul>
      </div>

      <ListInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveList}
      />
    </div>
  );
};

export default PickerWheel;
