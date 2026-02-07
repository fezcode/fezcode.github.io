import React, { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  ArrowCounterClockwiseIcon,
  CameraIcon,
  FloppyDiskIcon,
  DownloadSimpleIcon,
  EraserIcon,
  InfoIcon,
} from '@phosphor-icons/react';
import html2canvas from 'html2canvas';
import TierRow from './components/TierRow';
import ItemPool from './components/ItemPool';
import { useToast } from '../../../hooks/useToast';
import BrutalistDialog from '../../../components/BrutalistDialog';

const DEFAULT_TIERS = [
  { id: 't1', label: 'S', color: '#ff7f7f', items: [] },
  { id: 't2', label: 'A', color: '#ffbf7f', items: [] },
  { id: 't3', label: 'B', color: '#ffdf7f', items: [] },
  { id: 't4', label: 'C', color: '#ffff7f', items: [] },
  { id: 't5', label: 'D', color: '#bfff7f', items: [] },
];

const LOCAL_STORAGE_KEY = 'fezcodex_tier_forge_data';

const TierForge = () => {
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [poolItems, setPoolItems] = useState([]);
  const [dragData, setDragData] = useState(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });
  const chartRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setHasSavedData(true);
    }
  }, []);

  const handleDragStart = (e, itemId, sourceId) => {
    setDragData({ itemId, sourceId });
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId, sourceId }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();

    let data;
    try {
      // Fallback for data if state isn't reliable (rare but possible in some DnD scenarios)
      const rawData = e.dataTransfer.getData('text/plain');
      if (!rawData) return;

      data = dragData || JSON.parse(rawData);
    } catch (error) {
      // Ignored, likely external drag
      addToast({
        title: 'Invalid Drop',
        message: 'Only Tier Forge items can be dropped here.',
        type: 'error',
      });
      return;
    }

    if (!data || !data.itemId || !data.sourceId) {
      addToast({
        title: 'Invalid Drop',
        message: 'Unknown item format.',
        type: 'error',
      });
      return;
    }

    const { itemId, sourceId } = data;

    if (sourceId === targetId) return; // Dropped in same place (for now, no reorder within same container logic implemented)

    // Find Item
    let item;
    if (sourceId === 'pool') {
      item = poolItems.find((i) => i.id === itemId);
    } else {
      const sourceTier = tiers.find((t) => t.id === sourceId);
      item = sourceTier.items.find((i) => i.id === itemId);
    }

    if (!item) return;

    // Remove from Source
    if (sourceId === 'pool') {
      setPoolItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id === sourceId) {
            return { ...t, items: t.items.filter((i) => i.id !== itemId) };
          }
          return t;
        }),
      );
    }

    // Add to Target
    if (targetId === 'pool') {
      setPoolItems((prev) => [...prev, item]);
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id === targetId) {
            return { ...t, items: [...t.items, item] };
          }
          return t;
        }),
      );
    }

    setDragData(null);
  };

  const addTier = () => {
    const newTier = {
      id: `t-${Date.now()}`,
      label: 'NEW',
      color: '#cccccc',
      items: [],
    };
    setTiers([...tiers, newTier]);
  };

  const updateTier = (id, updates) => {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTier = (id) => {
    const tierToDelete = tiers.find((t) => t.id === id);
    // Return items to pool
    setPoolItems((prev) => [...prev, ...tierToDelete.items]);
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const moveTier = (id, direction) => {
    const index = tiers.findIndex((t) => t.id === id);
    if (index < 0) return;

    const newTiers = [...tiers];
    if (direction === 'up' && index > 0) {
      [newTiers[index], newTiers[index - 1]] = [
        newTiers[index - 1],
        newTiers[index],
      ];
    } else if (direction === 'down' && index < newTiers.length - 1) {
      [newTiers[index], newTiers[index + 1]] = [
        newTiers[index + 1],
        newTiers[index],
      ];
    }
    setTiers(newTiers);
  };

  const deleteItem = (itemId, sourceId) => {
    if (sourceId === 'pool') {
      setPoolItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id === sourceId) {
            return { ...t, items: t.items.filter((i) => i.id !== itemId) };
          }
          return t;
        }),
      );
    }
  };

  const closeConfirmation = () => {
    setConfirmation({ ...confirmation, isOpen: false });
  };

  const handleReset = () => {
    setConfirmation({
      isOpen: true,
      title: 'RESET_PROTOCOL',
      message: 'Reset all tiers? Current items will be returned to the pool.',
      confirmText: 'EXECUTE_RESET',
      onConfirm: () => {
        const allItems = tiers.flatMap((t) => t.items);
        setPoolItems((prev) => [...prev, ...allItems]);
        setTiers(DEFAULT_TIERS.map((t) => ({ ...t, items: [] })));
        addToast({ title: 'Reset', message: 'Board reset to defaults.' });
        closeConfirmation();
      },
    });
  };

  const handleClear = () => {
    setConfirmation({
      isOpen: true,
      title: 'CLEAR_DATA',
      message:
        'WARNING: This will permanently remove ALL items from the board and pool.',
      confirmText: 'PURGE_ALL',
      onConfirm: () => {
        setPoolItems([]);
        setTiers(DEFAULT_TIERS.map((t) => ({ ...t, items: [] })));
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setHasSavedData(false);
        addToast({ title: 'Cleared', message: 'All data purged.' });
        closeConfirmation();
      },
    });
  };

  const handleSaveToLocal = () => {
    try {
      const data = { tiers, poolItems, timestamp: Date.now() };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setHasSavedData(true);
      addToast({ title: 'Saved', message: 'Layout saved to local storage.' });
    } catch (error) {
      console.error('Save failed:', error);
      addToast({
        title: 'Error',
        message: 'Failed to save data.',
        type: 'error',
      });
    }
  };

  const handleLoadFromLocal = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) {
        addToast({
          title: 'No Data',
          message: 'No saved layout found.',
          type: 'info',
        });
        return;
      }
      const { tiers: savedTiers, poolItems: savedPool } = JSON.parse(saved);

      setConfirmation({
        isOpen: true,
        title: 'LOAD_PROTOCOL',
        message: 'Load saved layout? Current unsaved changes will be lost.',
        confirmText: 'LOAD_DATA',
        onConfirm: () => {
          setTiers(savedTiers || DEFAULT_TIERS);
          setPoolItems(savedPool || []);
          addToast({ title: 'Loaded', message: 'Layout loaded successfully.' });
          closeConfirmation();
        },
      });
    } catch (error) {
      console.error('Load failed:', error);
      addToast({
        title: 'Error',
        message: 'Failed to load data.',
        type: 'error',
      });
    }
  };

  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      addToast({
        title: 'Processing',
        message: 'Generating image artifact...',
      });
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#050505',
        useCORS: true,
        allowTaint: true,
        scale: 2, // Higher quality
        scrollX: 0,
        scrollY: -window.scrollY, // Fix for scrolled content
        onclone: (document) => {
          // Ensure the cloned chart has correct overflow to capture everything
          const chart = document.getElementById('tier-forge-chart');
          if (chart) {
            chart.style.overflow = 'visible';
            chart.style.height = 'auto';
          }

          // Fix vertical alignment for text in capture (html2canvas often renders text lower)
          const labels = document.querySelectorAll('.tier-label-text');
          labels.forEach((label) => {
            label.style.transform = 'translateY(-10px)'; // Nudge text up
          });

          const items = document.querySelectorAll('.item-text-content');
          items.forEach((item) => {
            item.style.transform = 'translateY(-4px)';
          });
        },
      });

      const link = document.createElement('a');
      link.download = `tier-forge-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      addToast({ title: 'Success', message: 'Artifact captured.' });
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Error',
        message: 'Failed to capture artifact.',
        type: 'error',
      });
    }
  };

  const handleAddItemsToPool = (newItems) => {
    setPoolItems((prev) => [...prev, ...newItems]);
    addToast({
      title: 'Uploaded',
      message: `${newItems.length} assets added to pool.`,
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/10 bg-white/[0.02] rounded-sm">
        <div className="flex gap-2">
          <button
            onClick={addTier}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 rounded-sm transition-all text-xs font-bold uppercase tracking-widest"
          >
            <PlusIcon weight="bold" />
            Add Tier
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 rounded-sm transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ArrowCounterClockwiseIcon weight="bold" />
            Reset
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-sm transition-all text-xs font-bold uppercase tracking-widest"
          >
            <EraserIcon weight="bold" />
            Clear
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={handleSaveToLocal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 rounded-sm transition-all text-xs font-bold uppercase tracking-widest"
            title="Save to Browser Storage"
          >
            <FloppyDiskIcon weight="bold" />
            Save
          </button>
          <button
            onClick={handleLoadFromLocal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/20 rounded-sm transition-all text-xs font-bold uppercase tracking-widest"
            title="Load from Browser Storage"
          >
            <DownloadSimpleIcon weight="bold" />
            Load
          </button>
          {hasSavedData && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm animate-pulse">
              <InfoIcon weight="fill" className="text-emerald-500" size={12} />
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">
                Saved Data Exists
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-sm transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <CameraIcon weight="fill" size={16} />
          Capture Artifact
        </button>
      </div>

      {/* Main Chart Area */}
      <div
        ref={chartRef}
        id="tier-forge-chart"
        className="flex flex-col border border-white/10 bg-[#050505] shadow-2xl"
      >
        {tiers.map((tier, index) => (
          <TierRow
            key={tier.id}
            tier={tier}
            isFirst={index === 0}
            isLast={index === tiers.length - 1}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onUpdateTier={updateTier}
            onDeleteTier={deleteTier}
            onMoveUp={(id) => moveTier(id, 'up')}
            onMoveDown={(id) => moveTier(id, 'down')}
            onDeleteItem={deleteItem}
          />
        ))}

        {/* Footer Branding for Export */}
        <div className="w-full bg-[#111] border-t border-white/10 p-2 text-center">
          <span className="text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black">
            FEZCODEX // TIER_FORGE
          </span>
        </div>
      </div>

      {/* Item Pool */}
      <ItemPool
        items={poolItems}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onAddItems={handleAddItemsToPool}
        onDelete={deleteItem}
      />

      <BrutalistDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
      />
    </div>
  );
};

export default TierForge;
