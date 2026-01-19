import React from 'react';
import { motion } from 'framer-motion';
import { theoryChapters } from '../utils/theoryData';

const LearnSection = () => {
  return (
    <div className="h-full overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <header>
            <h2 className="text-5xl font-normal font-instr-serif mb-4 text-[#1a1a1a]">Color Theory 101</h2>
            <p className="text-xl text-[#4a4a4a] leading-relaxed max-w-2xl font-nunito">
                Understanding the fundamental concepts behind how we see, mix, and use color is the first step to mastering design.
            </p>
        </header>

        <div className="grid gap-8">
            {theoryChapters.map((chapter, index) => (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={chapter.id}
                    className="bg-[#f4f4f0] p-8 rounded-3xl border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a]"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1a1a1a] text-white font-black text-xl shrink-0 font-mono">
                            {index + 1}
                        </span>
                        <div>
                            <h3 className="text-3xl font-normal text-[#1a1a1a] font-instr-serif">{chapter.title}</h3>
                            <p className="text-[#666] font-medium font-nunito">{chapter.subtitle}</p>
                        </div>
                    </div>
                    <div className="text-[#333] leading-loose text-lg font-nunito pl-16">
                        {chapter.content}
                    </div>
                </motion.section>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LearnSection;
