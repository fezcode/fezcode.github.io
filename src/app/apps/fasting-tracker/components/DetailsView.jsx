import React from 'react';
import {
  TrendUpIcon,
  TrendDownIcon,
  SelectionIcon,
} from '@phosphor-icons/react';

const DetailsView = ({ data, onAdjustFast }) => {
  const { fasts, meals, deleteFast } = data;

  // Calculate averages
  const completedFasts = fasts.filter((f) => f.end);
  const avgFastLength =
    completedFasts.length > 0
      ? completedFasts.reduce((acc, f) => acc + (f.end - f.start), 0) /
        completedFasts.length /
        (1000 * 60 * 60)
      : 0;

  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const avgDailyCalories =
    meals.length > 0
      ? totalCalories /
        (new Set(meals.map((m) => new Date(m.timestamp).toDateString())).size ||
          1)
      : 0;

  // Macronutrient breakdown
  const macros = meals.reduce(
    (acc, m) => {
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fat += m.fat || 0;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 },
  );

  const totalGrams = macros.protein + macros.carbs + macros.fat || 1;
  const macroPercentages = {
    protein: (macros.protein / totalGrams) * 100,
    carbs: (macros.carbs / totalGrams) * 100,
    fat: (macros.fat / totalGrams) * 100,
  };

  return (
    <div className="space-y-16 font-arvo">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="border border-[#1a1a1a] bg-white/5 p-10 shadow-sm relative overflow-hidden group">
          <h4 className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-widest font-black mb-6">
            Average Duration
          </h4>

          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-[#1a1a1a] tracking-tighter">
              {avgFastLength.toFixed(1)}
            </span>

            <span className="text-xs font-mono text-[#1a1a1a]/60 mb-2 font-bold italic uppercase">
              Hours
            </span>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono font-black uppercase text-gray-400 border-t border-[#1a1a1a]/5 pt-4">
            <TrendUpIcon weight="bold" /> Consistency Status: Optimal
          </div>
        </div>

        <div className="border border-[#1a1a1a] bg-white/5 p-10 shadow-sm relative overflow-hidden group">
          <h4 className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-widest font-black mb-6">
            Daily Average
          </h4>

          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-[#1a1a1a] tracking-tighter">
              {Math.round(avgDailyCalories)}
            </span>

            <span className="text-xs font-mono text-[#1a1a1a]/60 mb-2 font-bold italic uppercase">
              kcal
            </span>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono font-black uppercase text-[#8b0000]/60 border-t border-[#1a1a1a]/5 pt-4">
            <TrendDownIcon weight="bold" /> Goal Variance: Calibrated
          </div>
        </div>

        <div className="border border-[#1a1a1a] bg-white/5 p-10 shadow-sm relative overflow-hidden group">
          <h4 className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-widest font-black mb-6">
            Total Sessions
          </h4>

          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-[#1a1a1a] tracking-tighter">
              {completedFasts.length}
            </span>

            <span className="text-xs font-mono text-[#1a1a1a]/60 mb-2 font-bold italic uppercase">
              Fasts
            </span>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono font-black uppercase text-gray-400 border-t border-[#1a1a1a]/5 pt-4">
            <SelectionIcon weight="bold" /> Integrity: Verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Macro Chart */}

        <div className="border border-[#1a1a1a] bg-white/10 p-12 shadow-sm">
          <h3 className="font-playfairDisplay text-2xl text-[#1a1a1a] italic font-black mb-12 flex items-center gap-4 border-b border-[#1a1a1a]/10 pb-4">
            Nutritional Distribution
          </h3>

          <div className="space-y-10 font-mono">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-[#1a1a1a]">
                <span>Proteins</span>

                <span className="italic">
                  {macroPercentages.protein.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 border border-[#1a1a1a] bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-[#1a1a1a]/80"
                  style={{ width: `${macroPercentages.protein}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-[#1a1a1a]">
                <span>Carbohydrates</span>

                <span className="italic">
                  {macroPercentages.carbs.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 border border-[#1a1a1a] bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-[#1a1a1a]/50"
                  style={{ width: `${macroPercentages.carbs}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-[#1a1a1a]">
                <span>Lipids</span>

                <span className="italic">
                  {macroPercentages.fat.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 border border-[#1a1a1a] bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-[#1a1a1a]/20"
                  style={{ width: `${macroPercentages.fat}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 border-l-4 border-[#1a1a1a]/10 bg-[#1a1a1a]/5 italic text-sm text-[#1a1a1a]/60 leading-relaxed">
            "Let food be thy medicine and medicine be thy food." — Observational
            analysis of systemic nourishment.
          </div>
        </div>

        {/* Recent History */}

        <div className="border border-[#1a1a1a] bg-white/10 p-12 flex flex-col shadow-sm">
          <h3 className="font-playfairDisplay text-2xl text-[#1a1a1a] italic font-black mb-12 flex items-center gap-4 border-b border-[#1a1a1a]/10 pb-4">
            Fasting History
          </h3>

          <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-6 custom-scrollbar-terminal">
            {completedFasts
              .slice()
              .reverse()
              .map((f) => {
                const duration = (f.end - f.start) / (1000 * 60 * 60);

                const success = duration >= f.targetLength;

                return (
                  <div
                    key={f.id}
                    className="flex justify-between items-center border-b border-[#1a1a1a]/5 pb-6 group"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-black text-[#1a1a1a] uppercase tracking-tighter">
                        {new Date(f.start).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>

                      <div className="text-[10px] font-mono text-[#1a1a1a]/40 font-bold uppercase italic">
                        {new Date(f.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        —{' '}
                        {new Date(f.end).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-8">
                      <div className="space-y-1">
                        <div className="text-xl font-black text-[#1a1a1a] tracking-tight">
                          {duration.toFixed(1)}h
                        </div>

                        <div
                          className={`text-[9px] font-mono font-black uppercase tracking-widest ${success ? 'text-gray-400' : 'text-[#8b0000]'}`}
                        >
                          {success ? 'Goal Reached' : 'Goal Missed'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => onAdjustFast(f)}
                          className="px-3 py-1 border border-[#1a1a1a]/20 hover:border-[#1a1a1a] text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all text-[9px] font-mono font-black uppercase tracking-widest rounded-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Delete this entry?')) {
                              deleteFast(f.id);
                            }
                          }}
                          className="px-3 py-1 border border-[#8b0000]/20 hover:border-[#8b0000] text-[#8b0000]/40 hover:text-[#8b0000] transition-all text-[9px] font-mono font-black uppercase tracking-widest rounded-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {completedFasts.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[#1a1a1a]/20 font-mono text-[10px] uppercase tracking-[0.3em] py-32 space-y-4">
                <div className="w-12 h-px bg-[#1a1a1a]/10" />

                <span>No entries found yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailsView;
