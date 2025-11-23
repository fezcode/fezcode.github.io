import React, { useState, useEffect, useRef } from 'react';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 10); // Update every 10ms for smoother display
            }, 10);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = () => {
        const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
        const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
        const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
        const hours = `0${Math.floor(time / 3600000)}`.slice(-2);
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const buttonStyle = "w-24 px-4 py-2 text-lg font-arvo rounded-md border transition-colors duration-300 ease-in-out";
    const activeButtonStyle = "bg-green-800/50 border-green-700 text-white hover:bg-green-700/50";
    const inactiveButtonStyle = "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50";
    const stopButtonStyle = "bg-red-800/50 border-red-700 text-white hover:bg-red-700/50";

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="font-mono text-5xl text-gray-100 p-4 rounded-lg bg-gray-900/50 w-full text-center">
                {formatTime()}
            </div>
            <div className="flex gap-4">
                {!isRunning ? (
                    <button onClick={handleStart} className={`${buttonStyle} ${activeButtonStyle}`}>
                        Start
                    </button>
                ) : (
                    <button onClick={handleStop} className={`${buttonStyle} ${stopButtonStyle}`}>
                        Stop
                    </button>
                )}
                <button onClick={handleReset} className={`${buttonStyle} ${inactiveButtonStyle}`}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Stopwatch;
