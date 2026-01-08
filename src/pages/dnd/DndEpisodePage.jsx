import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndLayout from '../../components/dnd/DndLayout';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Scroll, CaretLeft, CaretRight, List, ShieldCheck } from '@phosphor-icons/react';

const WaxSeal = ({ text = 'FC' }) => (
  <div className="dnd-wax-seal group-hover:scale-110 dnd-magical-pulse transition-transform duration-500">
    <span className="dnd-wax-seal-inner">{text}</span>
  </div>
);

function DndEpisodePage() {
  const { bookId, episodeId } = useParams();

  const { setBreadcrumbs } = useContext(DndContext);

  const [episodeContent, setEpisodeContent] = useState('');

  const [episodeTitle, setEpisodeTitle] = useState('');

  const [book, setBook] = useState(null);

  const [currentEpisode, setCurrentEpisode] = useState(null);

  const [allBooks, setAllBooks] = useState([]);

  useSeo({

    title: `${episodeTitle} | From Serfs and Frauds`,

    description: `Read the episode "${episodeTitle}" from the Dungeons & Dragons campaign, From Serfs and Frauds.`,

    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'episode', episodeTitle],

  });

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/stories/books.piml`);

        if (response.ok) {
          const pimlText = await response.text();

          const data = piml.parse(pimlText);

          setAllBooks(data.books);
        }
      } catch (error) {
        console.error('Failed to fetch all books:', error);
      }
    };

    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (allBooks.length > 0 && bookId && episodeId) {
      const foundBook = allBooks.find((b) => b.bookId === parseInt(bookId));

      if (foundBook) {
        setBook(foundBook);

        const currentEpisodeIndex = foundBook.episodes.findIndex(

          (ep) => ep.id === parseInt(episodeId),

        );

        if (currentEpisodeIndex !== -1) {
          const currentEp = foundBook.episodes[currentEpisodeIndex];

          setCurrentEpisode(currentEp);

          setEpisodeTitle(currentEp.title);

          setBreadcrumbs([

            { label: 'S&F', path: '/stories' },

            { label: 'The Lore', path: '/stories/lore' },

            {

              label: foundBook.bookTitle,

              path: `/stories/books/${foundBook.bookId}`,

            },

            { label: currentEp.title },

          ]);

          const fetchEpisodeContent = async () => {
            try {
              const response = await fetch(`${process.env.PUBLIC_URL}/stories/${currentEp.filename}`);

              if (response.ok) {
                const text = await response.text();

                setEpisodeContent(text);
              }
            } catch (error) {
              console.error('Failed to fetch episode content:', error);

              setEpisodeContent('Failed to load episode content.');
            }
          };

          fetchEpisodeContent();
        }
      }
    }
  }, [allBooks, bookId, episodeId, setBreadcrumbs]);

  const currentEpisodeIndex = book

    ? book.episodes.findIndex((ep) => ep.id === parseInt(episodeId))

    : -1;

  const prevEpisode = book && currentEpisodeIndex > 0 ? book.episodes[currentEpisodeIndex - 1] : null;

  const nextEpisode = book && currentEpisodeIndex < book.episodes.length - 1 ? book.episodes[currentEpisodeIndex + 1] : null;

  return (

    <DndLayout>

      <div className="max-w-7xl mx-auto px-6 py-12">

        <header className="text-center mb-12 md:mb-24 px-4">

          <div className="flex justify-center mb-6">

             <Scroll size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />

          </div>

                    <h1 className="text-4xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 leading-none dnd-header-pulse">

                      {episodeTitle}

                    </h1>

          <div className="h-px w-32 bg-dnd-gold mx-auto opacity-40" />

        </header>

                {book && currentEpisode && (

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

                    <motion.aside

                      initial={{ opacity: 0, x: -20 }}

                      animate={{ opacity: 1, x: 0 }}

                      className="lg:col-span-1"

                    >

                                    <div className="dnd-stat-block shadow-2xl lg:sticky lg:top-40 group">

                                      {/* Hidden message in sidebar */}

                                      <div className="absolute -bottom-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden md:block">

                                         <span className="dnd-secret-text text-[8px] uppercase tracking-[0.2em]">Don't believe the scribes</span>

                                      </div>

                                      <div className="dnd-stat-block-header">

                          {currentEpisode.author}

                        </div>

                        <div className="text-[10px] italic text-dnd-crimson/80 mb-4 uppercase font-bold tracking-widest">

                          Archival Scribe, Level 20

                        </div>

                        <div className="h-1 w-full bg-dnd-crimson/20 my-4" />

                        <div className="space-y-4">

                          <div className="grid grid-cols-2 gap-4 text-center">

                            <div>

                              <div className="dnd-stat-block-label">Date</div>

                              <div className="text-xs font-bold">{currentEpisode.date}</div>

                            </div>

                            <div>

                              <div className="dnd-stat-block-label">Seal</div>

                              <div className="flex justify-center mt-1">

                                <ShieldCheck size={16} className="text-dnd-crimson" weight="fill" />

                              </div>

                            </div>

                          </div>

                          <div className="h-1 w-full bg-dnd-crimson/20 my-4" />

                          <div className="space-y-3">

                            <div className="text-xs">

                              <span className="dnd-stat-block-label">Special Trait.</span>

                              <span className="italic ml-1">Chronicler of the Realm.</span> This scribe adds their wisdom modifier to all storytelling checks.

                            </div>

                            {currentEpisode.updated && (

                              <div className="text-xs">

                                <span className="dnd-stat-block-label">Revision.</span>

                                <span className="ml-1 text-dnd-crimson/80 font-bold">{currentEpisode.updated}</span>

                              </div>

                            )}

                          </div>

                          <div className="flex justify-center pt-6">

                            <WaxSeal text="SF" />

                          </div>

                        </div>

                      </div>

                    </motion.aside>

                                            <motion.div

                                              initial={{ opacity: 0, y: 30 }}

                                              animate={{ opacity: 1, y: 0 }}

                                              className="lg:col-span-4 dnd-parchment-container p-6 md:p-24 shadow-2xl border-2 border-black/10 min-h-[60vh] flex flex-col relative dnd-parchment-glow"

                                            >

                                              {/* Secret Inscriptions */}

                                              <div className="absolute top-1/4 -left-4 -rotate-90 pointer-events-none hidden md:block">

                                                 <span className="dnd-secret-text text-[10px] uppercase tracking-[1em]">The walls have eyes</span>

                                              </div>

                                              <div className="absolute bottom-1/4 -right-4 rotate-90 pointer-events-none hidden md:block">

                                                 <span className="dnd-secret-text text-[10px] uppercase tracking-[1em]">History is written by survivors</span>

                                              </div>

                                              {/* Scroll Ornaments */}

                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-b-full blur-xl dnd-scroll-accent" />

                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-t-full blur-xl dnd-scroll-accent" />

                      <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-12 md:!w-20 !h-12 md:!h-20" />

                      <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-12 md:!w-20 !h-12 md:!h-20" />

                      <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-12 md:!w-20 !h-12 md:!h-20" />

                      <div className="dnd-ornate-corner dnd-ornate-corner-br !w-12 md:!w-20 !h-12 md:!h-20" />

                      <div className="relative z-10 prose prose-lg prose-stone max-w-none dnd-body-text dnd-drop-cap flex-grow">

                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>

                          {episodeContent}

                        </ReactMarkdown>

                      </div>

              {/* Scribe Signature at the bottom of the parchment */}

              <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-black/5 relative z-10 flex flex-col items-end opacity-60">

                 <span className="font-playfairDisplay italic text-xl md:text-2xl text-dnd-crimson mb-2">{currentEpisode.author}</span>

                 <div className="h-px w-32 bg-dnd-crimson/20 mb-1" />

                 <span className="font-mono text-[8px] uppercase tracking-[0.5em]">Verified_Archive_Seal</span>

              </div>

            </motion.div>

          </div>

        )}

                                <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 pt-12 border-t border-white/10">

                                  <div className="w-full md:w-1/3 flex">

                                    {prevEpisode && (

                                      <Link

                                        to={`/stories/books/${bookId}/pages/${prevEpisode.id}`}

                                        className="group relative flex items-center gap-4 p-6 dnd-parchment-container border-2 border-black/10 hover:border-dnd-gold/50 transition-all shadow-xl hover:-translate-y-1 w-full overflow-hidden"

                                      >

                                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-dnd-gold opacity-40 group-hover:opacity-100" />

                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-dnd-gold opacity-40 group-hover:opacity-100" />

                                        <CaretLeft size={24} weight="bold" className="text-dnd-crimson group-hover:scale-125 transition-transform" />

                                        <div className="flex flex-col text-left relative z-10">

                                          <span className="text-[8px] font-mono uppercase tracking-widest text-black/40">Prior Entry</span>

                                          <span className="text-sm font-arvo font-bold text-dnd-crimson line-clamp-1">{prevEpisode.title}</span>

                                        </div>

                                      </Link>

                                    )}

                                  </div>

                                  <Link to="/stories/lore" className="group relative flex items-center justify-center gap-3 px-10 py-5 dnd-parchment-container border-2 border-black/10 hover:border-dnd-gold/50 transition-all shadow-xl hover:-translate-y-1 min-w-[240px] overflow-hidden">

                                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-dnd-gold opacity-40 group-hover:opacity-100" />

                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-dnd-gold opacity-40 group-hover:opacity-100" />

                                    <List size={20} weight="bold" className="text-dnd-crimson" />

                                    <span className="font-mono font-black text-xs tracking-[0.4em] text-dnd-crimson">Show Index</span>

                                  </Link>

                                  <div className="w-full md:w-1/3 flex justify-end">

                                    {nextEpisode && (

                                      <Link

                                        to={`/stories/books/${bookId}/pages/${nextEpisode.id}`}

                                        className="group relative flex items-center justify-between gap-4 p-6 dnd-parchment-container border-2 border-black/10 hover:border-dnd-gold/50 transition-all shadow-xl hover:-translate-y-1 w-full overflow-hidden"

                                      >

                                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-dnd-gold opacity-40 group-hover:opacity-100" />

                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-dnd-gold opacity-40 group-hover:opacity-100" />

                                        <div className="flex flex-col text-right flex-grow relative z-10">

                                          <span className="text-[8px] font-mono uppercase tracking-widest text-black/40">Next Entry</span>

                                          <span className="text-sm font-arvo font-bold text-dnd-crimson line-clamp-1">{nextEpisode.title}</span>

                                        </div>

                                        <CaretRight size={24} weight="bold" className="text-dnd-crimson group-hover:scale-125 transition-transform" />

                                      </Link>

                                    )}

                                  </div>

                                </div>      </div>
    </DndLayout>
  );
}

export default DndEpisodePage;
