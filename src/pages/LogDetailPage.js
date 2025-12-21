import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  CalendarBlank,
  Tag,
  Star,
  ArrowUpRight,
  Clock,
  User,
  Hash,
} from '@phosphor-icons/react';
import ImageModal from '../components/ImageModal';
import GenerativeArt from '../components/GenerativeArt';
import useSeo from '../hooks/useSeo';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import MarkdownLink from '../components/MarkdownLink';
import colors from '../config/colors';

const LogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  useSeo({
    title: log ? `${log.attributes.title} | Fezcodex` : null,
    description: log ? log.body.substring(0, 150) : null,
    ogImage: log?.attributes?.image || '/images/asset/ogtitle.png',
  });

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/logs/${category}/${category}.piml`);
        if (!response.ok) {
          setLog({ attributes: { title: 'Category not found' }, body: '' });
          setLoading(false);
          return;
        }
        const pimlText = await response.text();
        const data = piml.parse(pimlText);
        const categoryLogs = data.logs || [];
        const logMetadata = categoryLogs.find((item) => item.slug === slugId);

        if (logMetadata) {
          const logContentResponse = await fetch(
            `/logs/${category}/${slugId}.txt`,
          );
          if (logContentResponse.ok) {
            const logBody = await logContentResponse.text();
            setLog({ attributes: logMetadata, body: logBody });
          }
        } else {
          setLog({ attributes: { title: 'Log not found' }, body: '' });
        }
      } catch (error) {
        setLog({ attributes: { title: 'Error loading log' }, body: '' });
      }
      setLoading(false);
    };
    fetchLog();
  }, [category, slugId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            Accessing_Log
          </span>
        </div>
      </div>
    );
  }

  if (!log || !log.attributes.title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white font-mono uppercase">
        404 // Log Not Found
      </div>
    );
  }

  const { attributes, body } = log;
  const accentColor = colors[category.toLowerCase()] || colors.primary[400];

  const ImageRenderer = ({ src, alt }) => (
    <div className="my-12 relative group overflow-hidden border border-white/10 rounded-sm">
      <img
        src={src}
        alt={alt}
        className="cursor-pointer w-full h-auto transition-transform duration-700 group-hover:scale-105"
        onClick={() => setModalImageSrc(src)}
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );

  const MetadataRow = ({ label, value, icon: Icon }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col gap-1 py-4 border-b border-white/5">
        <span className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          {Icon && (
            <Icon size={12} weight="bold" className="text-emerald-500" />
          )}
          {label}
        </span>
        <span className="text-sm text-gray-200">{value}</span>
      </div>
    );
  };

  const renderStars = (rating) => {
    if (rating === undefined || rating === null) return null;
    return (
      <div className="flex flex-col gap-2 py-4 border-b border-white/5">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Star size={12} weight="bold" className="text-yellow-500" />
          Rating
        </span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              weight="fill"
              className={i < rating ? 'text-yellow-500' : 'text-white/10'}
            />
          ))}
          <span className="ml-2 font-mono text-xs text-gray-400">
            ({rating}/5)
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col justify-end overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <GenerativeArt
            seed={attributes.title}
            className="w-full h-full opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pb-20">
          <Link
            to="/logs"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Archive</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border rounded-full bg-opacity-20 backdrop-blur-md"
              style={{
                color: accentColor,
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}10`,
              }}
            >
              {category}
            </span>
            {attributes.updated && (
              <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 border border-rose-400/20 rounded-full bg-rose-400/5">
                Updated
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 max-w-4xl">
            {attributes.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <CalendarBlank size={16} className="text-emerald-500" />
              <span>Published: {attributes.date}</span>
            </div>
            {attributes.slug && (
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-emerald-500" />
                <span>ID: {attributes.slug}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Reading Column */}
          <main className="lg:col-span-8">
            <article
              ref={contentRef}
              className="prose prose-xl prose-dark prose-emerald max-w-none
                         prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black
                         prose-p:text-gray-300 prose-p:leading-relaxed
                         prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                         prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-6
                         prose-strong:text-white prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-1 prose-code:rounded-sm"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: (props) => (
                    <MarkdownLink
                      {...props}
                      className="text-emerald-400 hover:text-white transition-colors underline decoration-emerald-500/30 underline-offset-4"
                    />
                  ),
                  img: ImageRenderer,
                }}
              >
                {body}
              </ReactMarkdown>
            </article>

            {/* Tags Section */}
            {attributes.tags && attributes.tags.length > 0 && (
              <div className="mt-20 pt-12 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {attributes.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest hover:text-white hover:border-white transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar Metadata */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div className="border border-white/10 p-8 bg-white/[0.02] backdrop-blur-sm rounded-sm relative overflow-hidden group">
                {/* Background accent line */}
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Tag weight="fill" />
                  Manifest Data
                </h3>
                <div className="flex flex-col">
                  <MetadataRow
                    label="Category"
                    value={attributes.category}
                    icon={Tag}
                  />
                  <MetadataRow
                    label="Creator/Author"
                    value={
                      attributes.author ||
                      attributes.director ||
                      attributes.artist ||
                      attributes.creator ||
                      attributes.by
                    }
                    icon={User}
                  />
                  <MetadataRow
                    label="Platform/Source"
                    value={attributes.platform || attributes.source}
                    icon={ArrowUpRight}
                  />
                  <MetadataRow
                    label="Release Year"
                    value={attributes.year}
                    icon={Clock}
                  />
                  <MetadataRow
                    label="Last Updated"
                    value={attributes.updated}
                    icon={CalendarBlank}
                  />
                  {renderStars(attributes.rating)}
                </div>
                {attributes.link && (
                  <a
                    href={attributes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-start gap-3 group/link border border-emerald-500/20 hover:border-emerald-500 p-4 transition-all"
                  >
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 group-hover/link:text-emerald-500 transition-colors">
                      Access External Source
                    </span>
                    <ArrowUpRight
                      className="text-emerald-400 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                      size={20}
                    />
                  </a>
                )}{' '}
              </div>

              {/* Optional: Read More / Next Prev could go here */}
            </div>
          </aside>
        </div>
      </div>

      <ImageModal
        src={modalImageSrc}
        alt="Full size image"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default LogDetailPage;
