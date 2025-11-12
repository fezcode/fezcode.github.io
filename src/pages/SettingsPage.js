import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { ArrowLeft } from '@phosphor-icons/react'; // Import ArrowLeft icon
import { useAnimation } from '../context/AnimationContext';
import usePageTitle from '../utils/usePageTitle';
import colors from '../config/colors'; // Import colors
import CustomToggle from '../components/CustomToggle'; // Import CustomToggle

const SettingsPage = () => {
  usePageTitle('Settings');
  const {
    isAnimationEnabled,
    toggleAnimation,
    showAnimationsHomepage,
    toggleShowAnimationsHomepage,
    showAnimationsInnerPages,
    toggleShowAnimationsInnerPages,
  } = useAnimation();

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeft size={24} /> Back to Home
        </Link>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Settings
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Manage your application preferences.
          </p>
        </div>

        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Application Settings </h1>
              <hr className="border-gray-700 mb-4" />

              {/* Client-Side Notification */}
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">Your preferences are stored locally in your browser. No data is sent to any server.</span>
              </div>

              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Animation Settings </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="mb-6 ml-4 mr-4">
                <CustomToggle
                  id="enable-animations"
                  label="> Enable Animations"
                  checked={isAnimationEnabled}
                  onChange={toggleAnimation}
                />
                <div className="ml-8 mt-4"> {/* Indent dependent options */}
                  <CustomToggle
                    id="show-animations-homepage"
                    label=">> Show animations in homepage"
                    checked={showAnimationsHomepage}
                    onChange={toggleShowAnimationsHomepage}
                    disabled={!isAnimationEnabled}
                  />
                  <div className="mb-4"></div> {/* Add vertical space */}
                  <CustomToggle
                    id="show-animations-inner-pages"
                    label=">> Show animations in inner pages"
                    checked={showAnimationsInnerPages}
                    onChange={toggleShowAnimationsInnerPages}
                    disabled={!isAnimationEnabled}
                  />
                </div>
                {!isAnimationEnabled && (
                  <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded relative mt-6" role="alert">
                    <strong className="font-bold">Animations Disabled:</strong>
                    <span className="block sm:inline ml-2">Animation options are disabled because "Enable Animations" is off.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
