import React from 'react';

export default function Murakami() {
  return (
    <div className="space-y-4">
      <img
        src="/images/takashi-murakami.jpg"
        alt="Takashi Murakami"
        className="w-full h-auto max-w-xs mx-auto rounded-lg shadow-lg"
      />
      <p>
        <strong>Murakami, Takashi</strong> (村上 隆, Murakami Takashi) is a
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
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
        <p>
          Murakami's notable collaborations include designing the album cover
          art for Kanye West's 2007 album <em>Graduation</em>
          and the 2018 Kids See Ghosts album (a joint project by Kanye West and
          Kid Cudi).
        </p>
      </div>
    </div>
  );
}
