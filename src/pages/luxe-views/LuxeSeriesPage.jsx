import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import LuxeArt from '../../components/LuxeArt';

const LuxeSeriesPage = () => {
  const { seriesSlug } = useParams();
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeriesPosts = async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();

        const filteredPosts = processedPosts
          .filter((post) => post.series && post.series.slug === seriesSlug)
          .sort((a, b) => (a.seriesIndex || 0) - (b.seriesIndex || 0));

        if (filteredPosts.length > 0) {
          setSeriesPosts(filteredPosts);
          setSeriesTitle(filteredPosts[0].series.title);
          setSeriesDescription(filteredPosts[0].series.description || 'A sequential collection of posts.');
        } else {
          setSeriesTitle('Series Not Found');
        }
      } catch (error) {
        console.error('Error fetching series posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesPosts();
  }, [seriesSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Loading Series...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`Read the ${seriesTitle} series on Fezcodex.`}
        keywords={['Fezcodex', 'series', 'blog', seriesTitle]}
      />

      <div className="max-w-[1000px] mx-auto px-6 md:px-12">

        {/* Header */}
        <header className="mb-20 text-center">
           <Link to="/blog" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeftIcon /> Back to Journal
           </Link>

           <div className="relative mb-8 aspect-[21/9] w-full bg-[#EBEBEB] overflow-hidden rounded-sm border border-[#1A1A1A]/5 shadow-sm">
                <div className="absolute inset-0 opacity-40">
                    <LuxeArt seed={seriesTitle} className="w-full h-full mix-blend-multiply" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-sm">
                    <span className="font-outfit text-xs uppercase tracking-[0.3em] text-[#1A1A1A]/60 mb-4 border border-[#1A1A1A]/10 px-3 py-1 rounded-full">
                        Series Collection
                    </span>
                    <h1 className="font-playfairDisplay text-5xl md:text-7xl text-[#1A1A1A] leading-tight mb-6">
                        {seriesTitle}
                    </h1>
                    <p className="font-outfit text-sm text-[#1A1A1A]/70 max-w-xl leading-relaxed">
                        {seriesDescription}
                    </p>
                </div>
           </div>

           <div className="flex justify-center gap-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 border-b border-[#1A1A1A]/10 pb-12">
               <span>{seriesPosts.length} Episodes</span>
               <span>•</span>
               <span>Updated {new Date().getFullYear()}</span>
           </div>
        </header>

        {/* Episode List */}
        <div className="space-y-0">
            {seriesPosts.map((post, index) => (
                <Link key={post.slug} to={`/blog/series/${seriesSlug}/${post.slug}`} className="group block border-b border-[#1A1A1A]/5 py-8 hover:bg-white px-6 -mx-6 transition-colors rounded-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <span className="font-playfairDisplay text-4xl text-[#1A1A1A]/10 group-hover:text-[#8D4004]/20 transition-colors">
                                {String(post.seriesIndex).padStart(2, '0')}
                            </span>
                            <div>
                                <h3 className="font-playfairDisplay text-2xl text-[#1A1A1A] group-hover:italic transition-all mb-2">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-4 font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">
                                    <span className="flex items-center gap-1"><CalendarIcon size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                                    {post.tags && <span>#{post.tags[0]}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 group-hover:text-[#8D4004] transition-colors">
                            Read Episode <ArrowRightIcon />
                        </div>
                    </div>
                </Link>
            ))}
        </div>

      </div>
    </div>
  );
};

export default LuxeSeriesPage;
