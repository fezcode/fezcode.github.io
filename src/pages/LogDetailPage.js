import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import LogMetadata from '../components/metadata-cards/LogMetadata';
import { ArrowLeftIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import ImageModal from '../components/ImageModal';

import Seo from '../components/Seo';
import remarkGfm from 'remark-gfm';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="text-primary-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children} {isExternal && <ArrowSquareOutIcon className="text-xs" />}
    </a>
  );
};

const LogDetailPage = () => {
  const { slug } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const [logContentResponse, logsResponse] = await Promise.all([
          fetch(`/logs/${slug}.txt`),
          fetch('/logs/logs.json'),
        ]);

        let logBody = '';
        if (logContentResponse.ok) {
          logBody = await logContentResponse.text();
        } else {
          // Handle case where log content is not found
        }

        let logMetadata = null;
        if (logsResponse.ok) {
          const data = await logsResponse.json();
          logMetadata = data.find((item) => item.slug === slug);
        } else {
          console.error('Failed to fetch logs.json');
        }

        if (logMetadata && logContentResponse.ok) {
          setLog({ attributes: logMetadata, body: logBody });
        } else {
          setLog({ attributes: { title: 'Log not found' }, body: '' });
        }
      } catch (error) {
        console.error('Error fetching log or logs.json:', error);
        setLog({ attributes: { title: 'Error loading log' }, body: '' });
      }
      setLoading(false);
    };

    fetchLog();
  }, [slug]);

  if (loading) {
    // Skeleton loading screen for LogDetailPage
    return (
      <div className="bg-gray-900 py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-3">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-5/6"></div>
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!log) {
    return <div className="text-center py-16">Log not found</div>;
  }

  const ImageRenderer = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="cursor-pointer max-w-full h-auto"
      onClick={() => setModalImageSrc(src)}
    />
  );

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <Seo
        title={`${log.attributes.title} | Fezcodex`}
        description={log.body.substring(0, 150)}
        keywords={log.attributes.tags ? log.attributes.tags.join(', ') : ''}
        ogTitle={`${log.attributes.title} | Fezcodex`}
        ogDescription={log.body.substring(0, 150)}
        ogImage={
          log.attributes.image || 'https://fezcode.github.io/logo512.png'
        }
        twitterCard="summary_large_image"
        twitterTitle={`${log.attributes.title} | Fezcodex`}
        twitterDescription={log.body.substring(0, 150)}
        twitterImage={
          log.attributes.image || 'https://fezcode.github.io/logo512.png'
        }
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <Link
              to="/logs"
              className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
            >
              <ArrowLeftIcon size={24} /> Back to Logs
            </Link>
            <div
              ref={contentRef}
              className="prose prose-xl prose-dark max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ a: LinkRenderer, img: ImageRenderer }}
              >
                {log.body}
              </ReactMarkdown>
            </div>
          </div>
          <div className="hidden lg:block">
            <LogMetadata metadata={log.attributes} />
          </div>
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
