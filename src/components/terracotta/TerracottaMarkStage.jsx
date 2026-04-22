import React from 'react';
import TerracottaMark from './TerracottaMark';

/**
 * The dark ink showcase block. A single focal feature (project, mark, hero item)
 * is presented on one side; construction notes on the other, separated by a
 * faint vertical guide line.
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │                                │                           │
 *   │       ▼ MARK / FEATURE         │   CONSTRUCTION NOTES      │
 *   │                                │   FORM     …              │
 *   │                                │   RATIO    …              │
 *   │                                │   STATUS   …              │
 *   └────────────────────────────────────────────────────────────┘
 */
const TerracottaMarkStage = ({
  markSlot,
  notesTitle = 'Construction notes',
  notes = [],
  caption,
  className = '',
}) => (
  <div
    className={`relative overflow-hidden bg-[#1A1613] text-[#F3ECE0] px-8 md:px-20 py-20 md:py-[140px] grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center shadow-[0_40px_80px_-40px_#1A161340] ${className}`}
    style={{
      borderRadius: 4,
      backgroundImage:
        'radial-gradient(600px 400px at 30% 40%, rgba(201,100,66,0.08) 0%, transparent 60%), radial-gradient(400px 300px at 80% 80%, rgba(184,133,50,0.08) 0%, transparent 60%)',
    }}
  >
    {/* vertical guide */}
    <div
      aria-hidden="true"
      className="hidden md:block absolute left-1/2 top-[60px] bottom-[60px] w-px"
      style={{
        background:
          'linear-gradient(to bottom, transparent, rgba(243,236,224,0.14) 30%, rgba(243,236,224,0.22) 70%, transparent)',
      }}
    />

    {/* left: mark or featured slot */}
    <div className="relative flex items-center justify-center min-h-[260px]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -bottom-5 w-px md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(243,236,224,0.14) 30%, rgba(243,236,224,0.22) 70%, transparent)',
        }}
      />
      {markSlot || (
        <TerracottaMark
          size={240}
          color="#C96442"
          className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
        />
      )}
    </div>

    {/* right: construction notes */}
    <div className="relative font-ibm-plex-mono text-[11px] leading-[1.8] tracking-[0.02em] text-[#F3ECE0]/75">
      {notesTitle && (
        <h4
          className="font-fraunces text-[18px] text-[#F3ECE0] mb-3.5 tracking-[-0.01em]"
          style={{ fontVariationSettings: '"opsz" 14, "wght" 520' }}
        >
          {notesTitle}
        </h4>
      )}
      <ul className="list-none p-0 m-0">
        {notes.map((note, i) => (
          <li
            key={note.label + i}
            className={`py-2.5 grid grid-cols-[90px_1fr] gap-4 ${
              i === notes.length - 1 ? '' : 'border-b border-[#F3ECE0]/10'
            }`}
          >
            <b className="font-normal text-[#C96442] tracking-[0.12em] uppercase text-[10px]">
              {note.label}
            </b>
            <span className="text-[#F3ECE0]/85">{note.value}</span>
          </li>
        ))}
      </ul>
      {caption && (
        <div className="mt-7 pt-4 border-t border-[#F3ECE0]/10 font-fraunces italic text-[15px] text-[#F3ECE0]/70 leading-[1.45]">
          {caption}
        </div>
      )}
    </div>
  </div>
);

export default TerracottaMarkStage;
