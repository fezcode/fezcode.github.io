import React from 'react';
import CloudMusicPlayer from '../../app/apps/CloudMusicPlayer/CloudMusicPlayer';
import Seo from '../../components/Seo';

const CloudMusicPlayerPage = () => {
  return (
    <>
      <Seo
        title="Aether | Cyberpunk Music Player"
        description="A cloud-based, cyberpunk-themed music player featuring generative art visualization and a persistent audio interface."
        keywords={['music', 'player', 'cyberpunk', 'generative art', 'audio', 'visualization', 'aether']}
        image="/images/apps/aether.png"
      />
      <CloudMusicPlayer />
    </>
  );
};

export default CloudMusicPlayerPage;