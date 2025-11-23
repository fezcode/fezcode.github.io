import React, { useState, useEffect, useRef } from 'react';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [laps, setLaps] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 10);
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
        setLaps([]);
    };
    const handleLap = () => {
        setLaps(prevLaps => [...prevLaps, time]);
    };

    const formatTime = (timeValue) => {
        const milliseconds = `0${(timeValue % 1000) / 10}`.slice(-2);
        const seconds = `0${Math.floor(timeValue / 1000) % 60}`.slice(-2);
        const minutes = `0${Math.floor(timeValue / 60000) % 60}`.slice(-2);
        const hours = `0${Math.floor(timeValue / 3600000)}`.slice(-2);
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const buttonStyle = "w-24 px-4 py-2 text-lg font-arvo rounded-md border transition-colors duration-300 ease-in-out";
    const activeButtonStyle = "bg-green-800/50 border-green-700 text-white hover:bg-green-700/50";
    const inactiveButtonStyle = "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50";
    const stopButtonStyle = "bg-red-800/50 border-red-700 text-white hover:bg-red-700/50";
    const lapButtonStyle = "bg-blue-800/50 border-blue-700 text-white hover:bg-blue-700/50 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="font-mono text-5xl text-gray-100 p-4 rounded-lg bg-gray-900/50 w-full text-center">
                {formatTime(time)}
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
                <button onClick={handleLap} className={`${buttonStyle} ${lapButtonStyle}`} disabled={!isRunning}>
                    Lap
                </button>
                <button onClick={handleReset} className={`${buttonStyle} ${inactiveButtonStyle}`}>
                    Reset
                </button>
            </div>
            {laps.length > 0 && (
                <div className="w-full mt-4 p-4 rounded-lg bg-gray-900/50">
                    <h3 className="text-xl font-arvo text-center text-gray-200 mb-2">Laps</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {laps.map((lapTime, index) => (
                            <li key={index} className="flex justify-between font-mono text-gray-300 p-2 bg-gray-800/50 rounded">
                                <span>Lap {index + 1}</span>
                                <span>{formatTime(lapTime)}</span>
                            </li>
                        )).reverse()}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Stopwatch;
