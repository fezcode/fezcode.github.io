import React, { useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndCard from '../../components/dnd/DndCard';
import DndLayout from '../../components/dnd/DndLayout';
import useSeo from '../../hooks/useSeo';
import { useAchievements } from '../../context/AchievementContext';
import { BookOpen, Scroll, UsersThree, MapTrifold, Sword } from '@phosphor-icons/react';

const DndPage = () => {
  useSeo({
    title: 'From Serfs and Frauds | Fezcodex',
    description: 'Welcome to the world of From Serfs and Frauds, a Dungeons & Dragons campaign.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'campaign'],
  });

  const { setBreadcrumbs } = useContext(DndContext);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('story_explorer');
    setBreadcrumbs([{ label: 'S&F', path: '/stories' }]);
  }, [setBreadcrumbs, unlockAchievement]);

  return (
    <DndLayout>
      <div className="max-w-6xl mx-auto px-6 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          <div className="flex justify-center mb-8">
             <div className="h-px w-24 bg-dnd-gold/40 self-center" />
             <Scroll size={40} className="mx-6 text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />
             <div className="h-px w-24 bg-dnd-gold/40 self-center" />
          </div>

                                        <h1 className="text-lg md:text-2xl font-mono text-white/80 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 drop-shadow-lg">

                                          Welcome to the

                                        </h1>

                                                  <h2 className="text-5xl md:text-9xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter leading-none mb-12 drop-shadow-2xl dnd-header-pulse">

                                                    Great Archives

                                                  </h2>

                                        <p className="text-lg md:text-2xl font-arvo text-gray-200 max-w-2xl mx-auto leading-relaxed italic opacity-90 px-4">

                                          "Every serf has a story, and every fraud a hidden truth. Step into the tapestry of our shared odyssey."

                                        </p>

                            </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <DndCard
            title="Chronicles"
            description="The documented history and lore of the realms."
            link="/stories/lore"
            icon={<Scroll size={48} weight="duotone" />}
          />
          <DndCard
            title="Dramatis Personae"
            description="The heroes, villains, and bystanders of our tales."
            link="/stories/characters"
            icon={<UsersThree size={48} weight="duotone" />}
          />
          <DndCard
            title="The Atlas"
            description="Landmarks, cities, and hidden corners of the world."
            link="/stories/places"
            icon={<MapTrifold size={48} weight="duotone" />}
          />
          <DndCard
            title="The Armory"
            description="Artifacts, curiosities, and tools of the trade."
            link="/stories/items"
            icon={<Sword size={48} weight="duotone" />}
          />
          <DndCard
            title="Creators"
            description="Meeting the scribes behind the legend."
            link="/stories/authors"
            icon={<BookOpen size={48} weight="duotone" />}
          />
        </div>
      </div>
    </DndLayout>
  );
};

export default DndPage;
