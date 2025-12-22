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
  <div className="dnd-wax-seal group-hover:scale-110 transition-transform duration-500">
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

        <header className="text-center mb-24">

          <div className="flex justify-center mb-6">

             <Scroll size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />

          </div>

          <h1 className="text-5xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 leading-none">

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

              <div className="dnd-parchment-container p-6 shadow-xl sticky top-40 border-2 border-black/10 group">

                {/* Small Ornate Corners for Sidebar */}

                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-dnd-gold opacity-40" />

                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-dnd-gold opacity-40" />

                <div className="flex flex-col items-center gap-6 mb-8 pb-6 border-b border-black/10 relative z-10 text-center">

                  <WaxSeal />

                  <div className="space-y-1">

                    <span className="block text-[10px] font-mono uppercase tracking-[0.3em] text-dnd-crimson font-bold">Chronicle_Intel</span>

                    <div className="flex justify-center text-dnd-gold">

                       <ShieldCheck size={16} weight="fill" />

                    </div>

                  </div>

                </div>

                <div className="space-y-6 relative z-10">

                  <div>

                    <label className="block text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1 italic font-bold">Scribe_Name</label>

                    <span className="text-sm font-arvo font-black text-dnd-crimson">{currentEpisode.author}</span>

                  </div>

                  <div className="dnd-mystic-divider !my-2" />

                  <div>

                    <label className="block text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1 italic font-bold">Era_Recorded</label>

                    <span className="text-sm font-arvo text-dnd-text/80">{currentEpisode.date}</span>

                  </div>

                  {currentEpisode.updated && (

                    <>

                      <div className="dnd-mystic-divider !my-2" />

                      <div>

                        <label className="block text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1 italic font-bold">Last_Revision</label>

                        <span className="text-sm font-arvo text-dnd-text/80">{currentEpisode.updated}</span>

                      </div>

                    </>

                  )}

                </div>

              </div>

            </motion.aside>

            <motion.div

              initial={{ opacity: 0, y: 30 }}

              animate={{ opacity: 1, y: 0 }}

              className="lg:col-span-4 dnd-parchment-container p-8 md:p-20 shadow-2xl border-2 border-black/10 min-h-[60vh] flex flex-col"

            >

              <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-16 !h-16" />

              <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-16 !h-16" />

              <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-16 !h-16" />

              <div className="dnd-ornate-corner dnd-ornate-corner-br !w-16 !h-16" />

              <div className="relative z-10 prose prose-lg prose-stone max-w-none dnd-body-text dnd-drop-cap flex-grow">

                <ReactMarkdown rehypePlugins={[rehypeRaw]}>

                  {episodeContent}

                </ReactMarkdown>

              </div>

              {/* Scribe Signature at the bottom of the parchment */}

              <div className="mt-20 pt-12 border-t border-black/5 relative z-10 flex flex-col items-end opacity-60">

                 <span className="font-playfairDisplay italic text-2xl text-dnd-crimson mb-2">{currentEpisode.author}</span>

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

                                className="group flex items-center gap-4 px-6 py-4 bg-white text-black hover:bg-dnd-gold hover:text-primary-600 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-sm w-full"

                              >

                                <CaretLeft size={20} weight="bold" />

                                <div className="flex flex-col text-left">

                                  <span className="text-[8px] font-mono uppercase tracking-widest opacity-60">Prior Entry</span>

                                  <span className="text-sm font-arvo font-bold line-clamp-1">{prevEpisode.title}</span>

                                </div>

                              </Link>

                            )}

                          </div>

                          <Link to="/stories/lore" className="group flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-mono font-black text-xs tracking-[0.4em] hover:bg-dnd-gold hover:text-primary-600 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-sm min-w-[200px]">

                            <List size={18} weight="bold" />

                            Show Index

                          </Link>

                          <div className="w-full md:w-1/3 flex justify-end">

                            {nextEpisode && (

                              <Link

                                to={`/stories/books/${bookId}/pages/${nextEpisode.id}`}

                                className="group flex items-center justify-between gap-4 px-6 py-4 bg-white text-black hover:bg-dnd-gold hover:text-primary-600 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-sm w-full"

                              >

                                <div className="flex flex-col text-right flex-grow">

                                  <span className="text-[8px] font-mono uppercase tracking-widest opacity-60">Next Entry</span>

                                  <span className="text-sm font-arvo font-bold line-clamp-1">{nextEpisode.title}</span>

                                </div>

                                <CaretRight size={20} weight="bold" />

                              </Link>

                            )}

                          </div>

                        </div>      </div>
    </DndLayout>
  );
}

export default DndEpisodePage;
