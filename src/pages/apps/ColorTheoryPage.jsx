import React from 'react';
import ColorTheoryApp from '../../app/apps/ColorTheory/ColorTheoryApp';
import Seo from '../../components/Seo';

const ColorTheoryPage = () => {
  return (
    <>
      <Seo
        title="Color Theory | Fezcodex"
        description="Interactive exploration of color harmony, models, and perception."
        keywords={[
          'color theory',
          'design',
          'interactive',
          'learning',
          'color wheel',
        ]}
      />
      <div className="min-h-screen bg-[#050505]">
        <ColorTheoryApp />
      </div>
    </>
  );
};

export default ColorTheoryPage;
