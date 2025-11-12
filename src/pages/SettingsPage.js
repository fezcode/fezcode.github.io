import React from 'react';
import { useAnimation } from '../context/AnimationContext';
import usePageTitle from '../utils/usePageTitle';

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

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Settings
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Manage your application preferences.
          </p>
        </div>

        <div className="mt-16 max-w-xl mx-auto bg-gray-800/50 p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <label htmlFor="enable-animations" className="text-white text-lg cursor-pointer">
              Enable Animations
            </label>
            <input
              type="checkbox"
              id="enable-animations"
              checked={isAnimationEnabled}
              onChange={toggleAnimation}
              className="toggle toggle-primary"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label htmlFor="show-animations-homepage" className="text-white text-lg cursor-pointer">
              Show animations in homepage
            </label>
            <input
              type="checkbox"
              id="show-animations-homepage"
              checked={showAnimationsHomepage}
              onChange={toggleShowAnimationsHomepage}
              className="toggle toggle-primary"
              disabled={!isAnimationEnabled} // Disable if animations are generally disabled
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="show-animations-inner-pages" className="text-white text-lg cursor-pointer">
              Show animations in inner pages
            </label>
            <input
              type="checkbox"
              id="show-animations-inner-pages"
              checked={showAnimationsInnerPages}
              onChange={toggleShowAnimationsInnerPages}
              className="toggle toggle-primary"
              disabled={!isAnimationEnabled} // Disable if animations are generally disabled
            />
          </div>
          {!isAnimationEnabled && (
            <p className="text-sm text-gray-400 mt-2">
              Animation options are disabled because "Enable Animations" is off.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
