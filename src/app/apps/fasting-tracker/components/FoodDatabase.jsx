import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

const FoodDatabase = ({ data, onLogThis }) => {
  const { foods, addFood } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newFood.name || !newFood.calories) return;
    addFood({
      ...newFood,
      calories: parseInt(newFood.calories) || 0,
      protein: parseFloat(newFood.protein) || 0,
      carbs: parseFloat(newFood.carbs) || 0,
      fat: parseFloat(newFood.fat) || 0,
    });
    setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setIsAdding(false);
  };

        return (

          <div className="space-y-12 font-arvo">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-[#1a1a1a]/10 pb-12">

              <div className="relative w-full md:w-[500px] group">

                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 group-focus-within:text-[#1a1a1a] transition-colors" size={24} />

                  <input

                      type="text"

                      placeholder="Search food list..."

                      value={searchTerm}

                      onChange={(e) => setSearchTerm(e.target.value)}

                      className="w-full bg-white/5 border border-[#1a1a1a] p-5 pl-16 text-sm font-mono text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-[#1a1a1a]/5 transition-all placeholder:italic"

                  />

              </div>

              <button

                  onClick={() => setIsAdding(!isAdding)}

                  className="px-10 py-5 bg-[#1a1a1a] text-[#e9e4d0] font-black uppercase tracking-[0.3em] text-[10px] hover:opacity-90 transition-all rounded-sm shadow-xl flex items-center gap-4"

              >

                  <PlusIcon weight="bold" size={18} /> {isAdding ? 'Discard Draft' : 'Add Custom Food'}

              </button>

            </div>

            {isAdding && (

              <motion.div

                  initial={{ opacity: 0, scale: 0.98 }}

                  animate={{ opacity: 1, scale: 1 }}

                  className="border-2 border-[#1a1a1a] bg-white p-12 shadow-2xl relative"

              >

                  <div className="absolute top-4 right-4 text-[8px] font-mono text-gray-300 uppercase tracking-widest">Entry Form</div>

                  <h3 className="font-playfairDisplay text-2xl italic font-black text-[#1a1a1a] mb-10 border-b border-[#1a1a1a]/10 pb-4">New Food Entry</h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 font-mono">

                      <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Description</label>

                          <input

                              type="text"

                              placeholder="e.g. Black Coffee"

                              value={newFood.name}

                              onChange={(e) => setNewFood({...newFood, name: e.target.value})}

                              className="w-full bg-transparent border-b border-[#1a1a1a] p-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] outline-none"

                          />

                      </div>

                      <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Calories</label>

                          <input

                              type="number"

                              placeholder="kcal"

                              value={newFood.calories}

                              onChange={(e) => setNewFood({...newFood, calories: e.target.value})}

                              className="w-full bg-transparent border-b border-[#1a1a1a] p-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] outline-none"

                          />

                      </div>

                      <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Protein</label>

                          <input

                              type="number"

                              placeholder="g"

                              value={newFood.protein}

                              onChange={(e) => setNewFood({...newFood, protein: e.target.value})}

                              className="w-full bg-transparent border-b border-[#1a1a1a] p-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] outline-none"

                          />

                      </div>

                      <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Carbs</label>

                          <input

                              type="number"

                              placeholder="g"

                              value={newFood.carbs}

                              onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}

                              className="w-full bg-transparent border-b border-[#1a1a1a] p-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] outline-none"

                          />

                      </div>

                      <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Fat</label>

                          <input

                              type="number"

                              placeholder="g"

                              value={newFood.fat}

                              onChange={(e) => setNewFood({...newFood, fat: e.target.value})}

                              className="w-full bg-transparent border-b border-[#1a1a1a] p-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] outline-none"

                          />

                      </div>

                  </div>

                  <button

                      onClick={handleAdd}

                      className="mt-12 w-full py-5 bg-[#1a1a1a] text-[#e9e4d0] font-black uppercase text-[10px] tracking-[0.4em] hover:opacity-90 transition-all shadow-lg"

                  >

                      Save to My Foods

                  </button>

              </motion.div>

            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {filteredFoods.map(food => (

                  <div key={food.id} className="border border-[#1a1a1a]/20 bg-white/5 p-8 hover:border-[#1a1a1a] hover:bg-white/20 transition-all group shadow-sm flex flex-col">

                      <div className="flex justify-between items-start mb-6 border-b border-[#1a1a1a]/5 pb-4">

                          <h4 className="text-xl font-bold text-[#1a1a1a] group-hover:text-black transition-colors leading-tight">{food.name}</h4>

                      </div>

                      <div className="flex-1 flex flex-col justify-between">

                          <div>

                              <div className="text-3xl font-mono font-black text-[#1a1a1a] mb-6">

                                  {food.calories} <span className="text-[10px] uppercase font-bold tracking-widest text-[#1a1a1a]/30">kcal</span>

                              </div>

                              <div className="grid grid-cols-3 gap-4 text-[10px] font-mono font-black uppercase text-[#1a1a1a]/40 tracking-tighter">

                                  <div className="border-r border-[#1a1a1a]/5">

                                      <span className="block text-[#1a1a1a]/20 mb-1">P</span>

                                      <span>{food.protein}g</span>

                                  </div>

                                  <div className="border-r border-[#1a1a1a]/5">

                                      <span className="block text-[#1a1a1a]/20 mb-1">C</span>

                                      <span>{food.carbs}g</span>

                                  </div>

                                  <div>

                                      <span className="block text-[#1a1a1a]/20 mb-1">F</span>

                                      <span>{food.fat}g</span>

                                  </div>

                              </div>

                          </div>

                          <button

                              onClick={() => onLogThis(food.id)}

                              className="mt-10 w-full py-3 bg-transparent border border-[#1a1a1a] text-[#1a1a1a] font-black uppercase text-[9px] tracking-[0.3em] hover:bg-[#1a1a1a] hover:text-[#e9e4d0] transition-all rounded-sm"

                          >

                              Log this food

                          </button>

                      </div>

                  </div>

              ))}

            </div>

          </div>

        );};

export default FoodDatabase;
