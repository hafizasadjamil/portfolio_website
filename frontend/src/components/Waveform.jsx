import React from 'react';

// Shaped like a short spoken sentence: words with pauses between them.
const BARS = Array.from({ length: 72 }, (_, i) => {
  const word = Math.abs(Math.sin(i * 0.19)) * Math.abs(Math.cos(i * 0.053 + 0.4));
  const detail = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.9));
  return Math.max(0.06, word * detail);
});

const STEP = 10;
const HEIGHT = 100;

const Waveform = ({ className = '', id = 'wave' }) => (
  <svg viewBox={`0 0 ${BARS.length * STEP} ${HEIGHT}`} preserveAspectRatio="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2={BARS.length * STEP} y1="0" y2="0">
        <stop offset="0" stopColor="#56d6c4" />
        <stop offset="0.5" stopColor="#7ea6ff" />
        <stop offset="1" stopColor="#a58bff" />
      </linearGradient>
    </defs>
    {BARS.map((size, i) => (
      <rect
        key={i}
        className="wave-bar"
        style={{ animationDelay: `${-((i * 137) % 1600)}ms` }}
        x={i * STEP + 2}
        y={(HEIGHT - size * HEIGHT) / 2}
        width={STEP - 4}
        height={size * HEIGHT}
        rx="3"
        fill={`url(#${id})`}
      />
    ))}
  </svg>
);

export default Waveform;
