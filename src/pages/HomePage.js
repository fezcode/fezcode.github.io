import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import { PushPin, BookBookmarkIcon, ArrowRight } from '@phosphor-icons/react';

import useSeo from '../hooks/useSeo';

const HomePage = () => {
  useSeo({
    title: 'Fezcodex | Home',
    description:
      'Exploring the world of code, one post at a time. Welcome to my personal website and blog.',
    keywords: [
      'Fezcodex',
      'blog',
      'portfolio',
      'developer',
      'software engineer',
    ],
    ogTitle: 'Fezcodex | Home',
    ogDescription:
      'Exploring the world of code, one post at a time. Welcome to my personal website and blog.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Fezcodex | Home',
    twitterDescription:
      'Exploring the world of code, one post at a time. Welcome to my personal website and blog.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { projects: pinnedProjects, loading, error } = useProjects(true);

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (response.ok) {
          const allPostsData = await response.json();

          const seriesMap = new Map();
          const individualPosts = [];

          allPostsData.forEach((item) => {
            if (item.series) {
              // This is a series container
              seriesMap.set(item.slug, {
                ...item,
                isSeries: true,
                posts: item.series.posts, // Keep reference to child posts for date sorting
              });
            } else {
              // This is an individual post
              individualPosts.push(item);
            }
          });

          // Combine individual posts and series entries
          const combinedItems = [
            ...Array.from(seriesMap.values()),
            ...individualPosts,
          ];

          // Helper function to get the effective date for sorting
          const getEffectiveDate = (item) => {
            if (item.isSeries) {
              // For a series, use its top-level updated or date
              return new Date(item.updated || item.date);
            } else {
              // For an individual post, use updated or date
              return new Date(item.updated || item.date);
            }
          };

          // Sort combined items by effective date (newest first)
          combinedItems.sort((a, b) => {
            const dateA = getEffectiveDate(a);
            const dateB = getEffectiveDate(b);
            return dateB - dateA;
          });

          setPosts(combinedItems);
        } else {
          console.error('Failed to fetch post slugs');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching post slugs:', error);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPostSlugs();
  }, []);

  if (loading || loadingPosts) {
    // Skeleton loading screen for HomePage
    return (
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-10 bg-gray-800 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>

          <div className="mt-16">
            <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 sm:py-24 text-center text-red-500">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Welcome to fez<span className="text-primary-400">codex</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Exploring the world of code, one post at a time.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl tracking-tight text-white text-center flex items-center justify-center gap-2 font-arvo">
            <PushPin className="text-primary-400 text-lg" /> Pinned Projects
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pinnedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={{ ...project, description: project.shortDescription }}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/projects"
              className="text-primary-400 hover:underline flex items-center justify-center gap-2"
            >
              View All Projects <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl tracking-tight text-white text-center flex items-center justify-center gap-2 font-arvo">
            <BookBookmarkIcon className="text-primary-400 text-lg" /> Recent Blog Posts
          </h2>
          <div className="mt-8">
            {posts
              .slice(0, 5)
              .map((item) =>
                item.isSeries ? (
                  <PostItem
                    key={item.slug}
                    slug={`series/${item.slug}`}
                    title={item.title}
                    date={item.date}
                    updatedDate={item.updated}
                    category="series"
                    isSeries={true}
                  />
                ) : (
                  <PostItem
                    key={item.slug}
                    slug={item.slug}
                    title={item.title}
                    date={item.date}
                    updatedDate={item.updated}
                    category={item.category}
                    series={item.series}
                    seriesIndex={item.seriesIndex}
                  />
                ),
              )}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="text-primary-400 hover:underline flex items-center justify-center gap-2"
            >
              See All Blog Posts <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
