import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import '../styles/PickerWheel.css';
import colors from '../config/colors';
import { Trash } from '@phosphor-icons/react';
import ListInputModal from './ListInputModal';

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

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

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
      ctx.font = '30px Arial';
      ctx.translate(
        width / 2 + Math.cos(angle + arc / 2) * (width / 2 - 80),
        height / 2 + Math.sin(angle + arc / 2) * (height / 2 - 80),
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      const text = entries[i];
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
    if (e.key === 'Enter') {
      addEntry();
    }
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
          const pinY = 30; // Position of the pin
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
    <div
      className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-start relative w-full flex-grow"
      style={cardStyle}
    >
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      ></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
          {' '}
          Picker Wheel{' '}
        </h1>
        <hr className="border-gray-700 mb-4" />
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <div className="picker-wheel-container mt-8">
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
                  className="spin-button"
                  disabled={spinning || entries.length < 2}
                >
                  {spinning ? '...' : winner ? winner : 'Spin'}
                </button>
              </div>
            </div>
            <div className="winner mt-4">
              {spinning
                ? 'Spinning...'
                : winner
                  ? `The winner is: ${winner}`
                  : ''}
            </div>
          </div>
          <div className="w-full max-w-lg ml-16">
            <div className="controls">
              <input
                ref={newEntryInputRef}
                type="text"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add an option (max 30)"
                className="bg-gray-800 text-white p-2 rounded-lg flex-grow"
                disabled={entries.length >= 30}
              />
              <button
                onClick={addEntry}
                className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out border-app/100 bg-app/50 text-white hover:bg-app/70"
                disabled={entries.length >= 30}
              >
                Add
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center w-full gap-2 text-lg font-arvo font-normal px-4 py-2 mt-4 rounded-md border transition-colors duration-300 ease-in-out border-app/100 bg-app/50 text-white hover:bg-app/70"
            >
              Load from List
            </button>
            <div className="w-full mt-4">
              <h2 className="text-2xl font-arvo font-normal mb-4">
                Entries ({entries.length})
              </h2>
              <ul className="space-y-2">
                {entries.map((entry, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-800/75 p-2 rounded-lg"
                  >
                    <span className="flex-grow text-center">{entry}</span>
                    <button
                      onClick={() => deleteEntry(index)}
                      className="flex items-center gap-2 text-lg font-mono font-normal px-2 py-2 rounded-md border transition-colors duration-300 ease-in-out border-app/100 bg-app/50 text-white hover:bg-app/70"
                    >
                      <Trash size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-start relative w-full flex-grow mt-8"
        style={cardStyle}
      >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        ></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-arvo font-normal mb-4">How it works</h2>
          <p className="text-gray-400">
            ✦ Add entries one by one using the input field and "Add" button, or
            load a list of entries using the "Load from List" button. <br />
            ✦ The wheel will display the entries as equal divisions. <br />
            ✦ Click the "Spin" button to spin the wheel. It will spin fast and
            then slowly get slower, eventually stopping on a winner. <br />
            ✦ The winner will be displayed below the wheel and in the center of
            the wheel. <br />
          </p>
        </div>
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
