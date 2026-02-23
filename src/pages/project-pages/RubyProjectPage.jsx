import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import Loading from '../../components/Loading';
import MarkdownContent from '../../components/MarkdownContent';
import {
  GithubLogoIcon,
  CaretRightIcon,
  CpuIcon,
  CopyIcon,
  CheckIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';

const RubyProjectPage = () => {
  const { slug } = useParams();
  const productSlug = slug || 'gobake';

  const [content, setContent] = useState({
    hero: '',
    features: '',
    details: '',
    cta: '',
    terminal: '',
    guide: '',
    examples: ''
  });
  const [metadata, setMetadata] = useState({
    title: '',
    tagline: '',
    repo_link: '',
    shortDescription: '',
    image: '',
    technologies: [],
    version: '0.1.0'
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroRes, featuresRes, detailsRes, ctaRes, terminalRes, guideRes, examplesRes] = await Promise.all([
          fetch(`/projects/${productSlug}/hero.txt`),
          fetch(`/projects/${productSlug}/features.txt`),
          fetch(`/projects/${productSlug}/details.txt`),
          fetch(`/projects/${productSlug}/cta.txt`),
          fetch(`/projects/${productSlug}/terminal.txt`),
          fetch(`/projects/${productSlug}/guide.txt`),
          fetch(`/projects/${productSlug}/examples.txt`),
        ]);

        const [hero, features, details, cta, terminal, guide, examples] = await Promise.all([
          heroRes.text(),
          featuresRes.text(),
          detailsRes.text(),
          ctaRes.text(),
          terminalRes.text(),
          guideRes.text(),
          examplesRes.text(),
        ]);

        setContent({ hero, features, details, cta, terminal, guide, examples });

        // Parse metadata from files
        const heroLines = hero.split('\n');
        const title = heroLines[0]?.replace('#', '').trim() || productSlug;
        const tagline = heroLines[1]?.trim() || '';

        // Extract version from hero.txt if available (PIML style)
        const versionMatch = hero.match(/\(version\)\s*([^\n\r]+)/);
        const version = versionMatch ? versionMatch[1].trim() : '0.1.0';

        // Extract repo link from terminal.txt if available
        const repoMatch = terminal.match(/btnLink:\s*(https:\/\/github\.com\/[^\s\n]+)/);
        const repo_link = repoMatch ? repoMatch[1] : '';

        setMetadata({
          title,
          tagline,
          repo_link,
          shortDescription: tagline,
          image: `/images/projects/${productSlug}/${productSlug}-banner.png`,
          technologies: ['Go', 'Build Tool'],
          version
        });
      } catch (error) {
        console.error('Error fetching project content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [productSlug]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loading />;

  const parseBlocks = (text, blockType) => {
    const blocks = [];
    if (!text || text.includes('<!DOCTYPE html>')) return blocks;
    const regex = new RegExp(`:::${blockType}([\\s\\S]*?):::`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const blockContent = match[1].trim();
      const lines = blockContent.split('\n');
      const obj = {};
      lines.forEach((line) => {
        const sep = line.indexOf(':');
        if (sep !== -1) {
          obj[line.substring(0, sep).trim()] = line.substring(sep + 1).trim();
        }
      });
      blocks.push(obj);
    }
    return blocks;
  };

  const features = parseBlocks(content.features, 'feature');
  const cards = parseBlocks(content.terminal, 'card');
  const installBlock = cards.find((c) => c.type === 'install');
  const installCommand = installBlock ? installBlock.code : '';

  const renderHighlightedCode = (code, type) => {
    if (type === 'install') {
      return (
        <code className="text-[#c9d1d9] block leading-relaxed whitespace-pre-wrap">
          <span className="text-[#8b949e] italic"># Installation</span><br/>
          <span className="text-[#ff7b72] font-black">go</span> install {code.split('install ')[1]}
        </code>
      );
    }
    if (type === 'code') {
      return (
        <code className="text-[#c9d1d9] block leading-relaxed whitespace-pre-wrap">
          <span className="text-[#ff7b72] font-black">{metadata.title.toLowerCase()}</span>.<span className="text-[#d2a8ff]">Task</span>(<span className="text-[#a5d6ff]">"build"</span>, <span className="text-[#c084fc]">func</span>(ctx) {'{'}<br/>
          &nbsp;&nbsp;<span className="text-[#c084fc]">return</span> ctx.<span className="text-[#fbbf24]">Bake</span>(<span className="text-[#a5d6ff]">"bin/app"</span>)<br/>
          {'}'})
        </code>
      );
    }
    return (
      <code className="text-[#c9d1d9] block leading-relaxed whitespace-pre-wrap">
        <span className="text-[#eb544f] font-black">$</span> {code}
      </code>
    );
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-[#fafaf9] font-outfit selection:bg-[#eb544f]/30 selection:text-[#eb544f] dark:selection:text-white overflow-x-hidden scroll-smooth">
      <Seo
        title={`${metadata.title} | Fezcodex`}
        description={metadata.shortDescription}
        image={metadata.image}
        keywords={metadata.technologies}
      />

      <header className="fixed top-0 left-0 right-0 w-full bg-[#1c1917] border-b border-stone-700 z-50 h-20">
        <div className="container mx-auto h-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <Link to="/projects" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-50 tracking-tighter uppercase font-outfit">
                {metadata.title}
              </span>
            </Link>

            <nav className="hidden lg:flex items-stretch gap-1 h-20 font-bold text-sm">
              <a href="#installation" className="flex items-center px-3 xl:px-5 h-full text-stone-300 hover:text-[#eb544f] hover:bg-stone-800 transition-colors uppercase tracking-widest">
                Download
              </a>
              <a href="#docs" className="flex items-center px-3 xl:px-5 h-full text-stone-300 hover:text-[#eb544f] hover:bg-stone-800 transition-colors uppercase tracking-widest">
                Documentation
              </a>
              {metadata.repo_link && (
                <a href={metadata.repo_link} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 xl:px-5 h-full text-stone-300 hover:bg-stone-800 transition-colors">
                  <GithubLogoIcon size={24} weight="bold" />
                </a>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div id="page" className="pt-20">

        {/* Hero Section: bg-stone-770 (#292524) */}
        <div className="bg-[#292524] relative overflow-hidden isolate">
          <section className="relative overflow-hidden h-[496px] md:h-[620px] flex flex-col items-center justify-center text-center">
             <div className="flex flex-col items-center z-10">
                <div className="h-[7.5rem] md:h-[9.375rem] flex items-center justify-center mb-10 px-4">
                   <p className="text-lg md:text-2xl font-extrabold text-stone-100 tracking-[0.2em] uppercase">
                     <span className="inline-block px-4 py-1 bg-[#292524]">{metadata.tagline}</span>
                   </p>
                </div>

                <div className="flex flex-col items-center">
                   <p className="text-base md:text-lg text-[#E2D1AA] tracking-[0.2em] drop-shadow-sm whitespace-nowrap mb-2 md:mb-3 font-semibold uppercase">
                     From Fezcode
                   </p>

                   <div className="relative -mt-4 md:-mt-6 mb-4 md:mb-6 px-4">
                      <div className="text-[96px] md:text-[120px] leading-none font-extrabold text-white tracking-tighter drop-shadow-2xl uppercase font-outfit">
                        {metadata.title}
                      </div>
                   </div>

                   <div className="text-center mb-8">
                      <p className="text-base md:text-xl tracking-wide text-[#E2D1AA] whitespace-nowrap uppercase">
                        <span className="font-light text-white/70 tracking-normal">Latest Version:</span>{' '}
                        <span className="font-extrabold text-white relative inline-block">
                          {metadata.version}
                          <img src={`/projects/${productSlug}/version-line.svg`} alt="" className="absolute -bottom-[4px] md:-bottom-[6px] left-0 w-full h-auto opacity-50" />
                        </span>
                      </p>
                   </div>

                   <a href="#installation" className="mt-4 md:mt-6 inline-block bg-white text-[#e62923] text-sm md:text-base px-24 py-4 rounded-full font-extrabold hover:bg-stone-100 hover:scale-105 transition-all uppercase tracking-widest shadow-md">
                     Download
                   </a>
                </div>
             </div>

             <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1470px] h-[620px] bg-[radial-gradient(circle,rgba(235,84,79,0.3)_0%,transparent_70%)]"></div>
             </div>
          </section>

          <section id="try-ruby-section" className="pb-24 relative transition-all duration-700 ease-out opacity-100 px-4 lg:px-8">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 2xl:gap-16 max-w-7xl mx-auto">

                {cards.map((card, i) => (
                  <div key={i} className="bg-[#1c1917] rounded-2xl overflow-hidden flex flex-col shadow-sm border border-[#CEB372] hover:border-[#eb544f] transition-colors box-border">
                    <div className="px-8 py-8 font-mono text-sm overflow-x-auto h-[240px] bg-[#1c1917]">
                       {renderHighlightedCode(card.code, card.type)}
                    </div>
                    <div className="px-6 py-5 flex justify-center bg-[#1c1917]">
                       {card.type === 'install' ? (
                         <button
                           onClick={() => copyToClipboard(card.code)}
                           className="bg-[#CEB372] text-stone-900 hover:bg-[#eb544f] hover:text-white px-8 py-2.5 rounded-full font-black tracking-widest text-lg transition-all shadow-sm transform hover:scale-105 uppercase leading-none flex items-center gap-2"
                         >
                           {copied ? <CheckIcon weight="bold" /> : <CopyIcon weight="bold" />}
                           {copied ? 'COPIED!' : card.btnText}
                         </button>
                       ) : (
                         <a
                           href={card.btnLink}
                           target={card.btnLink.startsWith('http') ? '_blank' : '_self'}
                           rel={card.btnLink.startsWith('http') ? 'noopener noreferrer' : ''}
                           className="bg-[#CEB372] text-stone-900 hover:bg-[#eb544f] hover:text-white px-8 py-2.5 rounded-full font-black tracking-widest text-lg transition-all shadow-sm transform hover:scale-105 uppercase leading-none"
                         >
                           {card.btnText}
                         </a>
                       )}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </section>

          <div className="absolute -bottom-1 left-0 right-0 h-6 md:h-8 text-[#1c1917]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,10 C20,0 40,20 60,10 C80,0 100,20 120,10 C140,0 160,20 180,10 C200,0 220,20 240,10 C260,0 280,20 300,10 C320,0 340,20 360,10 C380,0 400,20 400,10 L400,20 L0,20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <section id="features" className="bg-[#1c1917] py-16 md:py-20 lg:pt-24 lg:pb-24 border-b border-stone-800">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 uppercase tracking-tighter font-outfit">
                Why {metadata.title.toUpperCase()}?
              </h2>
              <p className="text-sm md:text-lg text-stone-300 uppercase tracking-[0.2em] font-black italic">
                A Programmer's Best Friend
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-24 max-w-6xl mx-auto">
              {features.map((feature, idx) => (
                <div key={idx} className="why-ruby-card relative self-start group">
                   <div className="relative mb-8">
                      <h3 className="text-5xl sm:text-6xl md:text-7xl font-light text-[#CEB372] tracking-tighter uppercase leading-none font-outfit">
                        {feature.title}
                      </h3>
                      <img src={`/projects/${productSlug}/line.svg`} alt="" className="absolute left-0 -bottom-[22px] w-full max-w-[430px] h-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <p className="text-xl sm:text-2xl font-bold text-white mb-4 leading-relaxed uppercase tracking-tight">
                     {feature.subtitle}
                   </p>
                   <div className="text-sm sm:text-base text-stone-300 mb-6 leading-relaxed font-medium">
                     {feature.description}
                   </div>

                   <div className="flex flex-col-reverse md:flex-row gap-6 items-start mt-10">
                      <div className="flex-1 relative text-sm sm:text-base font-medium text-stone-300 leading-relaxed border border-[#CEB372] p-6 md:p-8 rounded-3xl bg-stone-800/20 shadow-sm">
                         <span className="absolute -top-10 -left-4 text-[140px] text-[#CEB372] opacity-20 font-serif leading-none select-none pointer-events-none">“</span>
                         <p className="relative z-10 italic">
                           {feature.quote}
                         </p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-center text-center w-32">
                         <div className="w-24 h-24 bg-stone-900 rounded-full border-4 border-[#CEB372] mb-3 flex items-center justify-center overflow-hidden shadow-xl">
                            <CpuIcon size={40} className="text-[#CEB372]" weight="fill" />
                         </div>
                         <p className="text-[11px] font-black uppercase text-white leading-tight">{feature.creator}</p>
                         <p className="text-[9px] font-bold text-[#CEB372] uppercase tracking-wider">{feature.role}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Section (Pure Dark Aesthetic) */}
        <section id="docs" className="bg-[#1c1917] py-24 md:py-32 border-t border-stone-800">
           <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
              <div className="text-center mb-24">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter font-outfit">
                    DOCUMENTATION
                 </h2>
                 <div className="h-1 w-32 bg-[#eb544f] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
                 <div className="lg:col-span-3 space-y-24">
                    <div id="quick-start" className="prose prose-invert prose-2xl max-w-none
                      prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                      prose-h1:text-5xl prose-h1:mb-12
                      prose-h2:border-b-4 prose-h2:border-[#eb544f] prose-h2:pb-6 prose-h2:mb-16
                      prose-a:text-[#eb544f] prose-a:font-black prose-a:no-underline hover:prose-a:no-underline
                      prose-pre:bg-[#292524] prose-pre:border prose-pre:border-stone-800 prose-pre:shadow-2xl prose-pre:rounded-[2rem]
                      prose-code:text-[#CEB372] prose-code:font-bold
                      prose-p:text-stone-300 prose-p:leading-relaxed">
                      <MarkdownContent content={content.guide} className="no-underline-hover" />
                    </div>

                    <div id="examples" className="prose prose-invert prose-2xl max-w-none
                      prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                      prose-h1:text-5xl prose-h1:mb-12
                      prose-h2:border-b-4 prose-h2:border-[#CEB372] prose-h2:pb-6 prose-h2:mb-16
                      prose-a:text-[#eb544f] prose-a:font-black prose-a:no-underline hover:prose-a:no-underline
                      prose-pre:bg-[#292524] prose-pre:border prose-pre:border-stone-800 prose-pre:shadow-2xl prose-pre:rounded-[2rem]
                      prose-code:text-[#CEB372] prose-code:font-bold
                      prose-p:text-stone-300 prose-p:leading-relaxed">
                      <MarkdownContent content={content.examples} className="no-underline-hover" />
                    </div>
                 </div>

                 <div className="lg:col-span-1 space-y-12">
                    <div className="sticky top-32">
                       <div className="bg-[#292524] p-8 rounded-3xl border border-stone-800 shadow-2xl">
                          <h4 className="font-black text-xs uppercase tracking-[0.2em] text-stone-500 mb-8 italic">GUIDE NAV</h4>
                          <ul className="space-y-6 font-black text-white text-base uppercase tracking-tighter">
                             <li>
                               <a href="#quick-start" className="flex items-center gap-3 hover:text-[#eb544f] transition-all group">
                                 <CaretRightIcon className="group-hover:translate-x-1 transition-transform" weight="bold" />
                                 QUICK START
                               </a>
                             </li>
                             <li>
                               <a href="#examples" className="flex items-center gap-3 hover:text-[#eb544f] transition-all group">
                                 <CaretRightIcon className="group-hover:translate-x-1 transition-transform" weight="bold" />
                                 EXAMPLES
                               </a>
                             </li>
                             <li>
                               <a href="#installation" className="flex items-center gap-3 hover:text-[#eb544f] transition-all group">
                                 <CaretRightIcon className="group-hover:translate-x-1 transition-transform" weight="bold" />
                                 INSTALLATION
                               </a>
                             </li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Installation Section */}
        {installCommand && (
          <section id="installation" className="py-32 bg-[#292524] border-t border-stone-800 text-center">
             <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter font-outfit">
                  READY TO {metadata.title.toUpperCase()}?
                </h2>
                <div className="bg-[#1c1917] p-8 rounded-2xl shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-8 group border border-stone-700 hover:border-[#eb544f]/50 transition-all duration-500 w-full max-w-5xl mx-auto">
                   <div className="flex items-center gap-6 text-left">
                      <span className="text-[#CEB372] font-black text-2xl shrink-0">$</span>
                      <code className="text-[#CEB372] font-mono text-xl md:text-xl break-all font-bold uppercase-none">{installCommand}</code>
                   </div>
                   <button
                      onClick={() => copyToClipboard(installCommand)}
                      className="bg-white text-stone-900 hover:bg-[#eb544f] hover:text-white p-4 rounded-xl transition-all duration-300 flex items-center gap-3 font-black shadow-xl shrink-0 uppercase tracking-widest text-sm"
                   >
                      {copied ? <CheckIcon size={24} weight="bold" /> : <CopyIcon size={24} weight="bold" />}
                      {copied ? 'COPIED!' : 'COPY'}
                   </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-12 text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] italic">
                   <div className="flex items-center gap-3 hover:text-[#eb544f] transition-colors cursor-default"><ShieldCheckIcon size={20} /> MIT LICENSE</div>
                   <div className="flex items-center gap-3 hover:text-[#eb544f] transition-colors cursor-default"><CpuIcon size={20} /> GO-NATIVE</div>
                </div>
             </div>
          </section>
        )}

      </div>

      <footer className="bg-[#1c1917] pt-2 pb-16 relative border-t-8 border-[#eb544f] mt-20">
        <div className="absolute -top-[31px] left-0 right-0 h-8 text-[#1c1917]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,10 C20,0 40,20 60,10 C80,0 100,20 120,10 C140,0 160,20 180,10 C200,0 220,20 240,10 C260,0 280,20 300,10 C320,0 340,20 360,10 C380,0 400,20 400,10 L400,20 L0,20 Z" fill="currentColor"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 pt-24 max-w-7xl">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 text-center lg:text-left">
              <div>
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-2 font-outfit leading-none">
                   {metadata.title}
                 </h2>
                 <p className="text-2xl font-bold text-[#CEB372] italic uppercase tracking-widest ml-1">Happy Hacking!</p>
              </div>

              <nav className="flex flex-wrap justify-center lg:justify-start items-center gap-x-10 gap-y-4 text-sm font-black uppercase tracking-widest text-stone-300">
                 <a href="#installation" className="hover:text-[#eb544f] transition-colors border-r border-stone-700 pr-10">Download</a>
                 <a href="#docs" className="hover:text-[#eb544f] transition-colors border-r border-stone-700 pr-10">Documentation</a>
                 {metadata.repo_link && (
                   <a href={metadata.repo_link} target="_blank" rel="noopener noreferrer" className="hover:text-[#eb544f] transition-colors border-stone-700 pl-10">GitHub</a>
                 )}
              </nav>
           </div>

           <div className="pt-12 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-stone-600">
              <div className="flex gap-10">
                 <span className="text-[#CEB372] border-b border-[#CEB372] pb-1">THEME: DARK</span>
                 <span>GO-NATIVE</span>
              </div>
              <div className="text-center md:text-right">
                &copy; {new Date().getFullYear()} Fezcode. All rights reserved.
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default RubyProjectPage;
