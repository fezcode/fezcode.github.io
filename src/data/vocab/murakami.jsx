import React from 'react';

export default function Murakami() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <img
        src="/images/takashi-murakami.jpg"
        alt="Takashi Murakami"
        className="w-full h-auto max-w-xs mx-auto border-2 border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
      />
      <p>
        <strong className="text-current">Murakami, Takashi</strong> (村上 隆, Murakami Takashi) is a
        highly influential contemporary Japanese artist, often referred to as
        the "Andy Warhol of Japan."
      </p>
      <p>
        He is renowned for his vibrant, anime-inspired "Superflat" art movement,
        which skillfully blurs the lines between fine art and popular culture.
        His distinctive style draws heavily from traditional Japanese art forms,
        otaku culture, and consumerism, frequently featuring smiling flowers,
        cartoon-like characters, and a bold, colorful palette.
      </p>
      <div className="border border-white/10 p-4 bg-white/[0.02] text-xs text-gray-400">
        <p>
          Murakami's notable collaborations include designing the album cover
          art for Kanye West's 2007 album <em className="text-current not-italic">Graduation</em>
          and the 2018 Kids See Ghosts album (a joint project by Kanye West and
          Kid Cudi).
        </p>
      </div>
    </div>
  );
}
