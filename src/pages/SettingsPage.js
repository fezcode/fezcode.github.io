import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@phosphor-icons/react';
import {useAnimation} from '../context/AnimationContext';
import {useVisualSettings} from '../context/VisualSettingsContext';
import colors from '../config/colors';
import CustomToggle from '../components/CustomToggle';
import useSeo from '../hooks/useSeo';
import {useToast} from '../hooks/useToast';
import {
  KEY_SIDEBAR_STATE, KEY_APPS_COLLAPSED_CATEGORIES, remove as removeLocalStorageItem,
} from '../utils/LocalStorageManager';

const SettingsPage = () => {
  useSeo({
    title: 'Settings | Fezcodex',
    description: 'Manage your application preferences for Fezcodex.',
    keywords: ['Fezcodex', 'settings', 'preferences', 'animation'],
    ogTitle: 'Settings | Fezcodex',
    ogDescription: 'Manage your application preferences for Fezcodex.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Settings | Fezcodex',
    twitterDescription: 'Manage your application preferences for Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const {
    isAnimationEnabled,
    toggleAnimation,
    showAnimationsHomepage,
    toggleShowAnimationsHomepage,
    showAnimationsInnerPages,
    toggleShowAnimationsInnerPages,
  } = useAnimation();

  const {
    isInverted, toggleInvert,
    isRetro, toggleRetro,
    isParty, toggleParty,
    isMirror, toggleMirror,
    isNoir, toggleNoir
  } = useVisualSettings();
  const {addToast} = useToast();
  const handleResetSidebarState = () => {
    removeLocalStorageItem(KEY_SIDEBAR_STATE);
    addToast({
      title: 'Success',
      message: 'Sidebar state has been reset. The page will now reload.',
      duration: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'Success',
      message: 'App categories state has been reset. The page will now reload.',
      duration: 3000,
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link to="/"
              className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1"/> Back to Home
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                Application Settings
              </h1>
              <hr className="border-gray-700 mb-4"/>
              {/* Client-Side Notification */}
              <div
                className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">
                    Your preferences are stored locally in your browser. No data
                    is sent to any server.
                  </span>
              </div>
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                Animation Settings
              </h1>
              <hr className="border-gray-700 mb-4"/>
              <div className="mb-6 ml-4 mr-4">
                <CustomToggle
                  id="enable-animations"
                  label="> Enable Animations"
                  checked={isAnimationEnabled}
                  onChange={toggleAnimation}
                />
                <div className="ml-8 mt-4">
                  {' '}
                  {/* Indent dependent options */}
                  <CustomToggle
                    id="show-animations-homepage"
                    label=">> Show animations in homepage"
                    checked={showAnimationsHomepage}
                    onChange={toggleShowAnimationsHomepage}
                    disabled={!isAnimationEnabled}
                  />
                  <div className="mb-4"></div>
                  {/* Add vertical space */}
                  <CustomToggle
                    id="show-animations-inner-pages"
                    label=">> Show animations in inner pages"
                    checked={showAnimationsInnerPages}
                    onChange={toggleShowAnimationsInnerPages}
                    disabled={!isAnimationEnabled}
                  />
                </div>
                {!isAnimationEnabled && (
                  <div
                    className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded relative mt-6"
                    role="alert"
                  >
                    <strong className="font-bold">Animations Disabled:</strong>
                    <span className="block sm:inline ml-2">
                        Animation options are disabled because "Enable Animations"
                        is off.
                      </span>
                  </div>
                )}
              </div>
              {/* Visual Effects Settings */}
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                Visual Effects
              </h1>
              <hr className="border-gray-700 mb-4"/>
              <div className="mb-6 ml-4 mr-4">
                <CustomToggle
                  id="enable-invert-colors"
                  label="> Invert Colors"
                  checked={isInverted}
                  onChange={toggleInvert}
                />
                <div className="mb-4"></div>
                <CustomToggle
                  id="enable-retro-mode"
                  label="> Retro Mode"
                  checked={isRetro}
                  onChange={toggleRetro}
                />
                <div className="mb-4"></div>
                <CustomToggle
                  id="enable-party-mode"
                  label="> Party Mode"
                  checked={isParty}
                  onChange={toggleParty}
                />
                <div className="mb-4"></div>
                <CustomToggle
                  id="enable-mirror-mode"
                  label="> Mirror Mode"
                  checked={isMirror}
                  onChange={toggleMirror}
                />
                <div className="mb-4"></div>
                <CustomToggle
                  id="enable-noir-mode"
                  label="> Noir Mode"
                  checked={isNoir}
                  onChange={toggleNoir}
                />

              </div>
              {/* Sidebar Stuff */}
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                Sidebar Settings
              </h1>
              <hr className="border-gray-700 mb-4"/>
              <div className="mb-6 ml-4 mr-4">
                <p className="text-gray-300 mb-4">
                  Reset the open/closed state of all sidebar sections to their
                  default.
                </p>
                <button
                  onClick={handleResetSidebarState}
                  className="px-6 py-2 rounded-md font-arvo font-normal transition-colors duration-300 ease-in-out border bg-red-800/50 text-white hover:bg-red-700/50 border-red-700"
                >
                  Reset Sidebar State
                </button>
              </div>

              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                App Page Settings
              </h1>
              <hr className="border-gray-700 mb-4"/>
              <div className="mb-6 ml-4 mr-4">
                <p className="text-gray-300 mb-4">
                  Reset the open/closed state of all app categories to their
                  default.
                </p>
                <button
                  onClick={handleResetAppsState}
                  className="px-6 py-2 rounded-md font-arvo font-normal transition-colors duration-300 ease-in-out border bg-red-800/50 text-white hover:bg-red-700/50 border-red-700"
                >
                  Reset App Categories State
                </button>
              </div>

              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                Local Storage Management
              </h1>
              <hr className="border-gray-700 mb-4"/>
              <div className="mb-6 ml-4 mr-4">
                <p className="text-gray-300 mb-4">
                  Clear all local storage data for this site. This will reset
                  all your preferences and cached data.
                </p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    addToast({
                      title: 'Success',
                      message: 'All local storage data has been cleared. The page will now reload.',
                      duration: 3000,
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                  }}
                  className="px-6 py-2 rounded-md font-arvo font-normal transition-colors duration-300 ease-in-out border bg-red-800/50 text-white hover:bg-red-700/50 border-red-700"
                >
                  Clear All Local Storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};

export default SettingsPage;
