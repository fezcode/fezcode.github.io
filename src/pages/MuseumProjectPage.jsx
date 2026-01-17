import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import Loading from '../components/Loading';
import Seo from '../components/Seo';
import MuseumNavbar from '../components/museum-showcase/MuseumNavbar';
import MuseumHero from '../components/museum-showcase/MuseumHero';
import MuseumSection from '../components/museum-showcase/MuseumSection';
import MuseumFooter from '../components/museum-showcase/MuseumFooter';

const MuseumProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: projectsLoading } = useProjects();
  const [projectMetadata, setProjectMetadata] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects.length > 0) {
      const found = projects.find((p) => p.slug === slug);
      if (found) {
        setProjectMetadata(found);
      }
    }
  }, [projects, slug]);

  useEffect(() => {
    const fetchSections = async () => {
      if (!slug) return;
      setLoading(true);

      const sectionFiles = ['overview', 'syntax', 'examples', 'features', 'technical', 'access'];
      try {
        const promises = sectionFiles.map(file =>
          fetch(`/projects/${slug}/${file}.txt`)
            .then(res => res.ok ? res.text().then(text => ({ id: file, text })) : null)
        );

        const results = await Promise.all(promises);
        const validSections = results
          .filter(res => res !== null && !res.text.includes('<!DOCTYPE html>'))
          .map(res => {
            const lines = res.text.split('\n');
            let label = res.id.charAt(0).toUpperCase() + res.id.slice(1);
            let subtext = 'Detailed Analysis';
            let image = '';
            let contentLines = [];

            lines.forEach(line => {
              if (line.startsWith('LABEL:')) {
                label = line.replace('LABEL:', '').trim();
              } else if (line.startsWith('SUBTEXT:')) {
                subtext = line.replace('SUBTEXT:', '').trim();
              } else if (line.startsWith('IMAGE:')) {
                image = line.replace('IMAGE:', '').trim();
              } else {
                contentLines.push(line);
              }
            });

            let content = contentLines.join('\n').trim();
            let type = 'markdown';
            let data = null;

            // Handle feature blocks
            if (res.id === 'features' && content.includes(':::feature')) {
              type = 'features';
              data = [];
              const regex = /:::feature([\s\S]*?):::/g;
              let match;
              while ((match = regex.exec(content)) !== null) {
                const blockContent = match[1].trim();
                const blockLines = blockContent.split('\n');
                const obj = {};
                blockLines.forEach(line => {
                  const sep = line.indexOf(':');
                  if (sep !== -1) {
                    const k = line.substring(0, sep).trim();
                    const v = line.substring(sep + 1).trim();
                    obj[k] = v;
                  }
                });
                data.push(obj);
              }
            }

            return {
              id: res.id,
              label,
              subtext,
              image,
              content,
              type,
              data
            };
          });

        if (validSections.length === 0) {
          const singleRes = await fetch(`/projects/${slug}.txt`);
          if (singleRes.ok) {
            const text = await singleRes.text();
            if (!text.includes('<!DOCTYPE html>')) {
              validSections.push({
                id: 'overview',
                label: 'Overview',
                subtext: 'Project Brief',
                image: projectMetadata?.image,
                content: text,
                type: 'markdown'
              });
            }
          }
        }

        setSections(validSections);
      } catch (error) {
        console.error("Error fetching museum project content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSections();
    }
  }, [slug, projectMetadata]);

  if (projectsLoading || loading || !projectMetadata) {
    return <Loading />;
  }

    return (
      <div className="bg-[#FDFAF5] min-h-screen selection:bg-[#1a1a1a] selection:text-white font-instr-sans relative overflow-x-hidden">
        {/* Museum Architecture Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Subtle Architectural Lines */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '15vw 15vw' }} />
          {/* Spotlighting Effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[150px] opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[200px] opacity-30" />
          {/* Paper Texture / Grain */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        </div>

        <Seo
          title={`${projectMetadata.title} | Museum Collection`}
          description={projectMetadata.shortDescription}
          image={projectMetadata.image}
          keywords={projectMetadata.technologies}
        />

        <MuseumNavbar />

        <div className="relative z-10">
          <MuseumHero
            title={projectMetadata.title}
            subtitle={projectMetadata.shortDescription}
            image={projectMetadata.image}
            date={projectMetadata.date}
            technologies={projectMetadata.technologies}
          />

          <main>
            {sections.map((section, idx) => (
              <React.Fragment key={section.id}>
                <MuseumSection
                  title={section.label}
                  subtext={`Exhibit ${idx + 1}`}
                  content={section.content}
                  reverse={idx % 2 !== 0}
                  isSpecial={section.id === 'syntax'}
                  type={section.type}
                  data={section.data}
                />
                {/* Secondary images are suppressed per request, keeping structural gallery spacing if needed or removing entirely */}
              </React.Fragment>
            ))}
          </main>

          <MuseumFooter project={projectMetadata} />

        </div>

      </div>

    );
};

export default MuseumProjectPage;
