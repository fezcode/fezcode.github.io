import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPosts, getProjects, getLogs } from '../utils/dataUtils';
import useSeo from '../hooks/useSeo';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

const getItemClasses = (type, isFeatured = false) => {
  let bgColorClass = '';
  let borderColorClass = '';
  let hoverBgColorClass = ''; // New variable for hover background

  // Determine specific background and border colors based on type
  switch (type) {
    case 'Blog Post':
      bgColorClass = 'bg-primary-500/10'; // Red with transparency
      borderColorClass = 'border-rose-500';
      hoverBgColorClass = 'hover:bg-primary-500/20'; // Hover with more red transparency
      break;
    case 'Project':
      bgColorClass = 'bg-secondary-400/10'; // Orange with transparency
      borderColorClass = 'border-blue-500';
      hoverBgColorClass = 'hover:bg-secondary-400/20'; // Hover with more orange transparency
      break;
    case 'Log Entry':
      bgColorClass = 'bg-violet-200/10'; // Purple with transparency
      borderColorClass = 'border-violet-500';
      hoverBgColorClass = 'hover:bg-violet-400/40'; // Hover with more purple transparency
      break;
    default:
      bgColorClass = 'bg-gray-800'; // Default background
      borderColorClass = 'border-gray-500'; // Default border
      hoverBgColorClass = 'hover:bg-gray-700/50'; // Default hover
  }

  // Common styles for all cards
  const baseClasses = 'relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300';

  // Combine classes.
  return `${baseClasses} ${bgColorClass} ${borderColorClass} border-l-4 ${hoverBgColorClass}`;
};

