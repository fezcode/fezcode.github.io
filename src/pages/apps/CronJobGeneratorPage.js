import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimple } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';

const CronJobGeneratorPage = () => {
  useSeo({
    title: 'CRON Job Generator | Fezcodex',
    description: 'Generate CRON expressions visually.',
    keywords: [
      'Fezcodex',
      'cron job',
      'cron generator',
      'scheduler',
      'automation',
    ],
    ogTitle: 'CRON Job Generator | Fezcodex',
    ogDescription: 'Generate CRON expressions visually.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'CRON Job Generator | Fezcodex',
    twitterDescription: 'Generate CRON expressions visually.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  // --- CRON Generator State ---
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [generatedCron, setGeneratedCron] = useState('');
  const [generatedCronDescription, setGeneratedCronDescription] = useState('');

  // --- CRON Generator Logic ---
  const generateCronExpression = useCallback(() => {
    const cronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setGeneratedCron(cronString);
    setGeneratedCronDescription(
      getHumanReadableDescription(minute, hour, dayOfMonth, month, dayOfWeek),
    );
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  // Helper function to get human-readable description
  const getHumanReadableDescription = (min, hr, dom, mon, dow) => {
    let description = 'Runs ';

    // Minute
    if (min === '*') {
      description += 'every minute ';
    } else if (min.includes('/')) {
      description += `every ${min.split('/')[1]} minutes `;
    } else {
      description += `at minute ${min} `;
    }

    // Hour
    if (hr === '*') {
      if (min !== '*') description += 'of every hour ';
    } else if (hr.includes('/')) {
      description += `every ${hr.split('/')[1]} hours `;
    } else {
      description += `at hour ${hr} `;
    }

    // Day of Month
    if (dom === '*') {
      if (hr !== '*' || min !== '*') description += 'every day ';
    } else {
      description += `on day ${dom} `;
    }

    // Month
    if (mon === '*') {
      if (dom !== '*' || hr !== '*' || min !== '*')
        description += 'of every month ';
    } else {
      const monthName = monthNames[parseInt(mon, 10)];
      description += `in ${monthName} `;
    }

    // Day of Week
    if (dow === '*') {
      if (mon !== '*' || dom !== '*' || hr !== '*' || min !== '*')
        description += 'of every day of the week.';
    } else {
      const dayName = dayOfWeekNames[parseInt(dow, 10)];
      description += `on ${dayName}.`;
    }

    return description.trim();
  };

  useEffect(() => {
    generateCronExpression();
  }, [generateCronExpression]);

  // --- Utility Functions ---
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // addToast({ title: 'Success', message: 'Copied to clipboard!', duration: 2000 });
      })
      .catch(() => {
        // addToast({ title: 'Error', message: 'Failed to copy!', duration: 2000 });
      });
  };

  const renderOptions = (start, end) => {
    const options = ['*'];
    for (let i = start; i <= end; i++) {
      options.push(i.toString());
    }
    return options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ));
  };

  const monthNames = [
    '*',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayOfWeekNames = ['*', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const inputStyle = `mt-1 block w-full p-2 border rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 border-gray-600`;
  const selectStyle = `mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500`;
  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15`;

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
          <span className="single-app-color">cron</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-6xl"
            style={{
              backgroundColor: 'var(--app-alpha-10)',
              borderColor: 'var(--app-alpha-50)',
              color: 'var(--app)',
            }}
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
                CRON Job Generator{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />

              {/* CRON Generator Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-arvo font-normal mb-4 text-app">
                  Generate CRON Expression
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Minute
                    </label>
                    <select
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className={selectStyle}
                    >
                      {renderOptions(0, 59)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Hour
                    </label>
                    <select
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className={selectStyle}
                    >
                      {renderOptions(0, 23)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Day of Month
                    </label>
                    <select
                      value={dayOfMonth}
                      onChange={(e) => setDayOfMonth(e.target.value)}
                      className={selectStyle}
                    >
                      {renderOptions(1, 31)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className={selectStyle}
                    >
                      {monthNames.map((name, index) => (
                        <option key={name} value={index === 0 ? '*' : index}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Day of Week
                    </label>
                    <select
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(e.target.value)}
                      className={selectStyle}
                    >
                      {dayOfWeekNames.map((name, index) => (
                        <option key={name} value={index === 0 ? '*' : index}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                  <span className="font-mono text-lg text-green-400">
                    {generatedCron}
                  </span>
                  <button
                    onClick={() => copyToClipboard(generatedCron)}
                    className="p-2 rounded-full hover:bg-gray-700"
                  >
                    <CopySimple size={20} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {generatedCronDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronJobGeneratorPage;
