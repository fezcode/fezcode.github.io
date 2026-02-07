import React from 'react';

const EditorialFooter = ({ content, photoCredit }) => {
  return (
    <footer className="border-t border-white/10 py-16 bg-black z-10 relative">
      <div className="max-w-[2400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/50 text-center md:text-left flex-1 md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2">
          <span>
            © {new Date().getFullYear()} Handcrafted by Fezcode &nbsp; · &nbsp;
            Built with love and code.
          </span>
        </div>

        {photoCredit?.text && (
          <div className="text-[10px] text-white/30 hover:text-white/50 transition-colors uppercase tracking-wider ml-auto">
            {photoCredit.link ? (
              <a
                href={photoCredit.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photoCredit.text}
              </a>
            ) : (
              <span>{photoCredit.text}</span>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};

export default EditorialFooter;
