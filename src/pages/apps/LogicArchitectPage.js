import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CpuIcon, ArrowsClockwiseIcon, InfoIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

const GATES = [
  { id: 'and', label: 'AND Gate', icon: 'D', description: 'Outputs true only if both inputs are true.' },
  { id: 'or', label: 'OR Gate', icon: '>=1', description: 'Outputs true if at least one input is true.' },
  { id: 'not', label: 'NOT Gate', icon: '!', description: 'Inverts the input signal.' },
  { id: 'xor', label: 'XOR Gate', icon: '=1', description: 'Outputs true only if inputs are different.' },
];

const LogicArchitectPage = () => {
  const appName = 'Logic Architect';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Construct digital circuits and simulate logical pathways using standard logic gates.',
    keywords: ['Fezcodex', 'logic gates', 'circuit simulator', 'digital logic', 'educational tool'],
  });

  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [activeGate, setActiveCipher] = useState('and');

  const output = useMemo(() => {
    switch (activeGate) {
      case 'or': return inputA || inputB;
      case 'not': return !inputA;
      case 'xor': return inputA !== inputB;
      case 'and':
      default: return inputA && inputB;
    }
  }, [inputA, inputB, activeGate]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Circuit construction protocol. Map logical pathways and simulate the flow of data through architectural gates.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Gate Selection Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <CpuIcon weight="fill" />
                Gate_Library
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {GATES.map((gate) => (
                  <button
                    key={gate.id}
                    onClick={() => setActiveCipher(gate.id)}
                    className={`
                      flex flex-col gap-2 p-6 border transition-all text-left group
                      ${activeGate === gate.id
                        ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                        : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xs uppercase tracking-widest font-black">{gate.label}</span>
                    <span className="text-[10px] font-mono opacity-60 leading-relaxed uppercase tracking-widest">{gate.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Logic gates are the fundamental building blocks of digital architecture. They process inputs based on Boolean algebra to produce a single output sequence.
              </p>
            </div>
          </div>

          {/* Simulation Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group min-h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + activeGate + inputA + inputB} className="w-full h-full" />
              </div>

              <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">

                {/* Inputs */}
                <div className="flex flex-col gap-12">
                  <div className="space-y-4">
                    <label className="block text-center font-mono text-[9px] text-gray-600 uppercase tracking-widest">Input_A</label>
                    <button
                      onClick={() => setInputA(!inputA)}
                      className={`w-20 h-20 border-4 transition-all duration-300 rounded-sm flex items-center justify-center font-black ${inputA ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/10 text-gray-700'}`}
                    >
                      {inputA ? '1' : '0'}
                    </button>
                  </div>

                  {activeGate !== 'not' && (
                    <div className="space-y-4">
                      <label className="block text-center font-mono text-[9px] text-gray-600 uppercase tracking-widest">Input_B</label>
                      <button
                        onClick={() => setInputB(!inputB)}
                        className={`w-20 h-20 border-4 transition-all duration-300 rounded-sm flex items-center justify-center font-black ${inputB ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/10 text-gray-700'}`}
                      >
                        {inputB ? '1' : '0'}
                      </button>
                    </div>
                  )}
                </div>

                {/* The Gate Visual */}
                <div className="relative">
                  <div className="w-48 h-48 border-8 border-white bg-black flex items-center justify-center relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                    <span className="text-6xl font-black uppercase tracking-tighter text-white">{activeGate}</span>

                    {/* Wires */}
                    <div className="absolute top-1/2 -left-12 w-12 h-1 bg-white/20" />
                    {activeGate !== 'not' && <div className="absolute top-1/3 -left-12 w-12 h-1 bg-white/20" style={{ transform: 'translateY(-50%)' }} />}
                    {activeGate !== 'not' && <div className="absolute bottom-1/3 -left-12 w-12 h-1 bg-white/20" style={{ transform: 'translateY(50%)' }} />}
                    <div className="absolute top-1/2 -right-12 w-12 h-1 bg-white/20" />
                  </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                  <label className="block text-center font-mono text-[9px] text-emerald-500 font-black uppercase tracking-widest">Output_Result</label>
                  <div
                    className={`w-24 h-24 border-4 transition-all duration-500 rounded-sm flex items-center justify-center font-black text-3xl ${output ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-black/40 border-white/5 text-gray-800'}`}
                  >
                    {output ? '1' : '0'}
                  </div>
                </div>

              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <ShieldCheckIcon size={32} className="text-emerald-500/50" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Integrated: Pathway simulation accurate</span>
              </div>
              <button
                onClick={() => { setInputA(false); setInputB(false); }}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <ArrowsClockwiseIcon weight="bold" /> Reset Inputs
              </button>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Logic_Core_v0.6.1</span>
          <span className="text-gray-800">CIRCUIT_STATUS // {output ? 'HIGH_VOLTAGE' : 'LOW_VOLTAGE'}</span>
        </footer>
      </div>
    </div>
  );
};

export default LogicArchitectPage;
