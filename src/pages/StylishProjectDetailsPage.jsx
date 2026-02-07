import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ProductNavbar from '../components/stylish-project/ProductNavbar';
import TypewriterHeader from '../components/stylish-project/TypewriterHeader';
import FeatureCard from '../components/stylish-project/FeatureCard';
import ProjectUrlLine from '../components/stylish-project/ProjectUrlLine';
import PartnerLogos from '../components/stylish-project/PartnerLogos';
import TerminalTabs from '../components/stylish-project/TerminalTabs';
import { useProjects } from '../utils/projectParser';
import Seo from '../components/Seo';
import Loading from '../components/Loading';

const StylishProjectDetailsPage = () => {
  const { slug } = useParams();
  const { projects } = useProjects();
  const projectMetadata = projects.find((p) => p.slug === slug);
  const [content, setContent] = useState({
    hero: '',
    features: '',
    partners: '',
    terminal: '',
    details: '',
    technical: '',
    integrations: '',
    cta: '',
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const productSlug = slug || 'fezcodex';
        const [
          heroRes,
          featuresRes,
          partnersRes,
          terminalRes,
          detailsRes,
          technicalRes,
          integrationsRes,
          ctaRes,
        ] = await Promise.all([
          fetch(`/projects/${productSlug}/hero.txt`),
          fetch(`/projects/${productSlug}/features.txt`),
          fetch(`/projects/${productSlug}/partners.txt`),
          fetch(`/projects/${productSlug}/terminal.txt`),
          fetch(`/projects/${productSlug}/details.txt`),
          fetch(`/projects/${productSlug}/technical.txt`),
          fetch(`/projects/${productSlug}/integrations.txt`),
          fetch(`/projects/${productSlug}/cta.txt`),
        ]);
        const [
          hero,
          features,
          partners,
          terminal,
          details,
          technical,
          integrations,
          cta,
        ] = await Promise.all([
          heroRes.text(),
          featuresRes.text(),
          partnersRes.text(),
          terminalRes.text(),
          detailsRes.text(),
          technicalRes.text(),
          integrationsRes.text(),
          ctaRes.text(),
        ]);
        setContent({
          hero,
          features,
          partners,
          terminal,
          details,
          technical,
          integrations,
          cta,
        });
      } catch (error) {
        console.error('Error fetching product content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug, projects]);

  if (loading) return <Loading />;
  // Robust parser for the :::block blocks

  const parseBlocks = (text, blockType) => {
    const blocks = [];
    if (!text || text.includes('<!DOCTYPE html>')) return blocks;
    const regex = new RegExp(`:::${blockType}([\\s\\S]*?):::`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const content = match[1].trim();
      const lines = content.split('\n');
      const obj = { _raw: content };
      lines.forEach((line) => {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex !== -1) {
          const key = line.substring(0, separatorIndex).trim();
          const value = line.substring(separatorIndex + 1).trim();
          obj[key] = value;
        }
      });
      blocks.push(obj);
    }
    return blocks;
  };
  const parseFeatures = (text) => parseBlocks(text, 'feature');
  const parseIntegrations = (text) => parseBlocks(text, 'integration');
  const parseTabs = (text) => parseBlocks(text, 'tab');
  const parseTech = (text) => parseBlocks(text, 'tech');
  const heroLines = content.hero.split('\n');
  const heroTitle = heroLines[0].replace('#', '').trim();
  const heroWords = heroLines[1].split(',').map((w) => w.trim());
  let heroImage = '';
  let heroDescription = '';
  const imageLineIndex = heroLines.findIndex((line) =>
    line.startsWith('image:'),
  );
  if (imageLineIndex !== -1) {
    heroImage = heroLines[imageLineIndex].replace('image:', '').trim();
    heroDescription = heroLines.slice(imageLineIndex + 1).join('\n');
  } else {
    heroDescription = heroLines.slice(2).join('\n');
  }
  const features = parseFeatures(content.features);
  const integrations = parseIntegrations(content.integrations);
  const techItems = parseTech(content.technical);
  const partnersLines =
    content.partners && !content.partners.includes('<!DOCTYPE html>')
      ? content.partners.split('\n')
      : [];
  let partnersLabel = 'Trusted by industry leaders';
  let partners = [];
  if (partnersLines.length > 0) {
    const labelLine = partnersLines.find((l) => l.startsWith('label:'));
    if (labelLine) partnersLabel = labelLine.replace('label:', '').trim();
    const logosLine = partnersLines.find((l) => l.startsWith('logos:'));
    if (logosLine) {
      partners = logosLine
        .replace('logos:', '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      partners = partnersLines
        .filter((l) => !l.startsWith('label:'))
        .join(',')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    }
  }
  const tabs = parseTabs(content.terminal);
  return (
    <div className="min-h-screen bg-product-bg text-product-body-text font-nunito selection:bg-product-card-icon/30 selection:text-white">
      <Seo
        title={`${projectMetadata?.title || slug} | Fezcodex`}
        description={projectMetadata?.shortDescription}
        image={projectMetadata?.image}
        keywords={projectMetadata?.technologies}
      />
      <ProductNavbar
        productName={projectMetadata?.title || slug}
        demoLink={projectMetadata?.demo_link}
      />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Hero Section */}
        <section className="pt-20 pb-8">
          <TypewriterHeader prefix={heroTitle} words={heroWords} />
          {heroImage && (
            <div className="max-w-5xl mx-auto my-12 rounded-2xl overflow-hidden border border-white/10 hover:border-product-card-icon transition-all duration-500 shadow-2xl relative group">
              <img
                src={heroImage}
                alt="Product Preview"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-product-bg via-transparent to-transparent opacity-60"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_40px_rgba(217,119,87,0.1)]"></div>
            </div>
          )}
          <div className="max-w-3xl mx-auto text-center mt-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => (
                  <p className="text-xl md:text-2xl text-product-body-text leading-relaxed font-nunito">
                    {children}
                  </p>
                ),
              }}
            >
              {heroDescription}
            </ReactMarkdown>
          </div>
        </section>
        {/* Partners Section */}
        {partners.length > 0 && (
          <section className="mb-12">
            <PartnerLogos logos={partners} label={partnersLabel} />
          </section>
        )}
        {/* Terminal Tabs Section */}
        {tabs.length > 0 && (
          <section className="py-4">
            <TerminalTabs tabs={tabs} />
          </section>
        )}
        {/* Integrations Section */}
        {integrations.length > 0 && (
          <section id="integrations" className="py-24 border-t border-white/5">
            <h2 className="text-4xl md:text-6xl font-instr-serif text-white italic mb-16 text-center">
              {content.integrations.split('\n')[0].replace('#', '').trim()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {integrations.map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-6 group">
                  <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-product-card-icon transition-all duration-500 shadow-2xl relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto aspect-video object-cover"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_40px_rgba(217,119,87,0.1)]"></div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-instr-serif text-white italic">
                      {item.title}
                    </h3>
                    <p className="text-base text-product-body-text leading-relaxed">
                      {item.description}
                    </p>
                    {item.link && (
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-2 bg-product-card-bg hover:bg-white/5 border border-white/10 text-product-card-icon font-black px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95"
                      >
                        Explore <span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Features Grid */}
        {features.length > 0 && (
          <section id="features" className="py-24 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  iconName={feature.icon}
                />
              ))}
            </div>
          </section>
        )}
        {/* Technical Section */}
        {techItems.length > 0 && (
          <section id="technical" className="py-24 border-t border-white/5">
            <h2 className="text-4xl md:text-6xl font-instr-serif text-white italic mb-16 text-center">
              Technical Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {techItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] p-8 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all hover:border-product-card-icon/20 group"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-product-body-text leading-relaxed font-nunito">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <span className="text-white block mb-2 text-lg font-instr-serif italic">
                          {children}
                        </span>
                      ),
                    }}
                  >
                    {item._raw}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Details Section */}
        {content.details && !content.details.includes('<!DOCTYPE html>') && (
          <section id="details" className="py-24 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl md:text-5xl font-instr-serif text-white italic mb-6 mt-12 first:mt-0">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => {
                    if (
                      typeof children === 'string' &&
                      children.startsWith('image:')
                    ) {
                      const src = children.replace('image:', '').trim();
                      return (
                        <div className="my-12 rounded-xl overflow-hidden border border-white/10 hover:border-product-card-icon hover:shadow-[0_0_30px_rgba(217,119,87,0.15)] transition-all duration-500 shadow-xl">
                          <img
                            src={src}
                            alt="Detail Preview"
                            className="w-full h-auto"
                          />
                        </div>
                      );
                    }
                    return (
                      <p className="text-lg text-product-body-text leading-relaxed mb-6">
                        {children}
                      </p>
                    );
                  },
                  a: ({ href, children }) => {
                    const isInternal = href.startsWith('/');
                    if (isInternal) {
                      return (
                        <Link
                          to={href}
                          className="inline-block bg-white/5 border border-white/10 px-6 py-3 rounded-lg text-white font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                          {children}
                        </Link>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white/5 border border-white/10 px-6 py-3 rounded-lg text-white font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content.details}
              </ReactMarkdown>
            </div>
          </section>
        )}
        {/* CTA Section */}
        {content.cta && !content.cta.includes('<!DOCTYPE html>') && (
          <section
            id="cta"
            className="py-24 border-t border-white/5 text-center"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-4xl md:text-6xl font-instr-serif text-white italic mb-8">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-lg text-product-body-text mb-8">
                    {children}
                  </p>
                ),
                code: ({ children, inline }) => {
                  if (inline)
                    return (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-product-card-icon">
                        {children}
                      </code>
                    );
                  return <ProjectUrlLine command={String(children).trim()} />;
                },
              }}
            >
              {content.cta}
            </ReactMarkdown>
          </section>
        )}
      </main>
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-lg font-instr-serif text-product-body-text/50">
        &copy; {new Date().getFullYear()} Handcrafted by Fezcode &nbsp; &middot;
        &nbsp; Built with love and code.
      </footer>
    </div>
  );
};
export default StylishProjectDetailsPage;
