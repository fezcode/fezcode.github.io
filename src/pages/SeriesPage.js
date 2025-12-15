import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';

const SeriesPage = () => {
  const { seriesSlug } = useParams();
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useSeo({
    title: `${seriesTitle} | Fezcodex`,
    description: `Explore the posts in the "${seriesTitle}" series on Fezcodex.`,
    keywords: ['Fezcodex', 'blog', 'series', seriesTitle],
    ogTitle: `${seriesTitle} | Fezcodex`,
    ogDescription: `Explore the posts in the "${seriesTitle}" series on Fezcodex.`,
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${seriesTitle} | Fezcodex`,
    twitterDescription: `Explore the posts in the "${seriesTitle}" series on Fezcodex.`,
    twitterImage: '/images/ogtitle.png',
  });

  useEffect(() => {
    const fetchSeriesPosts = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (response.ok) {
          const allPostsData = await response.json();

          const processedPosts = [];
          allPostsData.forEach((item) => {
            if (item.series) {
              item.series.posts.forEach((seriesPost) => {
                processedPosts.push({
                  ...seriesPost,
                  series: {
                    slug: item.slug,
                    title: item.title,
                  },
                });
              });
            } else {
              processedPosts.push(item);
            }
          });

          const filteredPosts = processedPosts
            .filter((post) => post.series && post.series.slug === seriesSlug)
            .sort((a, b) => {
              const dateA = new Date(a.updated || a.date);
              const dateB = new Date(b.updated || b.date);
              return dateB - dateA;
            });

          if (filteredPosts.length > 0) {
            setSeriesPosts(filteredPosts);
            setSeriesTitle(filteredPosts[0].series.title);
          } else {
            // Handle series not found
            setSeriesPosts([]);
            setSeriesTitle('Series Not Found');
          }
        } else {
          console.error('Failed to fetch posts.json');
          setSeriesPosts([]);
          setSeriesTitle('Error');
        }
      } catch (error) {
        console.error('Error fetching series posts:', error);
        setSeriesPosts([]);
        setSeriesTitle('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesPosts();
  }, [seriesSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="font-mono text-cyan-500 animate-pulse">
            ACCESSING SERIES DATA...
          </p>
        </div>
      </div>
    );
  }

  if (!seriesTitle || seriesPosts.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center text-gray-400 font-mono">
        Series Archives Empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-900/20 rounded-full blur-3xl -z-10 opacity-30" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -z-10 opacity-30" />
      </div>

      <div className="relative py-16 sm:py-24 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono tracking-widest uppercase mb-8 border-b border-cyan-900/50 pb-1 hover:border-cyan-400"
          >
            <ArrowLeftIcon className="text-lg" />
            Back to Archives
          </Link>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 font-mono">
            SERIES:
            <span className="text-cyan-500">{seriesTitle.toUpperCase()}</span>
          </h1>

          <div className="flex justify-center items-center gap-4 mt-6">
            <span className="px-4 py-1 bg-cyan-900/30 border border-cyan-800 text-cyan-400 rounded-full text-sm font-mono">
              {seriesPosts.length} EPISODES
            </span>
          </div>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Sequential data entries for this topic.
          </p>
        </div>

        <div className="mt-12 space-y-6 max-w-4xl mx-auto">
          {seriesPosts.map((post) => (
            <PostItem
              key={post.slug}
              slug={`series/${seriesSlug}/${post.slug}`}
              title={post.title}
              date={post.date}
              updatedDate={post.updated}
              category={post.category}
              series={post.series}
              seriesIndex={post.seriesIndex}
              isSeries={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;
