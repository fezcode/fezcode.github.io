import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeftIcon,
  StarIcon,
  ShareNetworkIcon,
  TagIcon,
  UserIcon,
  CalendarBlankIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import piml from 'piml';
import colors from '../../config/colors';

const LuxeLogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/logs/${category}/${category}.piml`);
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const pimlText = await response.text();
        const data = piml.parse(pimlText);
        const categoryLogs = data.logs || [];
        const logMetadata = categoryLogs.find((item) => item.slug === slugId);

        if (logMetadata) {
          try {
            const logContentResponse = await fetch(
              `/logs/${category}/${slugId}.txt`,
            );
            if (logContentResponse.ok) {
              const logBody = await logContentResponse.text();
              setLog({ attributes: logMetadata, body: logBody });
            } else {
              setLog({
                attributes: logMetadata,
                body: logMetadata.description || '',
              });
            }
          } catch (e) {
            setLog({
              attributes: logMetadata,
              body: logMetadata.description || '',
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchLog();
  }, [category, slugId]);

  if (loading || !log) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        {loading ? 'Loading Log...' : 'Log Not Found'}
      </div>
    );
  }

  const { attributes, body } = log;
  const accentColor = colors[category.toLowerCase()] || colors.primary[400];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] selection:bg-[#C0B298] selection:text-black">
      <Seo
        title={`${attributes.title} | Fezcodex Logs`}
        description={body.substring(0, 150)}
        image={attributes.image}
      />

      {/* Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-[60vh] w-full flex flex-col justify-center items-center text-center px-6"
      >
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <LuxeArt
            seed={attributes.title}
            className="w-full h-full mix-blend-multiply filter grayscale contrast-125"
          />
        </div>

        <div className="relative z-10 max-w-4xl space-y-8">
          <Link
            to="/logs"
            className="inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors mb-4"
          >
            <ArrowLeftIcon /> Back to Archives
          </Link>

          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={16}
                  weight="fill"
                  className={
                    i < (attributes.rating || 0)
                      ? 'text-[#8D4004]'
                      : 'text-[#1A1A1A]/10'
                  }
                />
              ))}
            </div>
          </div>

          <h1 className="font-playfairDisplay text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] leading-[0.9]">
            {attributes.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-6 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/50">
            <span
              className="flex items-center gap-2 px-3 py-1 rounded-full border font-bold text-black"
              style={{ backgroundColor: accentColor, borderColor: accentColor }}
            >
              <TagIcon size={14} weight="fill" /> {category}
            </span>
            {attributes.author && (
              <span className="flex items-center gap-2">
                <UserIcon size={14} /> {attributes.author}
              </span>
            )}
            <span className="flex items-center gap-2">
              <CalendarBlankIcon size={14} /> {attributes.date}
            </span>
          </div>
        </div>
      </motion.div>
      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 pb-32 relative z-20 bg-[#F5F5F0]">
        {/* Main Body */}
        <div
          className="prose prose-stone prose-lg max-w-none
              prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-[#1A1A1A]
              prose-p:font-outfit prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed
              prose-a:text-[#8D4004] prose-a:no-underline prose-a:border-b prose-a:border-[#8D4004]/30 hover:prose-a:border-[#8D4004] prose-a:transition-colors
              prose-strong:font-medium prose-strong:text-[#1A1A1A]
              prose-li:font-outfit prose-li:text-[#1A1A1A]/80
              prose-blockquote:border-l-[#8D4004] prose-blockquote:bg-[#EBEBEB] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
          "
        >
          <MarkdownContent
            content={body}
            components={{
              a: (p) => (
                <MarkdownLink
                  {...p}
                  className="text-[#8D4004] hover:text-black transition-colors"
                />
              ),
            }}
          />
        </div>

        {/* Footer / Meta */}
        <div className="mt-20 pt-12 border-t border-[#1A1A1A]/10 flex flex-col items-center gap-8">
          {attributes.link && (
            <a
              href={attributes.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-outfit text-xs uppercase tracking-widest hover:bg-[#8D4004] transition-colors"
            >
              External Source <ArrowUpRightIcon weight="bold" />
            </a>
          )}

          <div className="flex gap-4">
            <button className="flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#8D4004] transition-colors">
              <ShareNetworkIcon size={16} /> Share Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxeLogDetailPage;
