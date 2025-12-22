import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  WarningIcon,
  CheckCircleIcon,
  FlaskIcon,
  PaletteIcon,
  CursorIcon,
  TextAaIcon,
  LayoutIcon,
  CodeIcon,
  CubeIcon,
  FileTextIcon,
  ArticleIcon,
  KanbanIcon,
  ColumnsIcon,
  TrophyIcon,
  TerminalIcon,
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import {useToast} from '../hooks/useToast';
import BreadcrumbTitle from '../components/BreadcrumbTitle';
import GenerativeArt from '../components/GenerativeArt';
import CustomDropdown from '../components/CustomDropdown';
import CustomSlider from '../components/CustomSlider';
import BrutalistDialog from '../components/BrutalistDialog';
import GenericModal from '../components/GenericModal';
import ProjectCard from '../components/ProjectCard';
import LogCard from '../components/LogCard';
import PostTile from '../components/PostTile';
import RoadmapCard from '../components/roadmap/RoadmapCard';

const mockProject = {
  id: 'fez-99',
  slug: 'brufez-spec',
  title: 'Quantum Neural Interface',
  shortDescription: 'A next-generation interface for neural data processing.',
  status: 'Active',
  technologies: ['React', 'WebGL', 'Rust']
};

const mockLog = {
  id: 'log-42',
  slug: 'the-great-read',
  title: 'The Design of Everyday Things',
  category: 'Book',
  by: 'Don Norman',
  date: '2025-12-21',
  rating: 5,
  platform: 'Physical'
};

const mockPost = {
  slug: 'live-from-brufez',
  title: 'Live Data Stream Protocol',
  date: '2025-12-21',
  description: 'Testing the new Brufez rendering engine in real-time.',
  category: 'dev',
  tags: ['Brufez', 'React', 'Experimental']
};

const mockIssue = {
  id: 'FEZ-999',
  title: 'Full System Integration',
  description: 'Completing the neural bridge between PIML and React.',
  status: 'Planned',
  priority: 'High',
  created_at: '2025-12-21T18:00:00Z'
};

