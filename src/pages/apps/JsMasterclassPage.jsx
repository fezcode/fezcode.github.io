import React from 'react';
import JsMasterclassApp from '../../app/apps/js-masterclass/JsMasterclassApp';
import useSeo from '../../hooks/useSeo';

const JsMasterclassPage = () => {
  useSeo({
    title: 'JS Masterclass | Fezcodex',
    description: 'Master JavaScript and Node.js from scratch.',
    keywords: ['javascript', 'node.js', 'course', 'learn code', 'web development'],
  });

  return (
    <div className="flex flex-col"> {/* Offset for navbar */}
      <JsMasterclassApp />
    </div>
  );
};

export default JsMasterclassPage;
