import React from 'react';
import JsMasterclassApp from '../../app/apps/js-masterclass/JsMasterclassApp';
import Seo from '../../components/Seo';

const JsMasterclassPage = () => {
  return (
    <div className="flex flex-col">
      {' '}
      {/* Offset for navbar */}
      <Seo
        title="JS Masterclass | Fezcodex"
        description="Master JavaScript and Node.js from scratch."
        keywords={[
          'javascript',
          'node.js',
          'course',
          'learn code',
          'web development',
        ]}
      />
      <JsMasterclassApp />
    </div>
  );
};

export default JsMasterclassPage;
