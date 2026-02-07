import React from 'react';
import ReactMarkdown from 'react-markdown';

const EditorialHero = ({ content, repoLink, title: projectTitle }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const titleLines = [];
  let descriptionStartIndex = 0;

  // Collect all lines starting with # as title
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#')) {
      titleLines.push(line.replace('#', '').trim());
      descriptionStartIndex = i + 1;
    } else if (line.startsWith('image:')) {
      // image handled by background grid, just skip
      descriptionStartIndex = i + 1;
    } else if (line === '') {
      // skip empty lines between title/image and description
      if (descriptionStartIndex === i) descriptionStartIndex++;
    } else {
      // Found start of description
      break;
    }
  }

  const heroTitle = titleLines.join('\n\n');
  const description = lines.slice(descriptionStartIndex).join('\n');

  return (
    <section className="relative pt-20 pb-32 border-b border-white/10 overflow-hidden">
      <div className="max-w-[2400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Title Section */}
        <div className="md:col-span-2 md:col-start-2 border-l border-white/10 pl-8">
          {projectTitle && (
            <div className="mb-6">
              <span className="font-instr-serif text-xl text-white uppercase tracking-[0.1em] px-4 py-2 border border-white/20 inline-block">
                {projectTitle}
              </span>
            </div>
          )}
          <h1 className="text-6xl md:text-8xl font-instr-serif leading-[0.9] tracking-tight text-white mb-8">
            <ReactMarkdown
              components={{
                p: ({ children }) => <div className="mb-0">{children}</div>,
                em: ({ children }) => (
                  <span className="italic font-light">{children}</span>
                ),
              }}
            >
              {heroTitle}
            </ReactMarkdown>
          </h1>
        </div>

        {/* Description Section */}
        <div className="md:col-span-2 md:col-start-2 md:pl-8 border-l border-white/10 flex flex-col gap-6">
          <div className="text-xl md:text-2xl text-[#e0e0e0] font-nunito font-light leading-relaxed max-w-2xl">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="#install"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded text-lg font-medium hover:bg-white/90 transition-colors"
            >
              Get Started <span>→</span>
            </a>
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded text-lg font-medium hover:bg-white/5 transition-colors"
              >
                View Source
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialHero;
