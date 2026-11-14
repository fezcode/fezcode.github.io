import React from 'react';

/**
 * The desktop behind every Bliss page: a deep-to-pale blue sky, cumulus
 * clouds grown from fractal noise (thresholded into soft, uneven puffs with
 * a lit top and a cool shaded underside), and two rolling green hills.
 * Pure SVG, fixed to the viewport, decorative only.
 */
const BlissWallpaper = () => (
  <div className="bl-wallpaper" aria-hidden="true">
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Cloud body: low-frequency noise, stretched wide, cut to puffs. */}
        <filter
          id="bl-clouds"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0022 0.0062"
            numOctaves="6"
            seed="11"
            result="noise"
          />
          {/* Alpha from the noise, thresholded: sparse clumps, soft edges. */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    3.1 0 0 0 -1.42"
            result="puffs"
          />
          {/* Light from above: the noise as a height map. */}
          <feDiffuseLighting
            in="noise"
            surfaceScale="9"
            diffuseConstant="1.05"
            lightingColor="#ffffff"
            result="light"
          >
            <feDistantLight azimuth="270" elevation="58" />
          </feDiffuseLighting>
          {/* Tint the shading cool so undersides read blue-grey, not grey. */}
          <feColorMatrix
            in="light"
            type="matrix"
            values="0.78 0 0 0 0.25
                    0 0.82 0 0 0.22
                    0 0 0.88 0 0.2
                    0 0 0 1 0"
            result="tint"
          />
          <feComposite in="tint" in2="puffs" operator="in" result="lit" />
          <feGaussianBlur in="lit" stdDeviation="1.4" />
        </filter>

        {/* Wisps: finer, fainter, higher. */}
        <filter
          id="bl-wisps"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0016 0.012"
            numOctaves="4"
            seed="3"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    2.2 0 0 0 -1.05"
          />
          <feGaussianBlur stdDeviation="2" />
        </filter>

        {/* Clouds thin out toward the horizon and vanish behind the hill. */}
        <linearGradient id="bl-cloud-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="bl-cloud-mask">
          <rect width="1600" height="720" fill="url(#bl-cloud-fade)" />
        </mask>

        <linearGradient id="bl-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fbf34" />
          <stop offset="1" stopColor="#2c7a17" />
        </linearGradient>
        <linearGradient id="bl-hill" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor="#8ee04f" />
          <stop offset="0.3" stopColor="#62c432" />
          <stop offset="0.75" stopColor="#3a9a1e" />
          <stop offset="1" stopColor="#2a7d14" />
        </linearGradient>
        {/* Sunlit crest along the top of the near hill. */}
        <linearGradient id="bl-crest" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d8ff9e" stopOpacity="0" />
          <stop offset="0.35" stopColor="#d8ff9e" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#d8ff9e" stopOpacity="0.25" />
          <stop offset="1" stopColor="#d8ff9e" stopOpacity="0" />
        </linearGradient>
        {/* Grass: a faint speckle so the hill isn't flat vector green. */}
        <filter id="bl-grass" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.35"
            numOctaves="2"
            seed="5"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.05
                    0 0 0 0 0.25
                    0 0 0 0 0.02
                    0 0 0 0.55 -0.18"
          />
        </filter>
        <clipPath id="bl-hill-clip">
          <path d="M0 640 C 300 470, 760 420, 1130 560 C 1300 622, 1460 640, 1600 628 L1600 1000 L0 1000 Z" />
        </clipPath>
      </defs>

      <g mask="url(#bl-cloud-mask)">
        <rect width="1600" height="720" filter="url(#bl-wisps)" opacity="0.45" />
        <rect width="1600" height="720" filter="url(#bl-clouds)" />
      </g>

      <path
        d="M0 600 C 240 520, 520 548, 780 590 C 1040 632, 1300 540, 1600 566 L1600 1000 L0 1000 Z"
        fill="url(#bl-hill-back)"
      />
      <path
        d="M0 640 C 300 470, 760 420, 1130 560 C 1300 622, 1460 640, 1600 628 L1600 1000 L0 1000 Z"
        fill="url(#bl-hill)"
      />
      <g clipPath="url(#bl-hill-clip)">
        <rect y="420" width="1600" height="580" filter="url(#bl-grass)" />
        <path
          d="M0 640 C 300 470, 760 420, 1130 560 C 1300 622, 1460 640, 1600 628"
          fill="none"
          stroke="url(#bl-crest)"
          strokeWidth="18"
          opacity="0.6"
          style={{ filter: 'blur(5px)' }}
        />
      </g>
    </svg>
  </div>
);

export default BlissWallpaper;
