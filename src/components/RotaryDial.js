import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

const RotaryDial = ({ onDial }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDigit, setActiveDigit] = useState(null);
  const rotation = useMotionValue(0);
  const containerRef = useRef(null); // Ref for the static container
  const animationControls = useRef(null);

  // Configuration
  const STOP_ANGLE = 60; // Angle of the finger stop (in degrees, 0 is 3 o'clock)
  const GAP = 30; // Degrees between numbers
  // Numbers 1-9, 0. '1' is closest to stop.
  const DIGITS = React.useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], []);

  const getDigitAngle = React.useCallback((digit) => {
    const index = DIGITS.indexOf(digit);
    return STOP_ANGLE - (index + 1) * GAP;
  }, [DIGITS]);

  const getAngle = (event, center) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const dx = clientX - center.x;
    const dy = clientY - center.y;
    let theta = Math.atan2(dy, dx) * (180 / Math.PI);
    return theta;
  };

  const handleStart = (event, digit) => {
    // Only prevent default on touch to stop scrolling
    if (event.touches && event.cancelable) event.preventDefault();

    // Stop any ongoing spring-back animation
    if (animationControls.current) {
      animationControls.current.stop();
    }

    setIsDragging(true);
    setActiveDigit(digit);
  };

  const handleMove = React.useCallback((event) => {
    if (!isDragging || activeDigit === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const currentMouseAngle = getAngle(event, center);
    const startAngle = getDigitAngle(activeDigit);
    let newRotation = currentMouseAngle - startAngle;

    const normalizeDiff = (diff) => {
      while (diff <= -180) diff += 360;
      while (diff > 180) diff -= 360;
      return diff;
    };

    newRotation = normalizeDiff(newRotation);

    const maxRot = STOP_ANGLE - startAngle;

    // If rotation is negative, it might be because we've crossed the 180 boundary
    // for a high number digit (like 9 or 0).
    // Check if adding 360 brings us into a valid positive range close to maxRot.
    // We allow a small buffer over maxRot for elasticity.
    if (newRotation < 0 && newRotation + 360 <= maxRot + 30) {
      newRotation += 360;
    }

    // Clamp
    if (newRotation < -10) newRotation = -10;
    if (newRotation > maxRot) newRotation = maxRot;

    rotation.set(newRotation);
  }, [activeDigit, isDragging, rotation, getDigitAngle]);

  const handleEnd = React.useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const maxRot = STOP_ANGLE - getDigitAngle(activeDigit);
    const threshold = 15;

    const currentRot = rotation.get();

    if (Math.abs(currentRot - maxRot) < threshold) {
      if (onDial) onDial(activeDigit);
    }

    setActiveDigit(null);

    // Animate back to 0
    animationControls.current = animate(rotation, 0, {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 1,
    });
  }, [activeDigit, isDragging, onDial, rotation, getDigitAngle]);

  useEffect(() => {
    const onMove = (e) => handleMove(e);
    const onUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-80 h-80 sm:w-96 sm:h-96 select-none"
    >
      <div className="absolute inset-0 rounded-full bg-gray-900 border-4 border-gray-700 shadow-2xl">
        {DIGITS.map((digit) => {
          const angle = getDigitAngle(digit);
          return (
            <div
              key={`num-${digit}`}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="text-3xl font-bold text-white font-mono"
                style={{ transform: `translate(${140}%) rotate(${-angle}deg)` }}
              >
                {digit}
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent"
        style={{ rotate: rotation }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-inner backdrop-blur-sm border border-gray-600">
          <div className="absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center shadow-lg">
            <div className="text-gray-500 text-xs font-mono text-center opacity-50">
              FEZ
              <br />
              CODE
            </div>
          </div>

          {DIGITS.map((digit) => {
            const angle = getDigitAngle(digit);
            return (
              <div
                key={`hole-${digit}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 transition-colors duration-200 cursor-pointer pointer-events-auto
                                   ${activeDigit === digit ? 'bg-primary-500/20 border-primary-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-950/50 border-gray-600 hover:border-gray-400'}
                                   flex items-center justify-center shadow-inner`}
                  style={{ transform: `translate(${140}%)` }}
                  onMouseDown={(e) => handleStart(e, digit)}
                  onTouchStart={(e) => handleStart(e, digit)}
                ></div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ transform: `rotate(${STOP_ANGLE}deg)` }}
      >
        <div className="absolute top-1/2 right-0 w-16 h-4 bg-gradient-to-r from-gray-400 to-gray-200 rounded-l-lg shadow-lg origin-right translate-x-2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default RotaryDial;
