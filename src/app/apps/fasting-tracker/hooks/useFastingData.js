import { useMemo } from 'react';
import usePersistentState from '../../../../hooks/usePersistentState';
import { initialFoods } from '../data/initialFoods';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFastingData = () => {
  const [fasts, setFasts] = usePersistentState('fasting_tracker_fasts', []);
  const [meals, setMeals] = usePersistentState('fasting_tracker_meals', []);
  const [plans, setPlans] = usePersistentState('fasting_tracker_plans', {});
  const [customFoods, setCustomFoods] = usePersistentState('fasting_tracker_custom_foods', []);
  const [settings, setSettings] = usePersistentState('fasting_tracker_settings', {
    targetFastLength: 16,
    goalCalories: 2000,
  });

  const foods = useMemo(() => [...initialFoods, ...customFoods], [customFoods]);

  const activeFast = fasts.find(f => !f.end);

  const startFast = (startTime = Date.now(), protocol = '16:8') => {
    if (activeFast) return;
    const targetLength = parseInt(protocol.split(':')[0]) || 16;
    setFasts([...fasts, {
      id: generateId(),
      start: startTime,
      end: null,
      targetLength,
      protocol
    }]);
  };

  const endFast = (endTime = Date.now()) => {
    if (!activeFast) return;
    setFasts(fasts.map(f => f.id === activeFast.id ? { ...f, end: endTime } : f));
  };

  const updateFast = (id, data) => {
    setFasts(fasts.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const deleteFast = (id) => {
    setFasts(fasts.filter(f => f.id !== id));
  };

  const addMeal = (meal) => {
    setMeals([...meals, { ...meal, id: generateId(), timestamp: meal.timestamp || Date.now() }]);
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const addFood = (food) => {
    setCustomFoods([...customFoods, { ...food, id: `custom_${generateId()}` }]);
  };

  const updatePlan = (date, dayPlan) => {
    setPlans({ ...plans, [date]: dayPlan });
  };

  const clearData = () => {
    if(window.confirm("Are you sure you want to clear all data?")) {
        setFasts([]);
        setMeals([]);
        setPlans({});
        setCustomFoods([]);
    }
  };

  const exportData = () => {
    const data = {
        fasts,
        meals,
        plans,
        customFoods,
        settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const exportCSV = () => {
     // Flatten meals for CSV
     const headers = ['Date', 'Time', 'Name', 'Calories', 'Protein', 'Carbs', 'Fat', 'Type'];
     const rows = meals.map(m => {
        const d = new Date(m.timestamp);
        return [
            d.toLocaleDateString(),
            d.toLocaleTimeString(),
            m.name,
            m.calories,
            m.protein || 0,
            m.carbs || 0,
            m.fat || 0,
            m.type
        ].join(',');
     });

     const csvContent = [headers.join(','), ...rows].join('\n');
     const blob = new Blob([csvContent], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `fasting-tracker-meals-${new Date().toISOString().split('T')[0]}.csv`;
     a.click();
  };

  return {
    fasts,
    meals,
    plans,
    foods,
    settings,
    setSettings,
    activeFast,
    startFast,
    endFast,
    updateFast,
    deleteFast,
    addMeal,
    deleteMeal,
    addFood,
    updatePlan,
    clearData,
    exportData,
    exportCSV
  };
};