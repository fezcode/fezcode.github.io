import React, { useState, useEffect } from 'react';
import BrutalistDialog from '../../../../components/BrutalistDialog';
import CustomDropdown from '../../../../components/CustomDropdown';

const MealLogger = ({ isOpen, onClose, foods, onAddMeal, prefilledFoodId }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [mealType, setMealType] = useState('Snack');

  useEffect(() => {
    if (isOpen) {
      setSelectedFood(prefilledFoodId);
    }
  }, [isOpen, prefilledFoodId]);

  const mealTypes = [
    { value: 'Breakfast', label: 'BREAKFAST' },
    { value: 'Lunch', label: 'LUNCH' },
    { value: 'Dinner', label: 'DINNER' },
    { value: 'Snack', label: 'SNACK' },
  ];

  const foodOptions = foods.map((f) => ({
    value: f.id,
    label: `${f.name} (${f.calories} kcal)`,
    data: f,
  }));

  const handleAdd = () => {
    let mealData;
    if (selectedFood) {
      const food = foods.find((f) => f.id === selectedFood);
      mealData = {
        name: food.name,
        calories: Math.round(food.calories * servingSize),
        protein: Math.round((food.protein || 0) * servingSize),
        carbs: Math.round((food.carbs || 0) * servingSize),
        fat: Math.round((food.fat || 0) * servingSize),
        type: mealType,
      };
    } else {
      mealData = {
        name: customName || 'Quick Meal',
        calories: parseInt(customCalories) || 0,
        type: mealType,
      };
    }

    onAddMeal(mealData);
    onClose();
    // Reset form
    setSelectedFood(null);
    setCustomName('');
    setCustomCalories('');
    setServingSize(1);
  };

  return (
    <BrutalistDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Log a Meal"
      variant="paper"
    >
      <div className="space-y-8 py-6 font-arvo text-[#1a1a1a]">
        <p className="text-[10px] font-mono font-black uppercase tracking-widest border-b border-[#1a1a1a]/10 pb-2">
          Record what you ate
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3 font-bold">
              Pick a Food
            </label>

            <CustomDropdown
              options={foodOptions}
              value={selectedFood}
              onChange={(val) => setSelectedFood(val)}
              label="Choose from list..."
              variant="paper"
              fullWidth
            />
          </div>

          {!selectedFood && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  Food Name
                </label>

                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-3 text-sm text-[#1a1a1a] focus:outline-none"
                  placeholder="e.g. Apple"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  Calories
                </label>

                <input
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-3 text-sm text-[#1a1a1a] focus:outline-none font-mono font-black"
                  placeholder="kcal"
                />
              </div>
            </div>
          )}

          {selectedFood && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3 font-bold">
                How many servings?
              </label>

              <input
                type="number"
                step="0.1"
                value={servingSize}
                onChange={(e) => setServingSize(parseFloat(e.target.value))}
                className="w-full bg-[#1a1a1a]/5 border-b-2 border-[#1a1a1a] p-4 text-3xl text-[#1a1a1a] focus:outline-none font-mono font-black"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4 font-bold">
              Meal Type
            </label>

            <div className="flex flex-wrap gap-3 font-mono">
              {mealTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMealType(type.value)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${
                    mealType === type.value
                      ? 'bg-[#1a1a1a] text-[#e9e4d0] border-[#1a1a1a]'
                      : 'border-[#1a1a1a]/20 text-[#1a1a1a]/40 hover:border-[#1a1a1a]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-5 bg-[#1a1a1a] text-[#e9e4d0] font-black uppercase tracking-[0.4em] hover:opacity-90 transition-all text-xs mt-12 shadow-xl"
        >
          Add to Daily Log
        </button>
      </div>
    </BrutalistDialog>
  );
};

export default MealLogger;
