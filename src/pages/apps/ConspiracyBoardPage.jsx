import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PushPinIcon,
  TrashIcon,
  LinkBreakIcon,
  CameraIcon,
  NotePencilIcon,
  TextTIcon,
  DownloadSimpleIcon
} from '@phosphor-icons/react';
import domtoimage from 'dom-to-image-more';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const BOARD_TEXTURE = `radial-gradient(#d2a679 1px, transparent 1px), radial-gradient(#d2a679 1px, transparent 1px)`;

const ConspiracyBoardPage = () => {
  useSeo({
    title: 'The Conspiracy Board | Fezcodex',
    description: 'Connect the dots, find the truth. A digital corkboard for your wildest theories.',
    keywords: ['conspiracy', 'detective', 'board', 'mindmap', 'red string', 'theory'],
  });

  const [items, setItems] = useState([
    { id: 'header-note', type: 'header', text: 'PROJECT: UNVEILING THE HIDDEN ARCHITECTURE', x: 200, y: 40, rotation: -2 },
    { id: '1', type: 'note', text: 'THEY ARE WATCHING', x: 100, y: 150, color: '#fff9c4', rotation: -5 },
    { id: '2', type: 'polaroid', src: '', x: 400, y: 100, rotation: 10 },
    { id: '3', type: 'note', text: 'FOLLOW THE WHITE RABBIT', x: 250, y: 400, color: '#ffccbc', rotation: 2 },
  ]);

  const [connections, setConnections] = useState([
    { from: '1', to: '2' },
    { from: '2', to: '3' }
  ]);

  const [linkingFrom, setLinkingFrom] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const boardRef = useRef(null);

  const downloadBoard = async () => {
    if (boardRef.current) {
      const buttons = boardRef.current.querySelectorAll('.item-actions');
      const toolbar = boardRef.current.querySelector('.toolbar');
      const ambientText = boardRef.current.querySelector('.ambient-text');

      buttons.forEach(b => b.style.display = 'none');
      if (toolbar) toolbar.style.display = 'none';
      if (ambientText) ambientText.style.display = 'none';

      try {
        const dataUrl = await domtoimage.toPng(boardRef.current, {
          quality: 1,
          bgcolor: '#8b5e3c',
          width: boardRef.current.scrollWidth,
          height: boardRef.current.scrollHeight,
        });

        const link = document.createElement('a');
        link.download = `conspiracy-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Download failed', error);
      } finally {
        buttons.forEach(b => b.style.display = '');
        if (toolbar) toolbar.style.display = '';
        if (ambientText) ambientText.style.display = '';
      }
    }
  };

  const handlePointerDown = (e, item) => {
    if (e.target.closest('button') || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    setDraggingId(item.id);
    dragOffset.current = { x: e.clientX - item.x, y: e.clientY - item.y };
  };

  const handlePointerMove = (e) => {
    if (draggingId) {
      setItems(prev => prev.map(item => item.id === draggingId ? { ...item, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } : item));
    }
  };

  const handlePointerUp = () => setDraggingId(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => addItem('polaroid', event.target.result);
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const addItem = (type, imgSrc = null) => {
    const newItem = {
      id: Date.now().toString(),
      type: type,
      text: type === 'note' ? 'New Evidence...' : type === 'header' ? 'TOP SECRET' : '',
      src: imgSrc || '',
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      color: ['#fff9c4', '#ffccbc', '#c8e6c9', '#bbdefb'][Math.floor(Math.random() * 4)],
      rotation: (Math.random() - 0.5) * 20,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
  };

  const toggleLink = (id) => {
    if (!linkingFrom) {
      setLinkingFrom(id);
    } else if (linkingFrom === id) {
      setLinkingFrom(null);
    } else {
      const exists = connections.find(c => (c.from === linkingFrom && c.to === id) || (c.from === id && c.to === linkingFrom));
      if (exists) {
        setConnections(connections.filter(c => c !== exists));
      } else {
        setConnections([...connections, { from: linkingFrom, to: id }]);
      }
      setLinkingFrom(null);
    }
  };

  return (
    <div
      ref={boardRef}
      className="min-h-screen relative overflow-hidden bg-[#8b5e3c] cursor-crosshair"
      style={{ backgroundImage: BOARD_TEXTURE, backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none shadow-inner" />

      <div className="toolbar absolute top-6 left-6 z-50 flex gap-4 pointer-events-auto transition-opacity duration-300">
         <Link to="/apps" className="bg-[#5d4037] text-[#efebe9] px-6 py-3 font-mono border-2 border-[#3e2723] shadow-[4px_4px_0px_#3e2723] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
            <ArrowLeftIcon weight="bold" />
            <span>EXIT BOARD</span>
         </Link>
         <button onClick={() => addItem('note')} className="bg-[#fff9c4] text-[#3e2723] p-3 border-2 border-[#3e2723] shadow-[4px_4px_0px_#3e2723] hover:scale-105 transition-transform"><NotePencilIcon size={24} weight="bold" /></button>
         <button onClick={() => addItem('header')} className="bg-[#efebe9] text-[#3e2723] p-3 border-2 border-[#3e2723] shadow-[4px_4px_0px_#3e2723] hover:scale-105 transition-transform"><TextTIcon size={24} weight="bold" /></button>
         <button onClick={() => fileInputRef.current.click()} className="bg-white text-[#3e2723] p-3 border-2 border-[#3e2723] shadow-[4px_4px_0px_#3e2723] hover:scale-105 transition-transform"><CameraIcon size={24} weight="bold" /></button>
         <button onClick={downloadBoard} className="bg-blue-100 text-[#3e2723] p-3 border-2 border-[#3e2723] shadow-[4px_4px_0px_#3e2723] hover:scale-105 transition-transform"><DownloadSimpleIcon size={24} weight="bold" /></button>
         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {connections.map((conn) => {
          const from = items.find(it => it.id === conn.from);
          const to = items.find(it => it.id === conn.to);
          if (!from || !to) return null;
          const fromX = from.x + (from.type === 'note' ? 96 : from.type === 'header' ? 300 : 112);
          const toX = to.x + (to.type === 'note' ? 96 : to.type === 'header' ? 300 : 112);
          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={fromX} y1={from.y + 5} x2={toX} y2={to.y + 5}
              stroke="#d32f2f" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
              style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, rotate: item.rotation - 20 }}
              animate={{ scale: 1, rotate: item.rotation }}
              exit={{ scale: 0, opacity: 0 }}
              onPointerDown={(e) => handlePointerDown(e, item)}
              className={`absolute cursor-grab active:cursor-grabbing shadow-2xl select-none z-20 ${
                item.type === 'note' ? 'w-48 bg-transparent' : item.type === 'header' ? 'w-[600px] bg-[#efebe9]' : 'w-56 bg-white'
              } ${linkingFrom === item.id ? 'ring-4 ring-red-500' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                backgroundColor: item.type === 'note' ? item.color : undefined,
                zIndex: draggingId === item.id ? 50 : 20
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-600 drop-shadow-md z-30 pointer-events-none">
                <PushPinIcon weight="fill" size={32} />
              </div>

              {item.type === 'header' ? (
                  <div className="py-4 px-4 border-b-4 border-double border-[#3e2723]">
                      <textarea
                        className="bg-transparent border-none outline-none w-full text-4xl font-playfairDisplay font-black text-[#3e2723] leading-tight text-center resize-none overflow-hidden"
                        defaultValue={item.text}
                        rows={2}
                        onChange={(e) => { item.text = e.target.value }}
                      />
                  </div>
              ) : item.type === 'note' ? (
                <div className="p-6">
                   <textarea
                     className="bg-transparent border-none outline-none w-full h-24 text-[#3e2723] font-arvo font-bold text-lg resize-none"
                     defaultValue={item.text}
                     onChange={(e) => { item.text = e.target.value }}
                   />
                </div>
              ) : (
                <div className="p-4 pb-10">
                   <div className="aspect-square bg-gray-200 overflow-hidden mb-4 border border-gray-100 relative">
                      {item.src ? (
                          <img src={item.src} alt="Evidence" className="w-full h-full object-cover grayscale sepia contrast-125" draggable={false} />
                      ) : (
                          <GenerativeArt seed={item.id} className="w-full h-full grayscale sepia contrast-125" />
                      )}
                      <div className="absolute inset-0 bg-[#3e2723] mix-blend-overlay opacity-20 pointer-events-none" />
                   </div>
                   <p className="font-mono text-[10px] text-gray-400 text-center uppercase tracking-widest">
                     FILE_ID: {item.id.slice(-6)}
                   </p>
                </div>
              )}

              <div className="item-actions absolute -bottom-10 left-0 right-0 flex justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={() => toggleLink(item.id)} className={`p-2 rounded-full shadow-lg ${linkingFrom === item.id ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}><LinkBreakIcon weight="bold" /></button>
                <button onClick={() => deleteItem(item.id)} className="p-2 bg-white text-red-600 rounded-full shadow-lg"><TrashIcon weight="bold" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ambient-text absolute bottom-6 right-6 font-mono text-sm text-[#5d4037] opacity-50 uppercase tracking-[0.5em] pointer-events-none transition-opacity duration-300 flex flex-col items-end gap-2">
        <BreadcrumbTitle title="Conspiracy Board" slug="cb" variant="brutalist" className="!text-[#5d4037]" />
        <span>Everything is connected</span>
      </div>
    </div>
  );
};

export default ConspiracyBoardPage;
