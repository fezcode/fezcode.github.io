import ReactMarkdown from 'react-markdown';

const EditorialInstall = ({ content, platforms }) => {
  if (!content) return null;

  return (
    <section id="install" className="py-24 border-b border-white/10">
      <div className="max-w-[2400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="md:col-start-2 md:col-span-3 border-l border-white/10 pl-8">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Platform Support */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-4 border-b border-white/10 pb-2">
                Platform Support
              </h3>
              <div className="flex flex-wrap gap-2">
                 {platforms.split('\n').map((platform, idx) => (
                   <div key={idx} className="border border-white/20 text-white px-4 py-2 rounded select-none cursor-default">
                     {platform}
                   </div>
                 ))}
              </div>
            </div>

            {/* CLI Install */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-4 border-b border-white/10 pb-2">
                Install Command
              </h3>
              <div className="bg-[#1d2021] border border-white/10 rounded p-3 flex items-center justify-between group cursor-pointer hover:bg-[#282828] transition-colors">
                <code className="font-mono text-sm text-[#ebdbb2] truncate">
                  <ReactMarkdown components={{ p: ({children}) => <>{children}</> }}>
                    {content}
                  </ReactMarkdown>
                </code>
                <span className="text-white/30 group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialInstall;
