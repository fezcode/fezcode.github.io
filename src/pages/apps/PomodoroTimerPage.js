import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PlayIcon, PauseIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const PomodoroTimerPage = () => {
  useSeo({
    title: 'Pomodoro Timer | Fezcodex',
    description: 'A simple and customizable Pomodoro timer to boost your productivity.',
    keywords: ['Fezcodex', 'pomodoro', 'timer', 'productivity'],
    ogTitle: 'Pomodoro Timer | Fezcodex',
    ogDescription: 'A simple and customizable Pomodoro timer to boost your productivity.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Pomodoro Timer | Fezcodex',
    twitterDescription: 'A simple and customizable Pomodoro timer to boost your productivity.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (audioRef.current) {
              audioRef.current.play();
            }

            if (mode === 'work') {
              const newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);
              addToast({ title: 'Pomodoro', message: "Work session finished! It's time for a break." });
              if (newPomodoroCount % 4 === 0) {
                selectMode('longBreak');
              } else {
                selectMode('shortBreak');
              }
            } else {
              addToast({ title: 'Pomodoro', message: "Break's over! Time to get back to work." });
              selectMode('work');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode, pomodoroCount, addToast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else if (mode === 'shortBreak') {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const selectMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'work':
        setMinutes(25);
        break;
      case 'shortBreak':
        setMinutes(5);
        break;
      case 'longBreak':
        setMinutes(15);
        break;
      default:
        setMinutes(25);
    }
    setSeconds(0);
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Pomodoro Timer" slug="pomodoro" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-md">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="relative z-10 p-4 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">Pomodoro Timer</h1>
              <hr className="border-gray-700 mb-6" />
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => selectMode('work')} className={`px-4 py-2 rounded-md font-semibold ${mode === 'work' ? 'bg-app text-white' : 'bg-tb text-app border-app-alpha-50 hover:bg-app/15 border'}`}>Pomodoro</button>
                <button onClick={() => selectMode('shortBreak')} className={`px-4 py-2 rounded-md font-semibold ${mode === 'shortBreak' ? 'bg-app text-white' : 'bg-tb text-app border-app-alpha-50 hover:bg-app/15 border'}`}>Short Break</button>
                <button onClick={() => selectMode('longBreak')} className={`px-4 py-2 rounded-md font-semibold ${mode === 'longBreak' ? 'bg-app text-white' : 'bg-tb text-app border-app-alpha-50 hover:bg-app/15 border'}`}>Long Break</button>
              </div>
              <div className="text-8xl font-mono font-bold text-app-light mb-8">
                {formatTime(minutes)}:{formatTime(seconds)}
              </div>
              <div className="flex justify-center gap-6">
                <button onClick={toggleTimer} className="p-4 rounded-full bg-tb text-app border-app-alpha-50 hover:bg-app/15 border">
                  {isActive ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
                </button>
                <button onClick={resetTimer} className="p-4 rounded-full bg-tb text-app border-app-alpha-50 hover:bg-app/15 border">
                  <ArrowCounterClockwiseIcon size={32} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src="/sounds/notification.mp3" />
    </div>
  );
};

export default PomodoroTimerPage;
