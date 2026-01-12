import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ChatCircleIcon,
  PaperPlaneRightIcon,
  ArrowLeftIcon,
  UserIcon,
  DotsThreeIcon,
  ShareNetworkIcon
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const BOT_NAMES = [
  'Skylar_99', 'NeonVibe', 'CryptoKing', 'ZenMaster', 'Bella_Rose',
  'TechGuru', 'PixelArtist', 'Influencer_01', 'HappyLife', 'TravelBug'
];

const POSITIVE_COMMENTS = [
  "This is literally me right now! 😍",
  "So brave to say this. 👏👏",
  "I feel seen! ✨",
  "This! 1000x This!",
  "Undefined behavior? More like undefined brilliance.",
  "You're disrupting the paradigm!",
  "Slay! 🔥",
  "Big mood.",
  "Manifesting this energy. ✨",
  "Louder for the people in the back! 🗣️"
];

const PRESET_POSTS = [
  "Just drank water. Hydration is key! 💧",
  "Hustling 25/8. Sleep is for the weak. 💼",
  "Thinking about switching to a new JS framework...",
  "Sunset state of mind. 🌅",
  "Is it just me or is the algorithm weird today?",
];

const EchoChamberPage = () => {
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState('');
  const feedEndRef = useRef(null);

  const simulateEngagement = useCallback((postId) => {
    // Rapidly increase likes
    const likeInterval = setInterval(() => {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + Math.floor(Math.random() * 50) + 1 };
        }
        return post;
      }));
    }, 200);

    // Add random comments
    let commentCount = 0;
    const commentInterval = setInterval(() => {
      if (commentCount > 5) {
        clearInterval(commentInterval);
        clearInterval(likeInterval); // Stop likes eventually
        return;
      }

      const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      const botComment = POSITIVE_COMMENTS[Math.floor(Math.random() * POSITIVE_COMMENTS.length)];

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { id: Date.now(), user: botName, text: botComment }]
          };
        }
        return post;
      }));
      commentCount++;
    }, 1500);
  }, []);

  const createPost = useCallback((text) => {
    const newId = Date.now();
    const newPost = {
      id: newId,
      text: text,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
    };
    setPosts(prev => [newPost, ...prev]);
    simulateEngagement(newId);
  }, [simulateEngagement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    createPost(inputText);
    setInputText('');
  };

  // Glassmorphism Styles
  const glassCard = "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl";
  const glassInput = "bg-white/5 backdrop-blur-md border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-white placeholder-pink-100/50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans text-white overflow-hidden relative selection:bg-pink-300 selection:text-pink-900">
      <Seo
        title="The Echo Chamber | Fezcodex"
        description="A solitary social network where everyone agrees with you."
        keywords={['social media', 'simulation', 'glassmorphism', 'echo chamber', 'bots']}
      />
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation Return Link */}
      <div className="absolute top-6 left-6 z-50">
         <Link to="/apps" className={`${glassCard} px-6 py-3 flex items-center gap-2 hover:bg-white/20 transition-all text-xs font-bold font-mono tracking-widest uppercase`}>
            <ArrowLeftIcon weight="bold" />
            <span>Return to Reality</span>
         </Link>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-20 relative z-10 flex flex-col h-screen">

        {/* Header */}
        <div className="text-center mb-8">
            <BreadcrumbTitle title="The Echo Chamber" slug="ec" variant="brutalist" className="justify-center" />
            <p className="text-pink-100 text-xl font-arvo opacity-90 italic">Where everyone agrees with you. Forever.</p>
        </div>

        {/* Feed Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2 pb-24">
            <AnimatePresence>
                {posts.map(post => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${glassCard} p-6`}
                    >
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-200 to-pink-400 flex items-center justify-center text-xl shadow-inner">
                                    <UserIcon weight="fill" className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-playfairDisplay font-bold text-xl leading-tight">You</h3>
                                    <p className="text-xs font-mono text-pink-100 opacity-70 uppercase tracking-tighter">{post.timestamp}</p>
                                </div>
                            </div>
                            <DotsThreeIcon size={24} className="opacity-70 cursor-pointer hover:opacity-100" />
                        </div>

                        {/* Post Content */}
                        <p className="text-2xl font-arvo mb-6 font-medium leading-relaxed drop-shadow-sm">{post.text}</p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-6 mb-4 text-pink-100 font-mono text-sm">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <HeartIcon weight="fill" className="text-pink-300" size={20} />
                                <span className="font-bold">{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <ChatCircleIcon weight="bold" size={20} />
                                <span>{post.comments.length}</span>
                            </div>
                             <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors ml-auto">
                                <ShareNetworkIcon weight="bold" size={20} />
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-3 pt-4 border-t border-white/10 font-arvo">
                            <AnimatePresence>
                                {post.comments.map(comment => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 text-sm"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 flex-shrink-0"></div>
                                        <div className="bg-white/5 rounded-2xl px-4 py-2">
                                            <span className="font-bold font-mono text-pink-200 block text-[10px] uppercase mb-1 tracking-wider">@{comment.user}</span>
                                            <span className="opacity-90 leading-relaxed">{comment.text}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
             <div ref={feedEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-purple-900/50 to-transparent">
             <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Say something brilliant..."
                    className={`${glassInput} w-full py-5 pl-8 pr-16 text-xl font-arvo shadow-2xl`}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-pink-500 hover:bg-pink-400 transition-colors shadow-lg text-white"
                >
                    <PaperPlaneRightIcon size={24} weight="fill" />
                </button>
             </form>
             {/* Presets */}
             <div className="flex gap-2 overflow-x-auto mt-4 pb-2 no-scrollbar justify-center">
                 {PRESET_POSTS.map((preset, i) => (
                     <button
                        key={i}
                        onClick={() => createPost(preset)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold font-mono tracking-tighter uppercase backdrop-blur-sm border border-white/10 transition-colors"
                     >
                         {preset}
                     </button>
                 ))}
             </div>
        </div>

      </div>

       <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default EchoChamberPage;
