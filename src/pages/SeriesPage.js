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
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${seriesTitle} | Fezcodex`,
    twitterDescription: `Explore the posts in the "${seriesTitle}" series on Fezcodex.`,
    twitterImage: 'https://fezcode.github.io/logo512.png',
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
      <div className="py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4 mx-auto"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4 mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
          <div className="mt-16 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!seriesTitle || seriesPosts.length === 0) {
    return <div className="text-center py-16">Series not found.</div>;
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link to="/blog" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
            <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Blog
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {seriesTitle}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Episodes in this series.
          </p>
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">
              Total Episodes: {seriesPosts.length}
            </span>
          </div>
        </div>
        <div className="mt-16">
          <div className="">
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
    </div>
  );
};

export default SeriesPage;
