import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Envelope } from '@phosphor-icons/react';
import usePageTitle from '../utils/usePageTitle';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a href={href} className="text-primary-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1" target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
      {children} {isExternal && <ArrowLeftIcon className="text-xs" />}
    </a>
  );
};

const AboutPage = () => {
  usePageTitle('About Me');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('About Me');

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const [metaResponse, contentResponse] = await Promise.all([
          fetch('/data/about.json'),
          fetch('/about.txt')
        ]);

        let attributes = {};
        if (metaResponse.ok) {
          attributes = await metaResponse.json();
        } else {
          console.error('Failed to fetch about.json');
        }

        let body = '';
        if (contentResponse.ok) {
          body = await contentResponse.text();
        } else {
          console.error('Failed to fetch about.txt');
        }

        setTitle(attributes.title || 'About Me');
        setEmail(attributes.email || '');
        setContent(body);

      } catch (err) {
        console.error("Error fetching about page content:", err);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/" className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon className="text-xl" /> Back to Home
        </Link>
        <div className="border border-gray-700 p-8 rounded-lg shadow-xl flex">
          <div className="w-1 bg-gray-600 mr-1"></div>
          <div className="w-1 bg-gray-700 mr-1"></div>
          <div className="w-1 bg-gray-800 mr-8"></div>
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight text-primary-400 sm:text-6xl mb-8">{title}</h1>

            <div className="prose prose-invert max-w-none leading-snug">
              <ReactMarkdown components={{ a: LinkRenderer }}>
                {content}
              </ReactMarkdown>
            </div>

            {email && (
              <div className="mt-8">
                <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Contact</h2>
                <p className="flex items-center gap-2">
                  <Envelope className="text-primary-400" /> Feel free to reach out to me at <a href={`mailto:${email}`} className="text-primary-400 hover:text-primary-500 transition-colors">{email}</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;