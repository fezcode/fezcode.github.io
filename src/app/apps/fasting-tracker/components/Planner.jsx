import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';

const Planner = ({ data }) => {
  const { plans, updatePlan } = data;
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const currentPlan = plans[selectedDate] || { meals: [] };

  const handleAddMealToPlan = () => {
    const newMeal = {
      id: Date.now(),
      name: 'New Planned Meal',
      calories: 0,
      time: '12:00',
    };
    updatePlan(selectedDate, {
      ...currentPlan,
      meals: [...currentPlan.meals, newMeal],
    });
  };

  const handleUpdateMealInPlan = (id, field, value) => {
    const updatedMeals = currentPlan.meals.map((m) =>
      m.id === id ? { ...m, [field]: value } : m,
    );
    updatePlan(selectedDate, { ...currentPlan, meals: updatedMeals });
  };

  const handleRemoveFromPlan = (id) => {
    const updatedMeals = currentPlan.meals.filter((m) => m.id !== id);
    updatePlan(selectedDate, { ...currentPlan, meals: updatedMeals });
  };

  const totalPlannedCalories = currentPlan.meals.reduce(
    (sum, m) => sum + (parseInt(m.calories) || 0),
    0,
  );

  return (
    <div className="space-y-12 font-arvo">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Date Selector */}

        <div className="w-full md:w-72 border border-[#1a1a1a] bg-white/5 p-8 shadow-sm">
          <h3 className="font-mono text-[10px] text-[#1a1a1a] uppercase tracking-widest font-black mb-8 border-b border-[#1a1a1a]/10 pb-2">
            Calendar Reference
          </h3>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-transparent border-b-2 border-[#1a1a1a] p-3 text-lg font-black text-[#1a1a1a] focus:outline-none transition-colors font-mono"
          />
        </div>

        {/* Plan Details */}

        <div className="flex-1 border border-[#1a1a1a] bg-white/10 p-12 relative overflow-hidden min-h-[500px] shadow-sm">
          <div className="flex justify-between items-center mb-12 border-b-2 border-[#1a1a1a]/10 pb-6">
            <div>
              <h3 className="font-playfairDisplay text-3xl italic font-black text-[#1a1a1a] tracking-tight">
                Daily Meal Plan
              </h3>

              <p className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-[0.3em] font-black mt-2">
                {selectedDate} {'//'} Total: {totalPlannedCalories} kcal
              </p>
            </div>

            <button
              onClick={handleAddMealToPlan}
              className="p-4 border-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#e9e4d0] hover:bg-transparent hover:text-[#1a1a1a] transition-all rounded-sm shadow-md"
            >
              <PlusIcon weight="bold" size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {currentPlan.meals.length > 0 ? (
                currentPlan.meals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 border border-[#1a1a1a]/10 bg-white/5 hover:bg-white/20 transition-all group items-center rounded-sm"
                  >
                    <div className="md:col-span-2">
                      <input
                        type="time"
                        value={meal.time}
                        onChange={(e) =>
                          handleUpdateMealInPlan(
                            meal.id,
                            'time',
                            e.target.value,
                          )
                        }
                        className="w-full bg-transparent border-none text-xs font-mono font-black text-[#1a1a1a]/60 focus:ring-0 p-0 uppercase"
                      />
                    </div>

                    <div className="md:col-span-6 border-l border-[#1a1a1a]/5 pl-6">
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) =>
                          handleUpdateMealInPlan(
                            meal.id,
                            'name',
                            e.target.value,
                          )
                        }
                        className="w-full bg-transparent border-none text-xl font-medium text-[#1a1a1a] focus:ring-0 p-0 placeholder:text-[#1a1a1a]/10"
                        placeholder="Add a meal..."
                      />
                    </div>

                    <div className="md:col-span-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <input
                          type="number"
                          value={meal.calories}
                          onChange={(e) =>
                            handleUpdateMealInPlan(
                              meal.id,
                              'calories',
                              e.target.value,
                            )
                          }
                          className="w-24 bg-transparent border-none text-2xl font-mono font-black text-[#1a1a1a] text-right focus:ring-0 p-0"
                        />

                        <span className="text-[9px] text-[#1a1a1a]/30 font-mono font-black uppercase tracking-widest">
                          kcal
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleRemoveFromPlan(meal.id)}
                        className="text-[#1a1a1a]/20 hover:text-[#8b0000] transition-colors p-2 border border-transparent hover:border-[#8b0000]/20 rounded-sm"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center opacity-20 group">
                  <div className="w-16 h-0.5 bg-[#1a1a1a] mb-8 transition-all group-hover:w-32" />

                  <p className="text-[10px] font-mono text-[#1a1a1a] uppercase tracking-[0.4em] font-black">
                    Your plan is empty for this date.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
