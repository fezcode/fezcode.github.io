import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft,
  SealCheck,
  FileText,
  IdentificationBadge,
  Clock,
  Calendar,
} from '@phosphor-icons/react';
import GrainOverlay from '../components/GrainOverlay';
import GenerativeArt from '../components/GenerativeArt';
import { calculateReadingTime } from '../utils/readingTime';
import MarkdownLink from '../components/MarkdownLink';
import ImageModal from '../components/ImageModal';

const DokumentBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postsResponse = await fetch('/posts/posts.json');
        const allPostsData = await postsResponse.json();
        let allPosts = [];
        allPostsData.forEach((item) => {
          if (item.series) {
            item.series.posts.forEach((seriesPost) => {
              allPosts.push({
                ...seriesPost,
                series: { slug: item.slug, title: item.title },
              });
            });
          } else {
            allPosts.push(item);
          }
        });

        const postMetadata = allPosts.find((item) => item.slug === currentSlug);
        if (!postMetadata) {
          navigate('/404');
          return;
        }

        const contentPath = `posts/${postMetadata.filename}`;
        const postContentResponse = await fetch(`/${contentPath}`);
        const postBody = await postContentResponse.text();

        setPost({ attributes: postMetadata, body: postBody });
      } catch (error) {
        console.error('Error fetching dossier post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [currentSlug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      setReadingProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center font-mono text-black uppercase tracking-widest text-xs animate-progress">
        Accessing_Restricted_File...
      </div>
    );
  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111] font-sans relative overflow-x-hidden selection:bg-emerald-500/20">
      <GrainOverlay opacity={0.4} />

      <div className="fixed top-0 left-0 w-full h-1 bg-black/5 z-50">
        <div
          className="h-full bg-emerald-600"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] w-full overflow-hidden border-b-2 border-black">
        <GenerativeArt
          seed={post.attributes.title}
          className="absolute inset-0 opacity-30 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3f3f3] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <div className="mb-8 flex items-center gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft weight="bold" />
              <span>Return to Archives</span>
            </Link>
            <div className="border-2 border-emerald-600 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)]">
              CLASSIFIED // {post.attributes.category}
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-playfairDisplay font-black uppercase tracking-tight text-black leading-none max-w-5xl">
            {post.attributes.title}
          </h1>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-8">
          <article
            className="prose prose-lg md:prose-xl max-w-none
                prose-headings:font-playfairDisplay prose-headings:font-black prose-headings:uppercase prose-headings:text-black prose-headings:border-b-2 prose-headings:border-black prose-headings:pb-2
                prose-p:text-[#333] prose-p:leading-relaxed
                prose-strong:text-white prose-strong:bg-emerald-700 prose-strong:px-1
                prose-blockquote:border-l-[6px] prose-blockquote:border-emerald-600 prose-blockquote:bg-emerald-50 prose-blockquote:py-4
                prose-code:bg-black/5 prose-code:text-emerald-800
                prose-a:text-emerald-700 prose-a:underline prose-a:decoration-emerald-600/30 hover:prose-a:decoration-emerald-600"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                a: (p) => (
                  <MarkdownLink
                    {...p}
                    className="font-bold underline decoration-emerald-600/30 hover:decoration-emerald-600"
                  />
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </article>
        </div>

        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute -top-4 -right-10 px-12 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase rotate-45">
                AUTHENTICATED
              </div>

              <h3 className="mb-8 font-mono text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 flex items-center gap-2">
                <FileText size={18} /> FILE_SPECIFICATIONS
              </h3>

              <div className="space-y-6">
                <DossierSpec
                  icon={Calendar}
                  label="Date_Logged"
                  value={new Date(post.attributes.date).toLocaleDateString()}
                />
                <DossierSpec
                  icon={Clock}
                  label="Archive_Size"
                  value={`${calculateReadingTime(post.body)} MIN_READ`}
                />
                <DossierSpec
                  icon={IdentificationBadge}
                  label="Subject_ID"
                  value={slug.substring(0, 8).toUpperCase()}
                  isAccent
                />
              </div>

              <div className="mt-12 flex items-center gap-3 border-t pt-6 border-gray-100">
                <SealCheck
                  size={32}
                  className="text-emerald-600"
                  weight="fill"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] font-bold uppercase text-gray-400 tracking-widest">
                    Verification_Status
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase text-emerald-700">
                    VERIFIED_ARCHIVE_ENTRY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        src={modalImageSrc}
        alt="Dossier Exhibit"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

const DossierSpec = ({ icon: Icon, label, value, isAccent }) => (
  <div className="flex flex-col gap-1">
    <span className="font-mono text-[9px] font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
      <Icon size={14} /> {label}
    </span>
    <span
      className={`font-mono text-sm font-black uppercase ${isAccent ? 'text-emerald-600' : 'text-black'}`}
    >
      {value}
    </span>
  </div>
);

export default DokumentBlogPostPage;
