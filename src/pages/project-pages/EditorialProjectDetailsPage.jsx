import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EditorialNavbar from '../../components/editorial-project/EditorialNavbar';
import EditorialHero from '../../components/editorial-project/EditorialHero';
import EditorialTerminal from '../../components/editorial-project/EditorialTerminal';
import EditorialInstall from '../../components/editorial-project/EditorialInstall';
import EditorialSocial from '../../components/editorial-project/EditorialSocial';
import EditorialFooter from '../../components/editorial-project/EditorialFooter';
import EditorialDescription from '../../components/editorial-project/EditorialDescription';
import EditorialGridBackground from '../../components/editorial-project/EditorialGridBackground';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import Loading from '../../components/Loading';

const EditorialProjectDetailsPage = () => {
  const { slug } = useParams();
  const { projects } = useProjects();
  const projectMetadata = projects.find((p) => p.slug === slug);

  const [content, setContent] = useState({
    hero: '',
    features: '',
    terminal: '',
    install: '',
    social: '',
    description: '',
    footer: '',
    platforms: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const productSlug = slug || 'fezcodex';

        const files = [
          'hero',
          'features',
          'terminal',
          'install',
          'social',
          'description',
          'footer',
          'platforms',
        ];
        const promises = files.map((file) =>
          fetch(`/projects/${productSlug}/${file}.txt`).then((res) =>
            res.ok ? res.text() : '',
          ),
        );

        const results = await Promise.all(promises);

        const newContent = files.reduce((acc, file, index) => {
          acc[file] = results[index];
          return acc;
        }, {});

        // Fallback for description if empty
        if (!newContent.description && projectMetadata?.shortDescription) {
          newContent.description = `## Overview\n${projectMetadata.shortDescription}`;
        }

        setContent(newContent);
      } catch (error) {
        console.error('Error fetching editorial project content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug, projectMetadata]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-[#e8e8e8] font-nunito selection:bg-[#ffffff20] selection:text-white overflow-x-hidden relative">
      <Seo
        title={`${projectMetadata?.title || slug} | Fezcodex`}
        description={projectMetadata?.shortDescription}
        image={projectMetadata?.image}
        keywords={projectMetadata?.technologies}
      />

      <EditorialGridBackground image={projectMetadata?.backgroundImage} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <EditorialNavbar
          title={projectMetadata?.title || 'Project'}
          repoLink={projectMetadata?.repo_link}
        />

        <main className="flex-1 flex flex-col">
          <EditorialHero
            content={content.hero}
            repoLink={projectMetadata?.repo_link}
            title={projectMetadata?.title}
          />
          <EditorialTerminal content={content.terminal} />
          <EditorialDescription content={content.description} />
          <EditorialInstall
            content={content.install}
            platforms={content.platforms}
          />
          <EditorialSocial content={content.social} />
        </main>

        <EditorialFooter
          content={content.footer}
          photoCredit={{
            text: projectMetadata?.photoCreditText,
            link: projectMetadata?.photoCreditLink,
          }}
        />
      </div>
    </div>
  );
};

export default EditorialProjectDetailsPage;
