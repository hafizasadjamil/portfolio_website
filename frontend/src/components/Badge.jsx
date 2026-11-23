import React from 'react';
import { getImageUrl } from '../services/api';

// "SOC Level 2 Learning Path" -> "SOC L2", "Certified Ethical Hacker (CEH)" -> "CEH",
// "Microsoft AI-103" -> "AI-103", "Machine Learning Specialization" -> "MLS"
const codeOf = (title) => {
  const level = title.match(/\b([A-Z]{2,5}) Level (\d)/);
  if (level) return `${level[1]} L${level[2]}`;
  return title.match(/\(([A-Z]{2,6}\+?)\)/)?.[1]
    || title.match(/\b[A-Z]{2}-\d{2,4}\b/)?.[0]
    || title.split(/\s+/).map(word => (/^[A-Z]{2,}$/.test(word) ? word : word.charAt(0).toUpperCase())).join('').slice(0, 5);
};

// Long names do not fit on a badge: "Riphah International University" -> "Riphah"
const shortName = (name) => (name.length > 13 ? name.split(/\s+/)[0] : name);

const COLORS = [
  [/tryhackme/i, '#3f9d2f', '#12402a'],
  [/ec-council/i, '#d24a55', '#4d1430'],
  [/microsoft/i, '#3b8ee6', '#143a78'],
];
const KIND_COLORS = {
  degree: ['#2c9c94', '#123b5c'],
  award: ['#d99a21', '#6b3a0c'],
  certificate: ['#7b5ce0', '#2a2470'],
};

const SHAPES = {
  certificate: {
    outer: 'M60 4 L110 24 V66 C110 96 88 116 60 126 C32 116 10 96 10 66 V24 Z',
    inner: 'M60 13 L102 30 V66 C102 91 83 108 60 117 C37 108 18 91 18 66 V30 Z',
  },
  degree: {
    outer: 'M60 4 L113 34 V96 L60 126 L7 96 V34 Z',
    inner: 'M60 13 L105 38.5 V91.5 L60 117 L15 91.5 V38.5 Z',
  },
  award: {
    outer: 'M60 6 a59 59 0 0 1 0 118 a59 59 0 0 1 0 -118 Z',
    inner: 'M60 14 a51 51 0 0 1 0 102 a51 51 0 0 1 0 -102 Z',
  },
};

const Star = () => (
  <path d="M60 27 l3.6 7.4 8.1 1.1 -5.9 5.7 1.4 8.1 -7.2 -3.9 -7.2 3.9 1.4 -8.1 -5.9 -5.7 8.1 -1.1 z" fill="#ffffff" />
);

const Cap = () => (
  <g fill="#ffffff">
    <path d="M60 24 L88 36 L60 48 L32 36 Z" />
    <path d="M44 44 v8 c0 5 32 5 32 0 v-8 l-16 7 z" />
  </g>
);

const Trophy = () => (
  <g fill="#ffffff">
    <path d="M44 34 h32 v14 c0 11 -7 18 -16 18 s-16 -7 -16 -18 z" />
    <path d="M42 38 h-9 c0 12 5 18 12 19 M78 38 h9 c0 12 -5 18 -12 19" fill="none" stroke="#ffffff" strokeWidth="3.5" />
    <rect x="57" y="65" width="6" height="9" />
    <rect x="47" y="74" width="26" height="5" rx="2.5" />
  </g>
);

// The uploaded badge picture, or a drawn one: a shield for certificates,
// a hexagon for degrees and a medal for awards.
const Badge = ({ title, provider = '', image, kind = 'certificate' }) => {
  if (image) return <img src={getImageUrl(image)} alt="" loading="lazy" className="badge h-32 w-32 object-contain" />;

  const match = COLORS.find(([pattern]) => pattern.test(provider));
  const [light, dark] = match ? match.slice(1) : KIND_COLORS[kind];
  const shape = SHAPES[kind];
  const code = kind === 'award' ? '' : codeOf(title);
  const id = `badge-${title.replace(/\W+/g, '')}`;

  return (
    <svg viewBox="0 0 120 130" className="badge h-32 w-28" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <clipPath id={`${id}-clip`}><path d={shape.outer} /></clipPath>
      </defs>
      <path d={shape.outer} fill={`url(#${id})`} />
      <path d={shape.inner} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
      {kind === 'certificate' && <Star />}
      {kind === 'degree' && <Cap />}
      {kind === 'award' && <Trophy />}
      <text x="60" y={kind === 'degree' ? 82 : 78} textAnchor="middle" fill="#ffffff" fontSize={code.length > 5 ? 18 : 24} fontWeight="800" fontFamily="inherit">{code}</text>
      <text x="60" y={kind === 'certificate' ? 95 : 97} textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="600" fontFamily="inherit">{shortName(provider)}</text>
      <g clipPath={`url(#${id}-clip)`}>
        <rect className="badge-shine" x="-60" y="-10" width="34" height="160" fill="#ffffff" opacity="0.28" transform="skewX(-18)" />
      </g>
    </svg>
  );
};

export default Badge;
