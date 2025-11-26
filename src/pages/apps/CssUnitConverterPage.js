import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const CssUnitConverterPage = () => {
  useSeo({
    title: 'CSS Unit Converter | Fezcodex',
    description:
      'Convert CSS units like px, em, rem, vw, vh, and percentages with this online tool.',
    keywords: [
      'Fezcodex',
      'CSS unit converter',
      'px to rem',
      'em to px',
      'vw to px',
      'css tools',
    ],
    ogTitle: 'CSS Unit Converter | Fezcodex',
    ogDescription:
      'Convert CSS units like px, em, rem, vw, vh, and percentages with this online tool.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'CSS Unit Converter | Fezcodex',
    twitterDescription:
      'Convert CSS units like px, em, rem, vw, vh, and percentages with this online tool.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('px');
  const [basePx, setBasePx] = useState(16); // Default base pixel for rem/em calculations

  const convertUnits = (value, unit, base) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return {
        px: '',
        em: '',
        rem: '',
        vw: '',
        vh: '',
        percent: '',
      };
    }

    let pxValue;
    switch (unit) {
      case 'px':
        pxValue = numValue;
        break;
      case 'em':
      case 'rem':
        pxValue = numValue * base;
        break;
      case 'vw':
        // Assuming a viewport width of 1920px for a common reference
        pxValue = (numValue / 100) * 1920;
        break;
      case 'vh':
        // Assuming a viewport height of 1080px for a common reference
        pxValue = (numValue / 100) * 1080;
        break;
      case 'percent':
        // Percentage is relative, so we need a base. Let's assume 16px for 100%
        pxValue = (numValue / 100) * base;
        break;
      default:
        pxValue = numValue;
    }

    return {
      px: pxValue.toFixed(2),
      em: (pxValue / base).toFixed(2),
      rem: (pxValue / base).toFixed(2),
      vw: ((pxValue / 1920) * 100).toFixed(2),
      vh: ((pxValue / 1080) * 100).toFixed(2),
      percent: ((pxValue / base) * 100).toFixed(2),
    };
  };

  const conversions = convertUnits(inputValue, inputUnit, basePx);

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="CSS Unit Converter" slug="css" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                CSS Unit Converter{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="inputValue"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Value
                  </label>
                  <input
                    type="number"
                    id="inputValue"
                    className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <label
                    htmlFor="inputUnit"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Unit
                  </label>
                  <div className="mt-1">
                    <CustomDropdown
                      options={[
                        { label: 'px', value: 'px' },
                        { label: 'em', value: 'em' },
                        { label: 'rem', value: 'rem' },
                        { label: 'vw', value: 'vw' },
                        { label: 'vh', value: 'vh' },
                        { label: '%', value: 'percent' },
                      ]}
                      value={inputUnit}
                      onChange={setInputUnit}
                      label="Unit"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="basePx"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Base Pixel (for em/rem)
                  </label>
                  <input
                    type="number"
                    id="basePx"
                    className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    value={basePx}
                    onChange={(e) =>
                      setBasePx(parseFloat(e.target.value) || 16)
                    }
                    placeholder="16"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="bg-gray-700 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-400 uppercase">
                      {unit}
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {value}
                      {unit === 'percent' ? '%' : unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">
                  Understanding CSS Units
                </h2>
                <p>
                  CSS units are essential for defining lengths and sizes in web
                  design. They can be broadly categorized into absolute and
                  relative units.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Absolute Units
                </h3>
                <ul>
                  <li>
                    <strong>px (Pixels):</strong> The most common absolute unit.
                    1px is typically 1/96th of an inch. While technically
                    absolute, their rendering can vary slightly across devices
                    due to pixel density.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Relative Units
                </h3>
                <p>
                  Relative units scale relative to another length property,
                  making them excellent for responsive design.
                </p>
                <ul>
                  <li>
                    <strong>em:</strong> Relative to the font-size of the parent
                    element. If the parent has `font-size: 16px`, then `1em`
                    equals `16px`.
                  </li>
                  <li>
                    <strong>rem (Root em):</strong> Relative to the font-size of
                    the root HTML element (`html tag`). This makes `rem` units
                    more predictable than `em` because they don't compound with
                    nested elements.
                  </li>
                  <li>
                    <strong>vw (Viewport Width):</strong> Relative to 1% of the
                    viewport's width. If the viewport is 1000px wide, `1vw` is
                    `10px`.
                  </li>
                  <li>
                    <strong>vh (Viewport Height):</strong> Relative to 1% of the
                    viewport's height. If the viewport is 800px high, `1vh` is
                    `8px`.
                  </li>
                  <li>
                    <strong>% (Percentage):</strong> Can be relative to various
                    properties depending on the context. For font-size, it's
                    relative to the parent's font-size. For width/height, it's
                    relative to the parent's width/height.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  When to Use Which?
                </h3>
                <ul>
                  <li>
                    <strong>`px`</strong> for fixed-size elements or when
                    precise pixel control is needed, though often less flexible
                    for responsiveness.
                  </li>
                  <li>
                    <strong>`rem`</strong> for typography and spacing to
                    maintain a consistent scale across the entire site, easily
                    adjustable by changing the root font-size.
                  </li>
                  <li>
                    <strong>`em`</strong> for components where scaling relative
                    to the immediate parent's font-size is desired (e.g., icons
                    within a button).
                  </li>
                  <li>
                    <strong>`vw` and `vh`</strong> for elements that should
                    scale directly with the viewport dimensions, useful for
                    full-width/height sections or responsive typography.
                  </li>
                  <li>
                    <strong>`%`</strong> for widths, heights, padding, and
                    margins that need to be relative to their parent container.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssUnitConverterPage;
