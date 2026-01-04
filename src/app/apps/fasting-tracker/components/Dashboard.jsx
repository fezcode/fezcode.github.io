import React, { useState, useEffect } from 'react';
import {
  TimerIcon
} from '@phosphor-icons/react';const Dashboard = ({ data, onLogMeal, onAdjustFast }) => {
  const { activeFast, startFast, endFast, meals, settings } = data;
  const [elapsed, setElapsed] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('16:8');
  const [customHours, setCustomHours] = useState(16);

  useEffect(() => {
    if (activeFast) {
      const interval = setInterval(() => {
        setElapsed(Date.now() - activeFast.start);
      }, 1000);
      setElapsed(Date.now() - activeFast.start);
      return () => clearInterval(interval);
    } else {
      setElapsed(0);
    }
  }, [activeFast]);

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const targetMs = activeFast ? activeFast.targetLength * 60 * 60 * 1000 : 0;
  const progress = activeFast ? Math.min((elapsed / targetMs) * 100, 100) : 0;

  // Calculate today's calories
  const today = new Date().setHours(0,0,0,0);
  const todaysMeals = meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === today);
  const totalCalories = todaysMeals.reduce((acc, m) => acc + (parseInt(m.calories) || 0), 0);

  const fastingPlans = [
    { value: '16:8', label: '16:8 Standard' },
    { value: '18:6', label: '18:6 Advanced' },
    { value: '20:4', label: '20:4 Warrior' },
    { value: 'OMAD', label: 'One Meal A Day' },
    { value: 'Custom', label: 'Custom Plan' },
  ];

  const handleStart = () => {
    const protocol = selectedPlan === 'Custom' ? `${customHours}:${24-customHours}` : selectedPlan;
    startFast(Date.now(), protocol);
  };

      return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-arvo">

                {/* Fasting Timer Card */}

                <div className="border border-[#1a1a1a] bg-white/10 p-10 relative overflow-hidden group shadow-sm">

                  <div className="flex justify-between items-start mb-12 border-b border-[#1a1a1a]/10 pb-4">

                      <h3 className="font-mono text-xs text-[#1a1a1a] uppercase tracking-widest font-bold flex items-center gap-3">

                          <TimerIcon weight="bold" size={18} /> Current State: {activeFast ? 'Fasting' : 'Eating'}

                      </h3>

                  </div>

                  <div className="flex flex-col items-center justify-center py-8">

                      <div className="relative w-72 h-72 flex items-center justify-center mb-12">

                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">

                              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#1a1a1a]/10" />

                              {activeFast && (

                                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3"

                                      strokeDasharray="301.59"

                                      strokeDashoffset={301.59 - (301.59 * progress / 100)}

                                      className="text-[#1a1a1a] transition-all duration-1000 ease-in-out"

                                  />

                              )}

                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center">

                              <span className="text-5xl font-black font-mono tracking-tighter text-[#1a1a1a]">

                                  {activeFast ? formatTime(elapsed) : '00:00:00'}

                              </span>

                              <span className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest font-bold mt-4">

                                  {activeFast ? `Goal: ${activeFast.targetLength} Hours` : 'Select a plan below'}

                              </span>

                          </div>

                      </div>

                      {!activeFast ? (

                          <div className="w-full space-y-8">

                              <div className="grid grid-cols-2 gap-3">

                                  {fastingPlans.map(plan => (

                                      <button

                                          key={plan.value}

                                          onClick={() => setSelectedPlan(plan.value)}

                                          className={`px-4 py-3 text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${

                                              selectedPlan === plan.value

                                                  ? 'bg-[#1a1a1a] text-[#e9e4d0] border-[#1a1a1a]'

                                                  : 'bg-transparent text-[#1a1a1a] border-[#1a1a1a]/20 hover:border-[#1a1a1a]'

                                          }`}

                                      >

                                          {plan.label}

                                      </button>

                                  ))}

                              </div>

                              {selectedPlan === 'Custom' && (

                                  <div className="flex items-center gap-6 border-b-2 border-[#1a1a1a] pb-2 animate-in fade-in slide-in-from-top-2">

                                      <label className="text-xs font-mono text-[#1a1a1a] font-bold uppercase">Set Hours:</label>

                                      <input

                                          type="number"

                                          value={customHours}

                                          onChange={(e) => setCustomHours(e.target.value)}

                                          className="flex-1 bg-transparent p-2 text-2xl font-black text-[#1a1a1a] focus:outline-none"

                                      />

                                  </div>

                              )}

                              <button

                                  onClick={handleStart}

                                  className="w-full py-5 bg-[#1a1a1a] text-[#e9e4d0] font-black uppercase text-xs tracking-[0.4em] hover:opacity-90 transition-all shadow-lg"

                              >

                                  Start Fasting

                              </button>

                          </div>

                      ) : (

                          <div className="flex flex-col gap-4 w-full">

                              <button

                                  onClick={() => endFast()}

                                  className="w-full py-5 border-2 border-[#8b0000] text-[#8b0000] font-black uppercase text-xs tracking-[0.4em] hover:bg-[#8b0000] hover:text-[#e9e4d0] transition-all"

                              >

                                  Stop Fasting

                              </button>

                              <button

                                  onClick={onAdjustFast}

                                  className="w-full py-3 text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all text-[10px] font-mono uppercase tracking-widest font-bold italic underline decoration-1 underline-offset-4"

                              >

                                  Change Start Time

                              </button>

                          </div>

                      )}

                  </div>

                </div>

                {/* Stats Card */}

                <div className="space-y-12">

                  <div className="border border-[#1a1a1a] bg-white/10 p-10 h-full flex flex-col shadow-sm">

                      <h3 className="font-mono text-xs text-[#8b0000] uppercase tracking-widest font-black border-b border-[#1a1a1a]/10 pb-4 mb-12">

                          Today's Calories

                      </h3>

                      <div className="flex-1 flex flex-col justify-between">

                          <div>

                              <div className="flex items-end justify-between mb-4">

                                  <span className="text-6xl font-black text-[#1a1a1a] tracking-tighter">{totalCalories}</span>

                                  <div className="text-right">

                                      <span className="block text-[10px] text-[#1a1a1a]/40 font-mono uppercase font-bold">Goal</span>

                                      <span className="text-lg text-[#1a1a1a] font-mono font-bold">{settings.goalCalories} kcal</span>

                                  </div>

                              </div>

                              <div className="w-full h-4 border border-[#1a1a1a] bg-[#1a1a1a]/5 p-0.5 overflow-hidden">

                                  <div

                                      className="h-full bg-[#1a1a1a] transition-all duration-1000 ease-out"

                                      style={{ width: `${Math.min((totalCalories / settings.goalCalories) * 100, 100)}%` }}

                                  />

                              </div>

                          </div>

                          <div className="mt-16 flex-1 overflow-y-auto max-h-64 pr-4">

                              <h4 className="text-[10px] text-[#1a1a1a] font-black uppercase mb-6 tracking-widest border-b border-[#1a1a1a]/5 pb-2">Meals Today</h4>

                              {todaysMeals.length > 0 ? (

                                  <div className="divide-y divide-[#1a1a1a]/10">

                                      {todaysMeals.map(meal => (

                                          <div key={meal.id} className="flex justify-between items-center py-4 group">

                                              <span className="text-lg text-[#1a1a1a]/80 font-medium group-hover:text-[#1a1a1a] transition-colors">{meal.name}</span>

                                              <span className="font-mono font-black text-[#1a1a1a]">{meal.calories} kcal</span>

                                          </div>

                                      ))}

                                  </div>

                              ) : (

                                  <div className="py-12 border-2 border-dashed border-[#1a1a1a]/10 flex items-center justify-center">

                                      <p className="text-xs text-[#1a1a1a]/30 italic">No meals logged yet.</p>

                                  </div>

                              )}

                          </div>

                          <button

                              onClick={onLogMeal}

                              className="mt-12 w-full py-4 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#e9e4d0] transition-all text-xs font-mono font-black uppercase tracking-[0.3em]"

                          >

                              Log a Meal

                          </button>

                      </div>

                  </div>

                </div>

        </div>

      );};

export default Dashboard;
