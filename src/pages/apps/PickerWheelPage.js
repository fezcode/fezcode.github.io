import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import PickerWheel from '../../components/PickerWheel';
import useSeo from "../../hooks/useSeo";

function PickerWheelPage() {
  useSeo({
    title: 'Picker Wheel | Fezcodex',
    description: 'A customizable picker wheel to make decisions or select random items from a list.',
    keywords: ['Fezcodex', 'picker wheel', 'decision maker', 'random selector', 'wheel spinner'],
    ogTitle: 'Picker Wheel | Fezcodex',
    ogDescription: 'A customizable picker wheel to make decisions or select random items from a list.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Picker Wheel | Fezcodex',
    twitterDescription: 'A customizable picker wheel to make decisions or select random items from a list.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">pw</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <PickerWheel />
        </div>
      </div>
    </div>
  );
}

export default PickerWheelPage;
