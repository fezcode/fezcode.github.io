import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  CalendarIcon,
  ClockIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';

const CronJobGeneratorPage = () => {
  const appName = 'CRON Generator';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Visual protocol for scheduling repetitive tasks and temporal automation.',
    keywords: [
      'Fezcodex',
      'cron job',
      'cron generator',
      'scheduler',
      'automation',
    ],
  });

  const { addToast } = useToast();

  // --- CRON Generator State ---
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [generatedCron, setGeneratedCron] = useState('');
  const [generatedCronDescription, setGeneratedCronDescription] = useState('');

  // --- CRON Generator Logic ---
  const monthNames = React.useMemo(
    () => [
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
    ],
    [],
  );
  const dayOfWeekNames = React.useMemo(
    () => ['*', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    [],
  );

  const getHumanReadableDescription = useCallback(
    (min, hr, dom, mon, dow) => {
      let description = 'Runs ';

      if (min === '*') description += 'every minute ';
      else if (min.includes('/'))
        description += `every ${min.split('/')[1]} minutes `;
      else description += `at minute ${min} `;

      if (hr === '*') {
        if (min !== '*') description += 'of every hour ';
      } else if (hr.includes('/'))
        description += `every ${hr.split('/')[1]} hours `;
      else description += `at hour ${hr} `;

      if (dom === '*') {
        if (hr !== '*' || min !== '*') description += 'every day ';
      } else description += `on day ${dom} `;

      if (mon === '*') {
        if (dom !== '*' || hr !== '*' || min !== '*')
          description += 'of every month ';
      } else {
        const monthName = monthNames[parseInt(mon, 10)];
        description += `in ${monthName} `;
      }

      if (dow === '*') {
        if (mon !== '*' || dom !== '*' || hr !== '*' || min !== '*')
          description += 'of every day of the week.';
      } else {
        const dayName = dayOfWeekNames[parseInt(dow, 10)];
        description += `on ${dayName}.`;
      }

      return description.trim();
    },
    [dayOfWeekNames, monthNames],
  );

  const generateCronExpression = useCallback(() => {
    const cronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setGeneratedCron(cronString);
    setGeneratedCronDescription(
      getHumanReadableDescription(minute, hour, dayOfMonth, month, dayOfWeek),
    );
  }, [minute, hour, dayOfMonth, month, dayOfWeek, getHumanReadableDescription]);

  useEffect(() => {
    generateCronExpression();
  }, [generateCronExpression]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Success',
        message: 'CRON sequence stored in clipboard.',
        duration: 2000,
      });
    });
  };

  const getNumericOptions = (start, end) => {
    const options = [{ label: '*', value: '*' }];
    for (let i = start; i <= end; i++) {
      options.push({ label: i.toString(), value: i.toString() });
    }
    return options;
  };

  const getMonthOptions = () =>
    monthNames.map((name, index) => ({
      label: name,
      value: index === 0 ? '*' : index.toString(),
    }));

  const getDayOfWeekOptions = () =>
    dayOfWeekNames.map((name, index) => ({
      label: name,
      value: index === 0 ? '*' : index.toString(),
    }));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Visual protocol for temporal scheduling. Map the frequency of
                automated executions within the system core.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Output Display */}
          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity duration-700">
                <GenerativeArt seed={generatedCron} className="w-full h-full" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em]">
                    {'//'} GENERATED_SEQUENCE
                  </span>
                  <div className="text-5xl md:text-7xl font-black tracking-tighter text-white font-mono break-all">
                    {generatedCron}
                  </div>
                  <p className="text-xl text-gray-400 font-light max-w-3xl leading-relaxed">
                    {generatedCronDescription}
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(generatedCron)}
                  className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-500 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
                >
                  <CopySimpleIcon weight="bold" size={24} />
                  <span>Copy Sequence</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parameters Section */}
          <div className="lg:col-span-12">
            <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <ClockIcon weight="fill" />
                Temporal_Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
                {[
                  {
                    label: 'Minutes',
                    value: minute,
                    onChange: setMinute,
                    options: getNumericOptions(0, 59),
                  },
                  {
                    label: 'Hours',
                    value: hour,
                    onChange: setHour,
                    options: getNumericOptions(0, 23),
                  },
                  {
                    label: 'Day of Month',
                    value: dayOfMonth,
                    onChange: setDayOfMonth,
                    options: getNumericOptions(1, 31),
                  },
                  {
                    label: 'Month',
                    value: month,
                    onChange: setMonth,
                    options: getMonthOptions(),
                  },
                  {
                    label: 'Day of Week',
                    value: dayOfWeek,
                    onChange: setDayOfWeek,
                    options: getDayOfWeekOptions(),
                  },
                ].map((param) => (
                  <div key={param.label} className="space-y-4">
                    <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      {param.label}
                    </label>
                    <CustomDropdown
                      variant="brutalist"
                      options={param.options}
                      value={param.value}
                      onChange={param.onChange}
                      label={param.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-12">
            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <CalendarIcon size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                CRON notation is a standard syntax for mapping time-based
                events. The asterisk (*) acts as a wildcard, while numeric
                sequences define specific activation points within the temporal
                matrix.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Temporal_Scheduler_v0.6.1</span>
          <span className="text-gray-800">AUTOMATION_CORE // READY</span>
        </footer>
      </div>
    </div>
  );
};

export default CronJobGeneratorPage;
