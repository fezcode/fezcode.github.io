import React from 'react';
import * as Icons from '@phosphor-icons/react';

const FeatureCard = ({ title, description, iconName }) => {
  const IconComponent = Icons[`${iconName}Icon`] || Icons.CubeIcon;

  return (
    <div className="bg-product-card-bg p-8 rounded-2xl border border-white/5 hover:border-product-card-icon/20 transition-all group">
      <div className="mb-6 inline-flex p-3 rounded-xl bg-product-card-icon/10 text-product-card-icon group-hover:scale-110 transition-transform duration-300">
        <IconComponent size={32} weight="duotone" />
      </div>
      <h3 className="text-2xl font-instr-serif text-product-card-text italic mb-4">
        {title}
      </h3>
      <p className="text-product-body-text font-nunito leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
