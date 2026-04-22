import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import GenerativeArt from '../../components/GenerativeArt';
import Seo from '../../components/Seo';
import piml from 'piml';
import MarkdownLink from '../../components/MarkdownLink';
import colors from '../../config/colors';
import MarkdownContent from '../../components/MarkdownContent';
import CustomDropdown from '../../components/CustomDropdown';
import { useVisualSettings } from '../../context/VisualSettingsContext';

const TerracottaLogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { headerFont, setHeaderFont, bodyFont, setBodyFont, availableFonts } = useVisualSettings();
  const contentRef = useRef(null);

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
          try {
            const logContentResponse = await fetch(`/logs/${category}/${slugId}.txt`);
            if (logContentResponse.ok) {
              const logBody = await logContentResponse.text();
              setLog({ attributes: logMetadata, body: logBody });
            } else {
              setLog({ attributes: logMetadata, body: logMetadata.description || '' });
            }
          } catch (e) {
            setLog({ attributes: logMetadata, body: logMetadata.description || '' });
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
      <div className="flex min-h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-widest">
            Loading_Log
          </span>
        </div>
      </div>
    );
  }

  if (!log || !log.attributes.title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613] font-mono uppercase">
        404 // Log Not Found
      </div>
    );
  }

  const { attributes, body } = log;
  const accentColor = colors[category.toLowerCase()] || colors.primary[400];

  const MetadataRow = ({ label, value, icon: Icon }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col gap-1 py-4 border-b border-[#1A161320]">
        <span className="flex items-center gap-2 text-[10px] font-mono text-[#2E2620]/60 uppercase tracking-widest">
          {Icon && <Icon size={12} weight="bold" className="text-[#C96442]" />}
          {label}
        </span>
        <span className="text-sm text-[#1A1613]">{value}</span>
      </div>
    );
  };

  const renderStars = (rating) => {
    if (rating === undefined || rating === null) return null;
    return (
      <div className="flex flex-col gap-2 py-4 border-b border-[#1A161320]">
        <span className="text-[10px] font-mono text-[#2E2620]/60 uppercase tracking-widest flex items-center gap-2">
          <Star size={12} weight="bold" className="text-[#B88532]" />
          Rating
        </span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              weight="fill"
              className={i < rating ? 'text-[#B88532]' : 'text-[#1A161320]'}
            />
          ))}
          <span className="ml-2 font-mono text-xs text-[#2E2620]">({rating}/5)</span>
        </div>
      </div>
    );
  };

  const fontMap = {
    'font-sans': "'Space Mono', monospace",
    'font-mono': "'JetBrains Mono', monospace",
    'font-inter': "'Inter', sans-serif",
    'font-arvo': "'Arvo', serif",
    'font-fraunces': "'Playfair Display', serif",
    'font-syne': "'Syne', sans-serif",
    'font-outfit': "'Outfit', sans-serif",
    'font-ibm-plex-mono': "'IBM Plex Mono', monospace",
    'font-instr-serif': "'Instrument Serif', serif",
    'font-nunito': "'Nunito', sans-serif",
  };

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25">
      <Seo
        title={log ? `${log.attributes.title} | Fezcodex` : null}
        description={log ? log.body.substring(0, 150) : null}
        image={log?.attributes?.image}
      />
      <style>
        {`
          .custom-prose h1, .custom-prose h2, .custom-prose h3,
          .custom-prose h4, .custom-prose h5, .custom-prose h6 {
            font-family: ${fontMap[headerFont] || fontMap['font-fraunces']} !important;
          }
        `}
      </style>

      <section className="relative h-[60vh] md:h-[70vh] flex flex-col justify-end overflow-hidden border-b border-[#1A161320]">
        <div className="absolute inset-0 z-0">
          <GenerativeArt seed={attributes.title} className="w-full h-full opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3ECE0] via-[#F3ECE0]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pb-20">
          <Link
            to="/logs"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            <span>Archive</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border backdrop-blur-md"
              style={{
                color: accentColor,
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}18`,
              }}
            >
              {category}
            </span>
            {attributes.updated && (
              <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#9E4A2F] border border-[#9E4A2F]/40 bg-[#9E4A2F]/10">
                Updated
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-8xl font-fraunces italic tracking-tight leading-none mb-8 max-w-4xl text-[#1A1613]">
            {attributes.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[#2E2620] font-mono text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <CalendarBlank size={16} className="text-[#C96442]" />
              <span>Published: {attributes.date}</span>
            </div>
            {attributes.slug && (
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-[#C96442]" />
                <span>ID: {attributes.slug}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <main className="lg:col-span-8">
            <article
              ref={contentRef}
              className={`prose prose-xl max-w-none custom-prose ${bodyFont}
                         prose-headings:tracking-tight prose-headings:text-[#1A1613] prose-headings:italic
                         prose-p:text-[#2E2620] prose-p:leading-relaxed
                         prose-a:text-[#9E4A2F] prose-a:no-underline hover:prose-a:underline
                         prose-blockquote:border-l-4 prose-blockquote:border-[#C96442] prose-blockquote:bg-[#E8DECE]/40 prose-blockquote:py-1 prose-blockquote:px-6
                         prose-strong:text-[#1A1613] prose-code:text-[#9E4A2F] prose-code:bg-[#C96442]/10 prose-code:px-1`}
            >
              <MarkdownContent
                content={body}
                components={{
                  a: (props) => (
                    <MarkdownLink
                      {...props}
                      className="text-[#9E4A2F] hover:text-[#C96442] transition-colors underline decoration-[#C96442]/40 underline-offset-4"
                    />
                  ),
                }}
              />
            </article>

            {attributes.tags && attributes.tags.length > 0 && (
              <div className="mt-20 pt-12 border-t border-[#1A161320]">
                <div className="flex flex-wrap gap-2">
                  {attributes.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[#E8DECE]/50 border border-[#1A161320] text-[10px] font-mono text-[#2E2620]/70 uppercase tracking-widest hover:text-[#9E4A2F] hover:border-[#C96442]/40 hover:bg-[#C96442]/10 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div className="border border-[#1A161320] p-8 bg-[#E8DECE]/40 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C96442]/60 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-[#C96442]/70 transition-all duration-500" />
                <h3 className="font-mono text-[10px] font-bold text-[#9E4A2F] uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Tag weight="fill" />
                  Manifest Data
                </h3>
                <div className="flex flex-col">
                  <MetadataRow label="Category" value={attributes.category} icon={Tag} />
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
                  <MetadataRow label="Release Year" value={attributes.year} icon={Clock} />
                  <MetadataRow label="Last Updated" value={attributes.updated} icon={CalendarBlank} />
                  {renderStars(attributes.rating)}
                </div>
                {attributes.link && (
                  <a
                    href={attributes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-start gap-3 group/link border border-[#C96442]/40 hover:border-[#C96442] p-4 transition-all"
                  >
                    <span className="text-xs font-mono uppercase tracking-widest text-[#9E4A2F] group-hover/link:text-[#C96442] transition-colors">
                      Access External Source
                    </span>
                    <ArrowUpRight
                      className="text-[#9E4A2F] transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                      size={20}
                    />
                  </a>
                )}
              </div>

              <div className="border border-[#1A161320] p-8 bg-[#E8DECE]/40 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#B88532]/50 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-[#B88532]/60 transition-all duration-500" />
                <h3 className="font-mono text-[10px] font-bold text-[#B88532] uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Tag weight="fill" />
                  Typography Lab
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-[#2E2620]/60 uppercase tracking-widest block ml-1">
                      Header Font
                    </span>
                    <CustomDropdown
                      label="Select Font"
                      options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                      value={headerFont}
                      onChange={setHeaderFont}
                      variant="terracotta"
                      fullWidth={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-[#2E2620]/60 uppercase tracking-widest block ml-1">
                      Body Font
                    </span>
                    <CustomDropdown
                      label="Select Font"
                      options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                      value={bodyFont}
                      onChange={setBodyFont}
                      variant="terracotta"
                      fullWidth={true}
                    />
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1A161320] text-[9px] font-mono text-[#2E2620]/50 uppercase tracking-widest flex justify-between">
                  <span>You can also change them in Settings page</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TerracottaLogDetailPage;
