import React from 'react';

const EditorialFooter = ({ content }) => {
  return (
    <footer className="border-t border-white/10 py-16 bg-black z-10 relative">
      <div className="max-w-[2400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="text-sm text-white/50 text-center md:text-left flex-1 md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2">
           <span>© {new Date().getFullYear()} Handcrafted by Fezcode &nbsp; · &nbsp; Built with love and code.</span>
        </div>

        <div className="text-[10px] text-white/30 hover:text-white/50 transition-colors uppercase tracking-wider ml-auto">
            <a href="https://unsplash.com/photos/a-plane-flying-in-the-sky-with-a-lot-of-clouds-g3XW9EerLmE" target="_blank" rel="noopener noreferrer">
              Photo by Tim Simon
            </a>
        </div>

      </div>
    </footer>
  );
};

export default EditorialFooter;