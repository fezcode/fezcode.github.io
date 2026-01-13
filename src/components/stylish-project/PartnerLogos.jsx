import React from 'react';

const PartnerLogos = ({ logos = [], label = "Trusted by industry leaders" }) => {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-nunito font-bold text-product-body-text uppercase tracking-[0.2em] mb-10 opacity-50">
          {label}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, index) => (
            <div key={index} className="text-xl font-bold text-white tracking-tighter uppercase">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerLogos;