const BrufezPage = () => {
  useSeo({
    title: `Brufez | Design Language Spec`,
    description: 'System documentation for the Brufez design language. A study in systemic transparency and digital rawness.',
    keywords: ['Brufez', 'design system', 'brutalist', 'ui', 'fezcodex'],
  });

  const {addToast} = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('option_01');
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-32">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold"/>
            <span>Back_to_Root</span>
          </Link>
          <BreadcrumbTitle
            title="Brufez Design Language"
            breadcrumbs={['fc', 'brufez', 'spec']}
            variant="brutalist"
          />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <p className="text-gray-400 font-mono text-sm max-w-2xl uppercase tracking-widest leading-relaxed">
                Systemic transparency protocol. Celebrated structural logic, 1PX borders, and
                <span className="text-emerald-400 font-bold"> high-frequency contrast</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/brufez/panels"
                  className="group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-emerald-400"
                >
                  <ColumnsIcon weight="bold" size={16}/>
                  Launch_Layout_Panels
                </Link>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[9px] uppercase tracking-widest flex items-center">
                    v1.0.4_STABLE
                  </span>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px] uppercase tracking-widest flex items-center">
                    KERNEL_6.5
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Aesthetic_Profile</span>
                <span className="text-3xl font-black text-emerald-500">RAW_TERMINAL</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-20">

            {/* Philosophy Section */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <FlaskIcon weight="fill"/>
                01_CORE_PHILOSOPHY
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-gray-300 font-light leading-relaxed">
                  Brufez is a departure from the "soft" web. It rejects rounded corners, subtle gradients, and hidden structures.
                  Instead, it embraces the machine—making the grid visible, the processes transparent, and the feedback absolute.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-6 border border-white/10 bg-white/5 space-y-4">
                    <h4 className="text-white uppercase font-black tracking-tighter text-lg m-0">Structural Logic</h4>
                    <p className="text-xs text-gray-400 font-mono uppercase m-0">If it exists, it must be bounded. Borders are 1PX solid, highlighting the layout hierarchy.</p>
                  </div>
                  <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                    <h4 className="text-emerald-400 uppercase font-black tracking-tighter text-lg m-0">Active Feedback</h4>
                    <p className="text-xs text-gray-400 font-mono uppercase m-0">System states are communicated via color shifts and high-frequency animations (pulses, glitters).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Components */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <CursorIcon weight="fill" className="text-emerald-500"/>
                02_INPUT_TRIGGERS
              </h3>

              <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm space-y-12 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                  <GenerativeArt seed="interactives" className="w-full h-full" />
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-[10px]">
                      PRIMARY_COMMAND
                    </button>
                    <button className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest">
                      SECONDARY_NODE
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Selection_Matrix</label>
                      <CustomDropdown
                        fullWidth
                        options={[
                          {label: 'ENCRYPTED_STREAM', value: 'option_01'},
                          {label: 'RECURSIVE_DRAFT', value: 'option_02'},
                          {label: 'NULL_POINTER', value: 'option_03'},
                        ]}
                        value={dropdownVal}
                        onChange={setDropdownVal}
                        variant="brutalist"
                      />
                    </div>
                    <div className="space-y-4">
                      <CustomSlider
                        label="Neural Throughput"
                        min={0}
                        max={100}
                        value={sliderVal}
                        onChange={setSliderVal}
                        variant="brutalist"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="check-1" defaultChecked className="w-4 h-4 accent-emerald-500 bg-white/10 border-white/20 rounded-sm" />
                      <label htmlFor="check-1" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest cursor-pointer">Live_Telemetry</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="check-2" className="w-4 h-4 accent-emerald-500 bg-white/10 border-white/20 rounded-sm" />
                      <label htmlFor="check-2" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest cursor-pointer">Debug_Overlay</label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

                        {/* Typography Section */}
                        <section className="space-y-8">
                          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                            <TextAaIcon weight="fill" className="text-emerald-500"/>
                            03_TYPOGRAPHY_SPEC
                          </h3>

                          <div className="border border-white/10 p-8 md:p-12 space-y-12 bg-white/[0.01] overflow-hidden">
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em]">H1_Large_Display</span>
                              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none break-words">BRUFEZ_CORE</h1>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em]">H2_Section_Header</span>
                              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none break-words">SYSTEM_OVERRIDE</h2>
                            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">System_Mono</span>
                    <p className="font-mono text-sm uppercase tracking-widest text-gray-400 leading-relaxed">
                      Used for metadata, process logs, and technical specifications. High letter-spacing for maximum clarity.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">Standard_Sans</span>
                    <p className="text-lg text-gray-300 font-light leading-relaxed">
                      Used for prose, descriptions, and primary messaging. Clean, accessible, and high-contrast.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-20">

            {/* Color Palette */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <PaletteIcon weight="fill" className="text-emerald-500"/>
                04_CHROMATIC_ARRAY
              </h3>

              <div className="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
                {[
                  {name: 'SYSTEM_BLACK', hex: '#050505', text: 'text-white', desc: 'Primary Background'},
                  {name: 'SYSTEM_WHITE', hex: '#FFFFFF', text: 'text-black', bg: 'bg-white', desc: 'Primary Surface'},
                  {name: 'BRUFEZ_EMERALD', hex: '#10B981', text: 'text-black', bg: 'bg-emerald-500', desc: 'Active Interaction'},
                  {name: 'NEURAL_GRAY', hex: '#6B7280', text: 'text-white', bg: 'bg-gray-500', desc: 'Metadata & Inactive'},
                  {name: 'DANGER_ROSE', hex: '#F43F5E', text: 'text-white', bg: 'bg-rose-500', desc: 'Terminal Warnings'},
                ].map((color) => (
                  <div key={color.name} className="bg-[#050505] p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 border border-white/10 ${color.bg || 'bg-[#050505]'}`} />
                      <div className="space-y-1">
                        <div className="text-xs font-black font-mono tracking-widest">{color.name}</div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase">{color.desc}</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">{color.hex}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* System Status Display */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <ChartBarIcon weight="fill" className="text-emerald-500"/>
                05_STATUS_OVERLAYS
              </h3>

              <div className="space-y-4">
                <div className="p-6 border border-white/10 bg-white/[0.02] space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Feedback_Protocols</span>
                    <span className="text-[8px] font-mono text-gray-700 uppercase">Interactive_Nodes</span>
                  </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <button
                                        onClick={() => addToast({title: 'SYSTEM_SYNC', message: 'SUCCESS: PAYLOAD_SYNC_COMPLETE', type: 'success'})}
                                        className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                      >
                                        <CheckCircleIcon weight="fill" size={16}/> TRIGGER_SUCCESS
                                      </button>
                                      <button
                                        onClick={() => addToast({title: 'ACHIEVEMENT_UNLOCKED', message: 'GOLD: RARE_METRIC_ESTABLISHED', type: 'gold'})}
                                        className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                                      >
                                        <TrophyIcon weight="fill" size={16}/> TRIGGER_GOLD
                                      </button>
                                      <button
                                        onClick={() => addToast({title: 'CRITICAL_FAILURE', message: 'ERROR: REALITY_SYNC_FAILED', type: 'error'})}
                                        className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-mono uppercase tracking-widest hover:bg-rose-500 hover:text-black transition-all"
                                      >
                                        <WarningIcon weight="fill" size={16}/> TRIGGER_ERROR
                                      </button>
                                      <button
                                        onClick={() => addToast({title: 'LOG_SEQUENCE', message: 'TECHNO: INITIALIZING_BRUFEZ_SPEC', type: 'techno'})}
                                        className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                      >
                                        <TerminalIcon weight="fill" size={16}/> TRIGGER_TECHNO
                                      </button>
                                    </div>                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setIsDialogOpen(true)} className="py-4 border border-white/10 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest">
                    Invoke_Dialog
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="py-4 border border-white/10 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest">
                    Invoke_Modal
                  </button>
                </div>
              </div>
            </section>

            {/* Layout Patterns */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <LayoutIcon weight="fill" className="text-emerald-500"/>
                06_LAYOUT_PATTERNS
              </h3>

              <div className="space-y-4">
                <Link to="/brufez/panels" className="block group">
                  <div className="aspect-video w-full border border-white/10 bg-white/[0.02] flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-all">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                      <GenerativeArt seed="layout" className="w-full h-full" />
                    </div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
                    <div className="flex flex-col items-center gap-4 z-10">
                      <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.5em] group-hover:text-emerald-500 transition-colors">Focal_Matrix</span>
                      <span className="px-3 py-1 bg-white/5 text-[8px] font-mono text-gray-500 group-hover:bg-emerald-500 group-hover:text-black transition-all uppercase">Open_Dual_Panel_View</span>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-4">
                  <div className="flex-1 h-12 border border-white/10 bg-white/5" />
                  <div className="flex-1 h-12 border border-white/10 bg-white/5" />
                  <div className="flex-1 h-12 border border-emerald-500/20 bg-emerald-500/5" />
                </div>
              </div>
            </section>

            {/* Code Block Demo */}
            <section className="space-y-8">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <CodeIcon weight="fill" className="text-emerald-500"/>
                07_CODE_SYNTAX
              </h3>
              <div className="bg-black border border-white/10 p-6 font-mono text-xs text-gray-400 space-y-2 overflow-x-auto">
                <div className="flex gap-4"><span className="text-gray-700">01</span><span><span className="text-emerald-500">const</span> identity = <span className="text-white">'BRUFEZ'</span>;</span></div>
                <div className="flex gap-4"><span className="text-gray-700">02</span><span><span className="text-emerald-500">export default</span> identity;</span></div>
                <div className="flex gap-4"><span className="text-gray-700">03</span><span className="text-gray-600">{'//'} End of specification</span></div>
              </div>
            </section>

          </div>
        </div>

        {/* Domain Entities - Full Width Row */}
        <section className="mt-32 space-y-12">
          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <CubeIcon weight="fill" className="text-emerald-500"/>
            08_DOMAIN_ENTITIES
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <CubeIcon size={14} /> TYPE: PROJECT_CARD
              </span>
              <div className="border border-white/10 bg-white/[0.01] p-4">
                <ProjectCard project={mockProject} index={0} isActive={true} />
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <FileTextIcon size={14} /> TYPE: LOG_ENTRY
                </span>
                <LogCard log={mockLog} index={0} totalLogs={1} />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <ArticleIcon size={14} /> TYPE: BLOG_POST
                </span>
                <PostTile post={mockPost} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <KanbanIcon size={14} /> TYPE: SYSTEM_ISSUE
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RoadmapCard app={mockIssue} />
              <div className="border border-white/5 bg-white/[0.01] border-dashed rounded-sm" />
              <div className="border border-white/5 bg-white/[0.01] border-dashed rounded-sm" />
            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-4">
            <PaletteIcon weight="fill" />
            <span>BRUFEZ_SPEC_V1.0.4</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-gray-800">SYSTEM_STABLE</span>
            <span className="text-emerald-500/50">LIVE_TELEMETRY</span>
          </div>
        </footer>
      </div>

      <BrutalistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          setIsDialogOpen(false);
          addToast({message: 'DIALOG_EXECUTION_CONFIRMED', type: 'success'});
        }}
        title="BRUFEZ_MODAL_TEST"
        message="This is a demonstration of the BrutalistDialog component. It features corner accents and a blurred background protocol."
        confirmText="VERIFY_SYSTEM"
        cancelText="TERMINATE"
      />

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generic_Modal_Protocol"
      >
        <div className="space-y-6 py-4">
          <p className="text-sm font-mono text-gray-400 uppercase leading-relaxed m-0">
            Standard container for non-critical information displays. Maintains basic structural integrity while allowing for custom children blocks.
          </p>
          <div className="h-24 w-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.5em]">Block_Content</span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all"
          >
            Close_Interface
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default BrufezPage;