import React, { useState } from 'react';
import { CaretRight, CheckCircle, Circle, Trophy, Terminal, ArrowClockwise } from '@phosphor-icons/react';
import BrutalistDialog from '../../../components/BrutalistDialog';

const Sidebar = ({ course, currentLessonId, onSelectLesson, completedLessons, onResetCourse }) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (!course) return <div className="p-8 text-gray-500 text-center font-mono text-[10px] uppercase tracking-widest">Initializing_Neural_Link...</div>;

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="w-full md:w-80 bg-[#050505] border-r border-white/10 h-full overflow-y-auto flex-shrink-0 flex flex-col z-20 text-white font-mono">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-[#050505] sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 rounded-sm">
                <Terminal size={20} weight="fill" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest leading-none">JS_MASTERCLASS</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Protocol: Zero_to_Hero</p>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                <span>System_Completion</span>
                <span className="text-emerald-500">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 overflow-hidden border border-white/10">
                <div
                    className="bg-emerald-500 h-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {course.modules.map((module, index) => {
          const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;
          const isModuleComplete = completedInModule === module.lessons.length;

          return (
            <div key={module.id} className="group border border-transparent hover:border-white/5 transition-all">              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left outline-none"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex-shrink-0 text-[9px] font-bold text-emerald-500/50 w-6 font-mono">[{String(index + 1).padStart(2, '0')}]</span>
                    <span className={`font-bold text-[10px] uppercase tracking-widest truncate ${isModuleComplete ? 'text-gray-500 line-through decoration-gray-700' : 'text-gray-300 group-hover:text-white'}`}>
                        {module.title.replace(/^Module \d+: /, '')}
                    </span>
                </div>
                <CaretRight
                  size={12}
                  className={`text-gray-600 transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-90' : ''}`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedModules[module.id] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                    <div className="mt-1 ml-3 border-l border-white/10 pl-2 pb-2 space-y-1">
                    {module.lessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isActive = currentLessonId === lesson.id;

                        return (
                        <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-wider transition-all duration-200 group/lesson relative ${
                            isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                            }`}
                        >
                            {isCompleted ? (
                                <CheckCircle size={14} className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-emerald-500/50'}`} weight="fill" />
                            ) : (
                                <Circle size={14} className={`flex-shrink-0 ${isActive ? 'text-emerald-500' : 'text-gray-700 group-hover/lesson:text-gray-500'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                        </button>
                        );
                    })}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-[#050505] space-y-4">
        <button
          onClick={() => setIsResetDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 border border-white/10 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all text-[9px] uppercase tracking-[0.2em] rounded-sm group"
        >
          <ArrowClockwise size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          RESET_PROTOCOL
        </button>

        {progressPercentage === 100 ? (
             <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse border border-emerald-500/20 p-2 bg-emerald-500/5">
                <Trophy weight="fill" />
                <span>Status: LEGEND</span>
             </div>
        ) : (
            <div className="text-center flex flex-col gap-1">
                <span className="text-[9px] text-gray-700 uppercase tracking-widest">Session_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                <span className="text-[9px] text-emerald-500/30 uppercase tracking-widest">Training_Active</span>
            </div>
        )}
      </div>

      <BrutalistDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={() => {
          onResetCourse();
          setIsResetDialogOpen(false);
        }}
        title="WIPE_PROGRESS_CONFIRMATION"
        message="Are you sure you want to terminate current session progress? This action will purge all completed unit logs from local memory."
        confirmText="PURGE_DATA"
        cancelText="ABORT"
      />
    </div>
  );
};

export default Sidebar;
