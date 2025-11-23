import React, { useState, useEffect } from 'react';

// AnalogClock component to render a single clock
const AnalogClock = ({ time, title }) => {
    const getHandRotations = (date) => {
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hours = date.getHours();

        const secondsDeg = (seconds / 60) * 360;
        const minutesDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hoursDeg = (hours / 12) * 360 + (minutes / 60) * 30;

        return { secondsDeg, minutesDeg, hoursDeg };
    };

    const { secondsDeg, minutesDeg, hoursDeg } = getHandRotations(time);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Clock face */}
                <circle cx="100" cy="100" r="98" fill="#1F2937" stroke="#9CA3AF" strokeWidth="4" />
                {/* Hour markers */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <line
                        key={i}
                        x1="100"
                        y1="10"
                        x2="100"
                        y2="20"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        transform={`rotate(${i * 30} 100 100)`}
                    />
                ))}

                {/* Hour Hand */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="50"
                    stroke="#FBBF24"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{ transformOrigin: 'center', transform: `rotate(${hoursDeg}deg)` }}
                />
                {/* Minute Hand */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke="#A7F3D0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ transformOrigin: 'center', transform: `rotate(${minutesDeg}deg)` }}
                />
                {/* Second Hand */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="20"
                    stroke="#F87171"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transformOrigin: 'center', transform: `rotate(${secondsDeg}deg)` }}
                />
                {/* Center dot */}
                <circle cx="100" cy="100" r="5" fill="#FBBF24" />
            </svg>
        </div>
    );
};

// Main LiveClock component to manage time state
const LiveClock = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    // Create a date object for UTC time
    const utcDate = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    return (
        <div className="flex justify-center gap-8 p-4">
            <AnalogClock time={now} title="Local Time" />
            <AnalogClock time={utcDate} title="UTC Time" />
        </div>
    );
};

export default LiveClock;
