import React from 'react';

const MinimalFooter = ({ content, photoCredit }) => {
  return (
    <footer className="bg-[#f3f1e9] text-black pt-40 pb-20 font-instr-sans">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-20 mb-40">
          <div className="max-w-2xl">
            <h2 className="text-8xl md:text-[12rem] font-instr-serif font-bold tracking-tighter leading-[0.8] mb-12">
              LET'S
              <br />
              WORK
            </h2>
            <p className="text-2xl font-light text-black/40">
              Exploring the boundaries of digital experience and visual
              storytelling.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
            <a
              href="mailto:hello@fezcode.com"
              className="hover:text-black transition-colors"
            >
              Contact
            </a>
            <a
              href="https://github.com/fezcode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/fezcode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/20">
          <div className="flex gap-8">
            <span>© 2026 FEZCODEX</span>
            <span>BUILT WITH REACT & TAILWIND</span>
          </div>

          {photoCredit && photoCredit.text && (
            <div className="mt-4 md:mt-0">
              Photo by{' '}
              <a
                href={photoCredit.link}
                className="text-black/40 hover:text-black underline"
              >
                {photoCredit.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
export default MinimalFooter;