function NewsPage() {
  useSeo({
    title: 'News | Fezcodex',
    description:
      'Catch up on the latest news, projects, and log entries from Fezcodex. Your daily digest of updates from the digital frontier.',
    keywords: ['Fezcodex', 'news', 'blog', 'projects', 'logs', 'updates'],
    ogTitle: 'News | Fezcodex',
    ogDescription:
      'Catch up on the latest news, projects, and log entries from Fezcodex. Your daily digest of updates from the digital frontier.',
    ogImage: 'https://fezcode.github.io/logo512.png', // Assuming a generic logo
    twitterCard: 'summary_large_image',
    twitterTitle: 'News | Fezcodex',
    twitterDescription:
      'Catch up on the latest news, projects, and log entries from Fezcodex. Your daily digest of updates from the digital frontier.',
    twitterImage: 'https://fezcode.github.io/logo512.png', // Assuming a generic logo
  });

  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current date for the header
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  useEffect(() => {
    async function fetchNews() {
      try {
        const [blogPosts, projects, logs] = await Promise.all([
          getPosts(), // Assuming getPosts returns an array of blog posts
          getProjects(), // Assuming getProjects returns an array of projects
          getLogs(), // Assuming getLogs returns an array of logs
        ]);

        const formattedBlogPosts = blogPosts.map(post => ({
          type: 'Blog Post',
          title: post.title,
          date: post.date,
          link: `/blog/${post.slug}`,
          description: post.description || 'No description available.',
          image: post.image, // Include image
        }));

        const formattedProjects = projects.map(project => ({
          type: 'Project',
          title: project.title,
          date: project.date,
          link: `/projects/${project.slug}`,
          description: project.description || 'No description available.',
          image: project.image, // Include image
        }));

        const formattedLogs = logs.map(log => ({
          type: 'Log Entry',
          title: log.title,
          date: log.date,
          link: `/logs/${log.slug}`,
          description: log.description || 'No description available.',
          image: log.image, // Include image
        }));

        const allNews = [...formattedBlogPosts, ...formattedProjects, ...formattedLogs];

        // Sort by date, newest first
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

        setNewsItems(allNews);
      } catch (err) {
        setError('Failed to fetch news items. Please try again later.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-500">Loading the latest headlines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container mx-auto px-4 py-8 max-w-screen-xl"
    >
      <header className="mb-12 border-b-4 border-gray-700 pb-6">
        <h1 className="text-6xl font-playfairDisplay font-extrabold text-center text-gray-100 leading-tight tracking-tight mb-2">
          THE FEZ<span className="text-primary-400">CODEX</span> CHRONICLE
        </h1>
        <p className="text-center text-gray-400 mt-2 text-xl font-arvo italic">
          All the news from the digital front.
        </p>
        <div className="text-center text-gray-500 text-sm mt-4">
          {formattedDate}
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
        {/* Lead Story Section (First item) */}
        {newsItems.length > 0 && (
          <section className="lg:col-span-2 mb-16 md:mb-0">
            <h2 className="text-4xl font-playfairDisplay font-bold text-gray-100 mb-6 border-b-2 border-gray-700 pb-3">
              Latest
            </h2>
          <Link to={newsItems[0].link} className={`${getItemClasses(newsItems[0].type, true)} flex flex-col h-full group`}>
              <div className="relative h-72 sm:h-96 w-full overflow-hidden block">
                <img src={newsItems[0].image} alt={newsItems[0].title} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <span className="block text-sm font-arvo text-primary-400 uppercase mb-3 tracking-wider">
                  {newsItems[0].type} &mdash; {new Date(newsItems[0].date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <h3 className="text-4xl font-playfairDisplay font-extrabold text-gray-50 group-hover:text-primary-300 transition-colors duration-300 mb-4 leading-tight">
                  {newsItems[0].title}
                </h3>
                <p className="text-gray-300 font-inter text-lg mb-6 line-clamp-4">
                  {newsItems[0].description}
                </p>
                <div className="inline-flex items-center text-primary-400 group-hover:text-primary-300 font-arvo transition-colors duration-300 mt-auto">
                  Continue Reading
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Secondary Features Section (Next two items) */}
        {newsItems.length > 1 && (
          <section className="lg:col-span-1 flex flex-col space-y-8">
            <h2 className="text-4xl font-playfairDisplay font-bold text-gray-100 mb-6 border-b-2 border-gray-700 pb-3">
              and More...
            </h2>
            {newsItems.slice(1, 3).map((item, index) => (
                            <Link key={`secondary-${index}`} to={item.link} className={`${getItemClasses(item.type)} flex flex-col group`}>
                              <div className="relative h-48 w-full overflow-hidden">
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                              </div>
                              <div className="p-6 flex-grow flex flex-col">
                                <span className="block text-xs font-arvo text-primary-400 uppercase mb-2">
                                  {item.type} &mdash; {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <h3 className="text-xl font-playfairDisplay font-bold text-gray-50 group-hover:text-primary-300 transition-colors duration-300 mb-3 leading-snug">
                                  {item.title}
                                </h3>
                                <p className="text-gray-300 font-inter text-sm line-clamp-3">
                                  {item.description}
                                </p>
                                <div className="inline-flex items-center text-primary-400 group-hover:text-primary-300 font-arvo transition-colors duration-300 mt-auto pt-4">
                                  Read More
                                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                  </svg>
                                </div>
                              </div>
                            </Link>            ))}
          </section>
        )}

        {/* More Updates Section */}
        {newsItems.length > 3 && (
          <section className="lg:col-span-3 mt-12 pt-8 border-t-2 border-gray-700">
            <h2 className="text-4xl font-playfairDisplay font-bold text-gray-100 mb-8 border-b-2 border-gray-700 pb-3">
              and Even More Updates...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.slice(3).map((item, index) => (
                <Link
                  key={`item-${index}`}
                  to={item.link}
                  className={`${getItemClasses(item.type)} flex flex-col group ${
                    index % 5 === 0 ? 'md:col-span-2' : '' // A bit more varied
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden block">
                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <span className="block text-xs font-arvo text-primary-400 uppercase mb-2">
                      {item.type} &mdash; {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <h3 className="text-xl font-playfairDisplay font-bold text-gray-50 group-hover:text-primary-300 transition-colors duration-300 mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 font-inter text-sm line-clamp-3">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center text-primary-400 group-hover:text-primary-300 font-arvo transition-colors duration-300 mt-auto pt-4">
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {newsItems.length === 0 && !loading && (
          <div className="lg:col-span-3 text-center text-gray-400 text-xl">
            No news items found. Check back later!
          </div>
        )}
      </main>
    </motion.div>
  );
}

export default NewsPage;
