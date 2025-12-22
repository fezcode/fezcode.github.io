import React from 'react';
import { motion } from 'framer-motion';
import DndLayout from '../../components/dnd/DndLayout';
import useSeo from '../../hooks/useSeo';
import { WarningCircle } from '@phosphor-icons/react';

function DndNotFoundPage() {
  useSeo({
    title: '404 - Lost in the Dungeon! | Fezcodex',
    description: 'The page you are looking for does not exist in this D&D realm.',
    keywords: ['Fezcodex', 'd&d', 'dnd', '404', 'not found', 'lost', 'dungeon'],
  });

  return (
    <DndLayout>
      <div className="max-w-4xl mx-auto px-6 py-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-12">
             <WarningCircle size={80} className="text-dnd-gold animate-pulse" weight="duotone" />
          </div>

          <h1 className="text-7xl md:text-9xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-8">
            LOST_404
          </h1>

          <div className="dnd-parchment-container p-12 md:p-16 shadow-2xl">
            <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-8 !h-8" />
            <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-8 !h-8" />
            <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-8 !h-8" />
            <div className="dnd-ornate-corner dnd-ornate-corner-br !w-8 !h-8" />

            <p className="text-2xl font-arvo text-dnd-crimson font-bold uppercase tracking-widest mb-6">
              Stranded in the Ether
            </p>
            <p className="text-lg font-arvo text-dnd-text/80 leading-relaxed max-w-lg mx-auto">
              The chronicle you seek has been lost to time or never existed in these archives.
              Perhaps you took a wrong turn at the last crossroads.
            </p>
          </div>
        </motion.div>
      </div>
    </DndLayout>
  );
}

export default DndNotFoundPage;
