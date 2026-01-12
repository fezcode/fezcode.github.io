import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckSquareOffsetIcon,
  PlusIcon,
  TrashIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  DatabaseIcon,
  WarningCircleIcon
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import usePersistentState from '../../hooks/usePersistentState';
import BrutalistDialog from '../../components/BrutalistDialog';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const TaskGridPage = () => {
  const appName = 'Task Grid';

  const { addToast } = useToast();
  const [tasks, setTasks] = usePersistentState('task-grid-data', []);
  const [inputValue, setInputValue] = useState('');
  const [isFlushDialogOpen, setIsFlushDialogOpen] = useState(false);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      status: 'pending', // pending, active, resolved
      timestamp: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setInputValue('');
    addToast({ title: 'Task Registered', message: 'New objective mapped to the grid.' });
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'pending' ? 'active' : t.status === 'active' ? 'resolved' : 'pending';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    addToast({ title: 'Task Purged', message: 'Objective removed from the sequence.' });
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    resolved: tasks.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Task Grid | Fezcodex"
        description="Minimal project mapper. Track your daily objectives within a high-contrast structural grid."
        keywords={['Fezcodex', 'task manager', 'to-do list', 'minimalist planner', 'grid tasks']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Task Grid" slug="tg" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Objective mapping protocol. Organize systemic tasks within a structured grid to track progress and neural throughput.
              </p>
            </div>
          </div>
        </header>

        {/* Local Storage Warning */}
        <div className="mb-12 p-6 border border-amber-500/20 bg-amber-500/5 rounded-sm flex items-center gap-6">
          <DatabaseIcon size={32} weight="fill" className="text-amber-500 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">Local Data Storage Active</h4>
            <p className="text-[11px] font-mono text-amber-500/60 uppercase tracking-widest">
              All objectives are stored within your browser's local cache. Clearing your browser data will erase this mapping sequence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Input & List Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Entry Module */}
            <form onSubmit={addTask} className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Insert new objective sequence..."
                className="w-full bg-white/[0.02] border border-white/10 p-8 md:p-12 text-2xl font-light focus:bg-white/[0.05] focus:border-emerald-500/50 outline-none transition-all rounded-sm placeholder-gray-700 font-sans"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white text-black hover:bg-emerald-400 transition-all rounded-sm"
              >
                <PlusIcon weight="black" size={24} />
              </button>
            </form>

            {/* Grid Map */}
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + tasks.length} className="w-full h-full" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatePresence initial={false}>
                  {tasks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`
                            flex items-center justify-between p-6 border transition-all group
                            ${task.status === 'resolved' ? 'border-emerald-500/20 bg-emerald-500/5 opacity-60' :
                              task.status === 'active' ? 'border-emerald-500 bg-emerald-500/10' :
                              'border-white/5 bg-white/[0.01] hover:border-white/20'}
                          `}
                        >
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <button
                              onClick={() => toggleStatus(task.id)}
                              className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-all ${task.status === 'resolved' ? 'bg-emerald-500 border-emerald-400' : 'border-white/20 hover:border-white/40'}`}
                            >
                              {task.status === 'resolved' && <CheckCircleIcon weight="fill" size={20} className="text-black" />}
                              {task.status === 'active' && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />}
                            </button>
                            <span className={`text-lg transition-all truncate ${task.status === 'resolved' ? 'line-through text-gray-500' : 'text-white'}`}>
                              {task.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 ml-4">
                            <span className="font-mono text-[9px] text-gray-600 uppercase hidden md:block">
                              {task.status}
                            </span>
                            <button
                              onClick={() => removeTask(task.id)}
                              className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <TrashIcon size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">
                        No active sequences mapped.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <CheckSquareOffsetIcon weight="fill" />
                Sequence_Stats
              </h3>

              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Mapped</span>
                  <span className="text-3xl font-black">{stats.total}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Active</span>
                  <span className="text-3xl font-black text-white">{stats.active}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest">Resolved</span>
                  <span className="text-3xl font-black text-emerald-500">{stats.resolved}</span>
                </div>
              </div>

              <button
                onClick={() => setIsFlushDialogOpen(true)}
                className="w-full py-4 border border-white/10 hover:bg-red-500 hover:text-black hover:border-red-400 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowsClockwiseIcon weight="bold" /> Flush Sequence
              </button>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <WarningCircleIcon size={24} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Data persistence is restricted to the local interface. For cross-device synchronization, manual sequence export is required.
              </p>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Objective_Loom_v0.6.1</span>
          <span className="text-gray-800">MAPPING_CORE // PERSISTENT</span>
        </footer>
      </div>

      <BrutalistDialog
        isOpen={isFlushDialogOpen}
        onClose={() => setIsFlushDialogOpen(false)}
        onConfirm={() => {
          setTasks([]);
          setIsFlushDialogOpen(false);
          addToast({ title: 'Grid Flushed', message: 'All sequences have been erased.' });
        }}
        title="FLUSH_GRID_SEQUENCE"
        message="Attention: This operation will permanently erase all mapped objectives. This action is irreversible. Proceed?"
        confirmText="EXECUTE_FLUSH"
        cancelText="ABORT_OPERATION"
      />
    </div>
  );
};

export default TaskGridPage;