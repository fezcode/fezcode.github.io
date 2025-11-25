import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon
} from '@phosphor-icons/react';

import useSeo from '../hooks/useSeo';

import colors from "../config/colors"; // Import CustomDropdown

function CommandsPage() {
  useSeo({
    title: 'All Commands | Fezcodex',
    description: 'All the available commands that can be used in Fezcodex.',
    keywords: [
      'Fezcodex',
      'apps',
      'applications',
      'cmd',
      'dev',
      'commands',
    ],
    ogTitle: 'All Commands | Fezcodex',
    ogDescription: 'All the available commands that can be used in Fezcodex.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'All Commands | Fezcodex',
    twitterDescription: 'All the available commands that can be used in Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

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
          <ArrowLeftIcon size={24} /> Back to Home
        </Link>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Command Palette </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="mb-6 ml-4 mr-4">
                <p className="text-gray-200 mb-4">
                  Press <kbd className="kbd kbd-sm">Alt</kbd>+<kbd className="kbd kbd-sm">K</kbd> to open Commands Palette.
                  You can type <code> COMMAND </code> to see all available commands.
                </p>
              </div>

              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Available Commands </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">View Source on GitHub:</strong>
                <span className="block sm:inline ml-2"> See source code of Fezcodex on GitHub </span>
              </div>

              <div className="bg-orange-900 bg-opacity-30 border border-orange-700 text-orange-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Navigate to a Random Post:</strong>
                <span className="block sm:inline ml-2"> Go to random blogpost. </span>
              </div>

              <div className="bg-amber-900 bg-opacity-30 border border-amber-700 text-amber-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Toggle Animations:</strong>
                <span className="block sm:inline ml-2"> Enable/Disable all animations in Fezcodex. </span>
              </div>

              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Reset Sidebar State:</strong>
                <span className="block sm:inline ml-2"> Remove all sidebar states. </span>
              </div>

              <div className="bg-lime-900 bg-opacity-30 border border-lime-700 text-lime-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Send Email:</strong>
                <span className="block sm:inline ml-2"> Send me email. </span>
              </div>

              <div className="bg-green-900 bg-opacity-30 border border-green-700 text-green-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Open GitHub Profile:</strong>
                <span className="block sm:inline ml-2"> Opens Github profile of Fezcode. </span>
              </div>

              <div className="bg-emerald-900 bg-opacity-30 border border-emerald-700 text-emerald-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Open Twitter Profile:</strong>
                <span className="block sm:inline ml-2"> Opens Twitter profile of Fezcode. </span>
              </div>

              <div className="bg-teal-900 bg-opacity-30 border border-teal-700 text-teal-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Open LinkedIn Profile:</strong>
                <span className="block sm:inline ml-2"> Opens LinkedIn profile of Fezcode. </span>
              </div>

              <div className="bg-cyan-900 bg-opacity-30 border border-cyan-700 text-cyan-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Scroll to Top:</strong>
                <span className="block sm:inline ml-2"> Go to the top of the page. </span>
              </div>

              <div className="bg-sky-900 bg-opacity-30 border border-sky-700 text-sky-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Scroll to Bottom:</strong>
                <span className="block sm:inline ml-2"> Go to the bottom of the page. </span>
              </div>

              <div className="bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Show Site Stats:</strong>
                <span className="block sm:inline ml-2"> Opens a modal to show number of Posts, Projects, Logs and Apps. </span>
              </div>

              <div className="bg-indigo-900 bg-opacity-30 border border-indigo-700 text-indigo-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Show Version:</strong>
                <span className="block sm:inline ml-2"> Opens a modal to show version number of Fezcodex. </span>
              </div>

              <div className="bg-violet-900 bg-opacity-30 border border-violet-700 text-violet-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Go to Latest Post:</strong>
                <span className="block sm:inline ml-2"> Opens the latest blogpost. </span>
              </div>

              <div className="bg-purple-900 bg-opacity-30 border border-purple-700 text-purple-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Go to Latest Log:</strong>
                <span className="block sm:inline ml-2"> Opens the latest log entry. </span>
              </div>

              <div className="bg-fuchsia-900 bg-opacity-30 border border-fuchsia-700 text-fuchsia-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Show Current Time:</strong>
                <span className="block sm:inline ml-2"> Opens a modal to show local and UTC analog clock. </span>
              </div>

              <div className="bg-pink-900 bg-opacity-30 border border-pink-700 text-pink-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Toggle Digital Rain:</strong>
                <span className="block sm:inline ml-2"> Opens matrix-like text rain, you need to toggle again to disable it, or refresh the page. </span>
              </div>

              <div className="bg-rose-900 bg-opacity-30 border border-rose-700 text-rose-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Generate Art:</strong>
                <span className="block sm:inline ml-2"> Opens a modal to display a simple generative box art. </span>
              </div>

              <div className="bg-slate-900 bg-opacity-30 border border-slate-700 text-slate-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Leet Speak Transformer:</strong>
                <span className="block sm:inline ml-2"> Opens a modal convert given text to Leet speak. </span>
              </div>

              <div className="bg-gray-900 bg-opacity-30 border border-gray-700 text-gray-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Show Quick Stopwatch:</strong>
                <span className="block sm:inline ml-2"> Opens a modal for stopwatch, similar to stopwatch app. </span>
              </div>

              <div className="bg-zinc-900 bg-opacity-30 border border-zinc-700 text-zinc-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Show User/Browser Information:</strong>
                <span className="block sm:inline ml-2"> Opens a modal to show User Agent, Platform, App Version, Language and Online information. </span>
              </div>

              <div className="bg-neutral-900 bg-opacity-30 border border-neutral-700 text-neutral-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Copy Current URL:</strong>
                <span className="block sm:inline ml-2"> Copies the current URL to your clipboard. </span>
              </div>

              <div className="bg-stone-900 bg-opacity-30 border border-stone-700 text-stone-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Clear Local Storage:</strong>
                <span className="block sm:inline ml-2"> Removes every entry about Fezcodes in your browser's local storage. </span>
              </div>

              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Reload Page:</strong>
                <span className="block sm:inline ml-2"> Reloads the current page. </span>
              </div>

              <div className="bg-orange-900 bg-opacity-30 border border-orange-700 text-orange-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Go to Random App:</strong>
                <span className="block sm:inline ml-2"> Opens an app randomly. </span>
              </div>

              <div className="bg-amber-900 bg-opacity-30 border border-amber-700 text-amber-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Toggle Full Screen:</strong>
                <span className="block sm:inline ml-2"> Goes to fullscreen mode. </span>
              </div>

              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Create Issue for This Page:</strong>
                <span className="block sm:inline ml-2"> Opens Github Issues page to create an issue for the current URL. </span>
              </div>

              <div className="bg-lime-900 bg-opacity-30 border border-lime-700 text-lime-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Her Daim:</strong>
                <span className="block sm:inline ml-2"> Show image of `Devir Abi`. </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandsPage;
