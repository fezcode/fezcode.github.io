import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import VagueEditorialModal from '../components/VagueEditorialModal';
import TheVagueTerminal from '../components/TheVagueTerminal';
import piml from 'piml';
import '../styles/EditorialNew.css';

const TheVaguePage = () => {
  // Data & State
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isInvert, setIsInvert] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/the_vague/issues.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          const data = (parsed.issues || []);
          setIssues(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const getLink = (link) => {
    if (!link) return '#';
    if (link.startsWith('http') || link.startsWith('https')) return link;
    return `/the_vague/${link}`;
  };

  const sortedIssues = useMemo(() => {
      return [...issues].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return  dateB - dateA;
      });
  }, [issues]);

  const latestIssue = useMemo(() => {
    if (issues.length === 0) return null;
    return sortedIssues[0];
  }, [sortedIssues, issues.length]);

  const handleIssueClick = (issue) => {
    setSelectedIssue({
        ...issue,
        url: getLink(issue.link),
        image: issue.thumbnail ? `/the_vague/${issue.thumbnail}` : null,
        actionLabel: 'Download Publication'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a] text-[#f4f4f4]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 bg-[#f4f4f4] animate-spin" />
           <span className="font-instr-sans uppercase tracking-widest text-xs">Loading Collection...</span>
        </div>
      </div>
    );
  }

  const toggleInvert = () => setIsInvert(!isInvert);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className={`vague-editorial ${isInvert ? 'is-invert bg-[#1a1a1a] text-[#f4f4f4]' : 'bg-[#f4f4f4] text-[#1a1a1a]'} ${isNavOpen ? 'has-nav-open' : ''} is-loaded font-instr-serif transition-colors duration-500 min-h-screen`}>
    <Seo
    title="The Vague | Fezcodex"
    description="Issues of The Vague. A collection of thoughts and whispers."
    keywords={['Fezcodex', 'The Vague', 'PDF', 'zine', 'editorial']}
    image="/images/asset/the-vague-page.webp"
    />

    {/* Sidebar Area for Collapsed State */}
    <div
     className={`fixed top-0 left-0 bottom-0 w-[4rem] z-[700] border-r ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'} hidden md:block bg-inherit`}
    />

    {/* Loader */}
    <div className="c-loader">
        <div className="c-loader_spinner font-instr-serif">
            <span>The Vague</span>
        </div>
    </div>

    {/* HEADER */}
    <header className="c-header md:!left-[4rem]">
        <div className="c-header_inner md:!left-[4rem]">
            <p className="c-header_heading font-instr-sans">
                <Link className="c-header_link" to="/">Fezcodex</Link> + <span className="c-header_link">The Vague</span>
            </p>
            <h1 className="c-header_name font-instr-serif">
                <a className="c-header_link" href="#introduction">Editorial Collection</a>
            </h1>
        </div>

        <div className="c-header_buttons font-instr-sans">
            <button className="c-header_invert" type="button" onClick={toggleInvert}>
                <span className="c-header_link">Invert Colors</span>
                <span className="c-header_invert_dot"></span>
            </button>
            <button className="c-button -whiteInvert" onClick={() => setShowTerminal(true)}>
                <span className="c-button_label uppercase tracking-widest text-[10px] font-black">Terminal View</span>
            </button>
        </div>
    </header>

    {/* NAVIGATION / TOC */}
    <div>
        <div className={`c-nav-bg ${isNavOpen ? 'is-visible' : ''}`} onClick={toggleNav}></div>
        <nav className={`c-nav border-r ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'} bg-inherit`}>
            <div className="c-nav_panel">
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={toggleNav} className="p-2">
                        <XIcon size={24} weight="bold" />
                    </button>
                </div>
                <div className="c-nav_panel_main font-instr-serif italic">
                    Collection Index
                    <ol className="c-nav_panel_list font-instr-serif not-italic">
                        {sortedIssues.map((issue, idx) => (
                            <li key={issue.id || idx} className="c-nav_panel_item group">
                                <button
                                    className="c-nav_panel_link text-left flex items-center gap-4"
                                    onClick={() => {
                                        handleIssueClick(issue);
                                        toggleNav();
                                    }}
                                >
                                  <span className="opacity-30 text-sm font-instr-sans mr-2">
                                      {String(sortedIssues.length - idx).padStart(2, '0')}
                                  </span>
                                  <span className="c-nav_panel_label">{issue.title}</span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="c-nav_panel_footer font-instr-sans">
                    <div className="c-nav_panel_links -bold">
                        <Link className="c-nav_panel_link" to="/">←
                            <span className="c-nav_panel_label -under">Back to Fezcodex</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
        <button className="c-navButton" type="button" onClick={toggleNav} aria-label="Menu">
            <span className="c-navButton_wrap">
                <span className="c-navButton_lines">
                    {isNavOpen ? <XIcon size={24} weight="bold" /> : null}
                </span>
                <span className="c-nav_label font-instr-sans uppercase tracking-widest text-[10px] font-black">Table of contents</span>
            </span>
        </button>
    </div>

    {/* MAIN CONTENT */}
    <div className="o-scroll h-screen overflow-y-auto overflow-x-hidden md:pl-[4rem]">
        <main>
            <div className="c-newspaper">
                <div className="c-newspaper_container !pb-0">
                    {latestIssue && (
                        <div id="introduction" className={`border-b ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'}`}>
                            <div className="o-container pt-24 md:pt-32 pb-20">
                                <Link
                                    to="/"
                                    className="c-nav_panel_link inline-flex items-center gap-2 mb-12"
                                >
                                <div className="c-nav_panel_footer font-instr-sans text-xs">
                                    <Link className="c-nav_panel_link" to="/">←
                                      <span className="c-nav_panel_label -under">Back to Fezcodex</span>
                                    </Link>
                                </div>
                                </Link>
                                <header className="c-newspaper_header">
                                    <p className="c-newspaper_header_subtitle font-instr-sans uppercase tracking-[0.2em] text-[11px] opacity-50">Issue No. {issues.length} {'//'} {latestIssue.date}</p>
                                    <h1 className="c-newspaper_header_title font-instr-serif italic">
                                        {latestIssue.title}
                                    </h1>
                                    <div className="c-newspaper_header_info font-instr-sans uppercase tracking-widest text-[10px] font-bold">
                                        <p>Volumes</p>
                                        <p>Latest Publication</p>
                                    </div>
                                </header>
                                <div className="c-newspaper_intro font-instr-serif italic">
                                    <p>
                                        {latestIssue.description}
                                    </p>
                                </div>

                                <div className="mt-[-4rem] font-instr-sans text-center">
                                    <button className="c-button -whiteInvert group" onClick={() => handleIssueClick(latestIssue)}>
                                        <span className="c-button_label uppercase tracking-widest text-xs font-black">View Publication</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEWSPAPER COLUMNS SECTION */}
                    <section className={`border-b ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'}`}>
                        <div className="o-container py-20">
                            <div className="c-newspaper_columns font-instr-serif text-lg md:text-xl">
                                <p className="mb-6">
                                    The Vague is not merely a collection of documents; it is an ongoing exploration into the intersections of digital permanence and ephemeral thought. Each issue represents a localized state of consciousness, captured and formatted for the void. We navigate the silence between the bits, seeking meaning in the static.
                                </p>
                                <p className="mb-6 italic">
                                    "In the garden of forking paths, every decision is a digital signature."
                                </p>
                                <p className="mb-6">
                                    As we progress through the various volumes, the objective remains constant: to document the evolution of the Fezcodex ecosystem. This editorial space serves as a bridge between technical implementation and philosophical inquiry, providing a platform for long-form reflections that transcend the limitations of traditional commits.
                                </p>
                                <p>
                                    Through these pages, we invite you to look closer at the architecture of the unknown. The vague is where clarity begins—a threshold of potential where every whisper carries the weight of a world yet to be built.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ISSUE COLLECTION GRID SECTION */}
                    <section className="relative z-10 w-full  pb-px !mb-0">
                        <div className={`w-full pt-16 pb-16 px-8 md:px-16 border-b ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'}`}>
                            <h2 className="font-instr-sans uppercase tracking-[0.3em] text-[11px] opacity-70 font-black">Issue Collection</h2>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 w-full border-l ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'}`}>
                            {sortedIssues.map((issue, idx) => (
                                <button
                                    key={issue.id || idx}
                                    onClick={() => handleIssueClick(issue)}
                                    className={`p-8 md:p-16 flex flex-col justify-between group !border-r !border-b ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'} transition-all duration-500 text-left min-h-[550px] w-full
                                        ${isInvert ? 'hover:bg-[#f4f4f4] hover:text-[#1a1a1a]' : 'hover:bg-[#1a1a1a] hover:text-[#f4f4f4]'}`}
                                >
                                    <div className="w-full">
                                        <span className="font-instr-sans text-[10px] opacity-50 block mb-8 uppercase tracking-widest font-black">No. 0{issues.length - idx}</span>
                                        <h3 className="font-instr-serif italic text-5xl md:text-8xl leading-[0.9] mb-12 group-hover:translate-x-4 transition-transform duration-700 w-full">
                                            {issue.title}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className={`w-16 h-px mb-10 transition-colors ${isInvert ? 'bg-[#f4f4f4]/25 group-hover:bg-[#1a1a1a]/25' : 'bg-[#1a1a1a]/25 group-hover:bg-[#f4f4f4]/25'}`} />
                                        <span className="font-instr-sans text-[12px] uppercase tracking-[0.3em] font-black opacity-90">{issue.date}</span>
                                        <span className="font-instr-sans text-[10px] uppercase tracking-widest opacity-40 mt-6 flex items-center gap-3 group-hover:opacity-100 transition-all font-black">
                                            Read Publication <span className="text-xl">→</span>
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>

    {/* TERMINAL OVERLAY */}
    <AnimatePresence>
        {showTerminal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000]"
            >
                <TheVagueTerminal
                    issues={sortedIssues}
                    onExit={() => setShowTerminal(false)}
                    onOpenIssue={handleIssueClick}
                />
            </motion.div>
        )}
    </AnimatePresence>

    <VagueEditorialModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        item={selectedIssue}
        isInvert={isInvert}
    />
    </div>
  );
};

export default TheVaguePage;
