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
        actionLabel: 'Download Artifact'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a] text-[#f4f4f4]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 bg-[#f4f4f4] animate-spin" />
           <span className="font-instr-sans uppercase tracking-widest text-xs">Loading Archive...</span>
        </div>
      </div>
    );
  }

  const toggleInvert = () => setIsInvert(!isInvert);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className={`vague-editorial ${isInvert ? 'is-invert' : ''} ${isNavOpen ? 'has-nav-open' : ''} is-loaded font-instr-serif`}>
       <Seo
        title="The Vague | Fezcodex"
        description="Issues of The Vague. A collection of thoughts and whispers."
        keywords={['Fezcodex', 'The Vague', 'PDF', 'zine', 'editorial']}
        image="/images/asset/the-vague-page.webp"
       />

       {/* Loader */}
       <div className="c-loader">
            <div className="c-loader_spinner font-instr-serif">
                <span>The Vague</span>
            </div>
        </div>

        {/* HEADER */}
        <header className="c-header">
            <div className="c-header_inner">
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
                                    <nav className="c-nav">
                                        <div className="c-nav_panel">
                                            <div className="md:hidden flex justify-end mb-4">
                                                <button onClick={toggleNav} className="p-2">
                                                    <XIcon size={24} weight="bold" />
                                                </button>
                                            </div>
                                            <div className="c-nav_panel_main font-instr-sans">
                                                Archive Index                                                            <ol className="c-nav_panel_list font-instr-sans">
                                                                {sortedIssues.map((issue, idx) => (
                                                                    <li key={issue.id || idx} className="c-nav_panel_item group">
                                                                        <button
                                                                            className="c-nav_panel_link text-left flex items-center gap-4"
                                                                            onClick={() => {
                                                                                handleIssueClick(issue);
                                                                                toggleNav();
                                                                            }}
                                                                        >
                                                                            <span className="c-nav_panel_label -under">{issue.title}</span>
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ol>                                </div>
                                <div className="c-nav_panel_footer font-instr-sans">                        <div className="c-nav_panel_links -bold">
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
                <div className="o-scroll h-screen overflow-y-auto overflow-x-hidden">
                    <main>
                                        {/* HERO / NEWSPAPER SECTION */}
                                        {latestIssue && (
                                            <div id="introduction">
                                                <div className="c-newspaper">
                                                    <div className="c-newspaper_container">
                                                        <div className="o-container pt-24 md:pt-32">
                                                                                                <Link
                                                                                                    to="/"
                                                                                                    className="c-nav_panel_link inline-flex items-center gap-2 mb-12"
                                                                                                >
                                                                                                    <span className="c-nav_panel_label -under font-instr-sans uppercase tracking-[0.3em] text-[10px] font-black">← Back to Fezcodex</span>
                                                                                                </Link>                                            <header className="c-newspaper_header">                                        <p className="c-newspaper_header_subtitle font-instr-sans uppercase tracking-[0.2em] text-[11px] opacity-50">Issue No. {issues.length} {'//'} {latestIssue.date}</p>
                                        <h1 className="c-newspaper_header_title font-instr-serif italic">
                                            {latestIssue.title}
                                        </h1>
                                        <div className="c-newspaper_header_info font-instr-sans uppercase tracking-widest text-[10px] font-bold">
                                            <p>Volumes</p>
                                            <p>Latest Artifact</p>
                                        </div>
                                    </header>
                                    <div className="c-newspaper_intro font-instr-serif italic">
                                        <p>
                                            {latestIssue.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 font-instr-sans pb-20 text-center">
                                        <button className="c-button -black" onClick={() => handleIssueClick(latestIssue)}>
                                            <span className="c-button_label uppercase tracking-widest text-xs font-black">Open Issue Artifact</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
