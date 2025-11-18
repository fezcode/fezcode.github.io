import React from 'react';
import { DiceSix } from '@phosphor-icons/react';
import colors from '../config/colors';

const Dice = ({ value, type, isRolling }) => {
  const diceStyle = {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `2px solid ${colors['app-alpha-50']}`,
    borderRadius: '8px',
    backgroundColor: colors['app-alpha-10'],
    color: colors.app,
    fontSize: '24px',
    fontWeight: 'bold',
    position: 'relative',
    overflow: 'hidden',
  };

  const pipStyle = {
    backgroundColor: colors.app,
    borderRadius: '50%',
    position: 'absolute',
  };

  const renderPips = (num) => {
    const pips = [];
    const pipSize = '10px';
    const offset = '15px';

    const getPipPosition = (position) => {
      switch (position) {
        case 'top-left':
          return { top: offset, left: offset };
        case 'top-center':
          return { top: offset, left: '50%', transform: 'translateX(-50%)' };
        case 'top-right':
          return { top: offset, right: offset };
        case 'middle-left':
          return { top: '50%', left: offset, transform: 'translateY(-50%)' };
        case 'middle-center':
          return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
        case 'middle-right':
          return { top: '50%', right: offset, transform: 'translateY(-50%)' };
        case 'bottom-left':
          return { bottom: offset, left: offset };
        case 'bottom-center':
          return { bottom: offset, left: '50%', transform: 'translateX(-50%)' };
        case 'bottom-right':
          return { bottom: offset, right: offset };
        default:
          return {};
      }
    };

    const pipLayouts = {
      1: ['middle-center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'middle-center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: [
        'top-left',
        'top-right',
        'middle-center',
        'bottom-left',
        'bottom-right',
      ],
      6: [
        'top-left',
        'top-right',
        'middle-left',
        'middle-right',
        'bottom-left',
        'bottom-right',
      ],
    };

    if (pipLayouts[num]) {
      pipLayouts[num].forEach((pos, index) => {
        pips.push(
          <div
            key={index}
            style={{
              ...pipStyle,
              ...getPipPosition(pos),
              width: pipSize,
              height: pipSize,
            }}
          />,
        );
      });
    }
    return pips;
  };

  if (isRolling) {
    return (
      <div className="dice-face rolling" style={diceStyle}>
        <DiceSix size={48} color={colors.app} />
      </div>
    );
  } else if (type === 6) {
    return (
      <div className="dice-face" style={diceStyle}>
        {renderPips(value)}
      </div>
    );
  } else {
    return (
      <div className="dice-face" style={diceStyle}>
        {value}
      </div>
    );
  }
};

export default Dice;
