import React, { useState } from 'react';

const TerminalTabs = ({ tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  if (!tabs.length) return null;

  return (
    <div className="max-w-4xl mx-auto my-8 bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-3xl overflow-hidden font-mono">
      <div className="flex bg-white/5 border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm transition-all border-r border-white/10 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#141413] text-product-card-icon border-b-2 border-b-product-card-icon' : 'text-product-body-text hover:bg-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-8 min-h-[300px]">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-product-card-icon">$</span>
          <span className="text-white">{tabs.find(t => t.id === activeTab)?.command}</span>
        </div>
        <div className="text-product-body-text/80 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tabs.find(t => t.id === activeTab)?.output}
        </div>
      </div>
    </div>
  );
};

export default TerminalTabs;
