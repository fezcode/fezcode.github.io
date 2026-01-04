import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  LayoutIcon,
  CalendarIcon,
  DatabaseIcon,
  InfoIcon
} from '@phosphor-icons/react';import useSeo from '../../hooks/useSeo';
import Dashboard from '../../app/apps/fasting-tracker/components/Dashboard';
import Planner from '../../app/apps/fasting-tracker/components/Planner';
import FoodDatabase from '../../app/apps/fasting-tracker/components/FoodDatabase';
import DetailsView from '../../app/apps/fasting-tracker/components/DetailsView';
import MealLogger from '../../app/apps/fasting-tracker/components/MealLogger';
import AdjustFastModal from '../../app/apps/fasting-tracker/components/AdjustFastModal';
import { useFastingData } from '../../app/apps/fasting-tracker/hooks/useFastingData';

const IntermittentFastingTrackerPage = () => {
  const appName = 'My Fasting Tracker';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Track your fasting periods and daily meals with ease.',
    keywords: ['fasting', 'intermittent fasting', 'tracker', 'nutrition', 'health'],
  });

  const fastingData = useFastingData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMealLoggerOpen, setIsMealLoggerOpen] = useState(false);
  const [prefilledFoodId, setPrefilledFoodId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Fast Adjustment State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [fastToAdjust, setFastToAdjust] = useState(null);

  const handleOpenMealLogger = (foodId = null) => {
    setPrefilledFoodId(foodId);
    setIsMealLoggerOpen(true);
  };

  const handleOpenAdjustModal = (fast) => {
    setFastToAdjust(fast);
    setIsAdjustModalOpen(true);
  };

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutIcon },
    { id: 'details', label: 'History', icon: InfoIcon },
    { id: 'planner', label: 'Daily Plan', icon: CalendarIcon },
    { id: 'database', label: 'Food List', icon: DatabaseIcon },
  ];

  return (
    <div className="min-h-screen bg-[#e9e4d0] text-[#1a1a1a] selection:bg-[#8b0000]/20 font-arvo border-t-8 border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24 border-b border-[#1a1a1a] pb-12">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-[#1a1a1a]/60 hover:text-black transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Return to Index</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-playfairDisplay italic font-black text-[#1a1a1a] tracking-tighter leading-none">The Fasting Ledger</h1>
              <p className="text-xl text-[#1a1a1a]/70 max-w-2xl font-light italic leading-relaxed border-l-2 border-[#1a1a1a]/20 pl-6">
                A personal record of metabolic cycles and daily nourishment.
              </p>
            </div>

                        <div className="flex flex-wrap gap-4 font-mono text-[#1a1a1a]">
                            <button
                                onClick={fastingData.exportCSV}
                                className="px-4 py-2 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#e9e4d0] transition-all text-[10px] uppercase tracking-widest font-bold"
                            >
                                Save.CSV
                            </button>
                            <button
                                onClick={fastingData.exportData}
                                className="px-4 py-2 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#e9e4d0] transition-all text-[10px] uppercase tracking-widest font-bold"
                            >
                                Save.Backup
                            </button>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`px-4 py-2 border transition-all text-[10px] uppercase tracking-widest font-bold ${showSettings ? 'bg-[#1a1a1a] text-[#e9e4d0]' : 'border-[#1a1a1a] hover:bg-[#1a1a1a]/5'}`}
                            >
                                Settings
                            </button>
                            <button
                                onClick={fastingData.clearData}
                                className="px-4 py-2 border border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-[#e9e4d0] transition-all text-[10px] uppercase tracking-widest font-bold"
                            >
                                Delete.All
                            </button>
                        </div>
                      </div>
                    </header>

                    {showSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mb-16 border-2 border-[#1a1a1a] bg-white/30 p-10 overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]"
                        >
                            <h3 className="font-mono text-xs text-[#1a1a1a] font-bold uppercase tracking-widest mb-10 border-b border-[#1a1a1a]/10 pb-4">
                                Personal Settings
                            </h3>                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 font-mono">
                        <label className="block text-xs text-[#1a1a1a]/60 uppercase tracking-widest font-bold">Standard Fast Goal (Hours)</label>
                        <input
                            type="number"
                            value={fastingData.settings.targetFastLength}
                            onChange={(e) => fastingData.setSettings({...fastingData.settings, targetFastLength: parseInt(e.target.value)})}
                            className="w-full bg-transparent border-b-2 border-[#1a1a1a] p-4 text-[#1a1a1a] text-2xl font-black focus:outline-none"
                        />
                    </div>
                    <div className="space-y-4 font-mono">
                        <label className="block text-xs text-[#1a1a1a]/60 uppercase tracking-widest font-bold">Daily Energy Limit (kcal)</label>
                        <input
                            type="number"
                            value={fastingData.settings.goalCalories}
                            onChange={(e) => fastingData.setSettings({...fastingData.settings, goalCalories: parseInt(e.target.value)})}
                            className="w-full bg-transparent border-b-2 border-[#1a1a1a] p-4 text-[#1a1a1a] text-2xl font-black focus:outline-none"
                        />
                    </div>
                </div>
            </motion.div>
        )}

        <div className="space-y-12">
            {/* Tab Navigation */}
            <div className="flex gap-2 font-mono">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-t border-l border-r border-[#1a1a1a] ${
                            activeTab === tab.id ? 'bg-[#1a1a1a] text-[#e9e4d0]' : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[600px] border border-[#1a1a1a] p-12 bg-white/20 shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                data={fastingData}
                                onLogMeal={() => handleOpenMealLogger()}
                                onAdjustFast={() => handleOpenAdjustModal(fastingData.activeFast)}
                            />
                        )}
                        {activeTab === 'details' && (
                            <DetailsView
                                data={fastingData}
                                onAdjustFast={(fast) => handleOpenAdjustModal(fast)}
                            />
                        )}
                        {activeTab === 'planner' && (
                            <Planner data={fastingData} />
                        )}
                        {activeTab === 'database' && (
                            <FoodDatabase
                                data={fastingData}
                                onLogThis={(id) => handleOpenMealLogger(id)}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        <MealLogger
            isOpen={isMealLoggerOpen}
            onClose={() => {
                setIsMealLoggerOpen(false);
                setPrefilledFoodId(null);
            }}
            foods={fastingData.foods}
            onAddMeal={fastingData.addMeal}
            prefilledFoodId={prefilledFoodId}
        />

        <AdjustFastModal
            isOpen={isAdjustModalOpen}
            onClose={() => {
                setIsAdjustModalOpen(false);
                setFastToAdjust(null);
            }}
            fast={fastToAdjust}
            onUpdate={fastingData.updateFast}
        />

        <footer className="mt-32 py-12 border-t-2 border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-6 text-[#1a1a1a]/60 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span className="font-bold">Journal Publication No. 492</span>
          <div className="flex items-center gap-12">
            <span className="flex items-center gap-2">
                <InfoIcon /> Storage: Browser Localized
            </span>
            <span className="font-bold text-[#1a1a1a]">
                Verified Authenticity
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default IntermittentFastingTrackerPage;