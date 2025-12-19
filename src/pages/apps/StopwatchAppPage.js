import React from 'react';
import Stopwatch from '../../components/Stopwatch';
import useSeo from '../../hooks/useSeo';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';

const StopwatchAppPage = () => {
  useSeo({
    title: 'Stopwatch App | Fezcodex',
    description: 'A simple and clean stopwatch with lap functionality.',
    keywords: ['stopwatch', 'timer', 'utility', 'time', 'lap timer'],
  });

  return (
    <div className="py-16 sm:py-24 flex flex-col items-center justify-center">
      <Link
        to="/apps"
        className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
      >
        <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
        Back to Apps
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Stopwatch
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          A simple utility to measure time and record laps.
        </p>
      </div>
      <Stopwatch />
    </div>
  );
};

export default StopwatchAppPage;
