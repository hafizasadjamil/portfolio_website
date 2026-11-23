import React from 'react';

// Small animated drawings for projects without a picture, chosen by what the project does.
const KINDS = [
  ['voice', /voice|twilio|\btts\b|receptionist/i],
  ['dashboard', /dashboard|program manager|portal/i],
  ['lock', /password|vault/i],
  ['table', /extractor|excel|spreadsheet/i],
  ['access', /access control|single sign-on/i],
  ['flow', /workflow|n8n|automation/i],
  ['graph', /\brag\b|multi-agent|knowledge/i],
];

const kindOf = project => {
  const text = `${project.title} ${project.techStack.join(' ')}`;
  return (KINDS.find(([, match]) => match.test(text)) || ['code'])[0];
};

const BLUE = '#7ea6ff';
const VIOLET = '#a58bff';
const TEAL = '#56d6c4';

const DRAWINGS = {
  voice: () => (
    <g>
      {[20, 46, 78, 110, 64, 128, 88, 50, 104, 70, 36, 58, 24].map((size, i) => (
        <rect key={i} className="wave-bar" style={{ animationDelay: `${-i * 190}ms` }} x={72 + i * 20} y={125 - size / 2} width="10" height={size} rx="5" fill={[TEAL, BLUE, VIOLET][i % 3]} />
      ))}
    </g>
  ),
  dashboard: () => (
    <g>
      <rect x="50" y="42" width="300" height="166" rx="12" fill="#0b1330" stroke="#2a3768" strokeWidth="2" />
      <rect x="66" y="58" width="80" height="44" rx="8" fill="#1b2856" />
      <rect x="160" y="58" width="80" height="44" rx="8" fill="#1b2856" />
      <rect x="254" y="58" width="80" height="44" rx="8" fill="#1b2856" />
      <circle className="blink" cx="84" cy="80" r="7" fill={TEAL} />
      <circle className="blink" style={{ animationDelay: '-0.7s' }} cx="178" cy="80" r="7" fill="#ffb454" />
      <circle className="blink" style={{ animationDelay: '-1.4s' }} cx="272" cy="80" r="7" fill="#ff7a90" />
      <path className="draw-line" pathLength="1" d="M66 186 L106 160 L146 172 L186 132 L226 150 L266 122 L334 138" fill="none" stroke={BLUE} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  ),
  flow: () => (
    <g>
      {[[200, 70], [100, 125], [200, 125], [300, 125], [100, 185], [200, 185], [300, 185]].map(([x, y], i) => (
        i > 0 && <path key={i} className="flow-line" d={`M${i < 4 ? 200 : x} ${i < 4 ? 70 : 125} L${x} ${y}`} stroke={BLUE} strokeWidth="2.5" fill="none" />
      ))}
      <rect x="170" y="50" width="60" height="38" rx="10" fill={VIOLET} />
      {[100, 200, 300].map((x, i) => <rect key={x} x={x - 26} y="108" width="52" height="34" rx="9" fill={[TEAL, BLUE, TEAL][i]} />)}
      {[100, 200, 300].map((x, i) => <circle key={x} className="blink" style={{ animationDelay: `${-i * 0.6}s` }} cx={x} cy="185" r="13" fill="#1b2856" stroke={BLUE} strokeWidth="2.5" />)}
    </g>
  ),
  access: () => (
    <g>
      {[[105, 80], [295, 80], [105, 175], [295, 175]].map(([x, y], i) => (
        <g key={i}>
          <path className="flow-line" d={`M${x} ${y} L200 125`} stroke={i === 3 ? '#ff7a90' : TEAL} strokeWidth="2.5" />
          <circle cx={x} cy={y - 8} r="10" fill={BLUE} />
          <path d={`M${x - 18} ${y + 20} a18 16 0 0 1 36 0 z`} fill={BLUE} />
        </g>
      ))}
      <path d="M200 78 l40 14 v30 c0 26 -17 42 -40 52 c-23 -10 -40 -26 -40 -52 v-30 z" fill={VIOLET} />
      <path className="draw-line" pathLength="1" d="M182 124 l13 14 l24 -28" fill="none" stroke="#0b1330" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  graph: () => (
    <g>
      {[[120, 80], [290, 72], [90, 170], [310, 175], [200, 205]].map(([x, y], i) => (
        <g key={i}>
          <path className="flow-line" d={`M${x} ${y} L200 125`} stroke={BLUE} strokeWidth="2.5" />
          <circle className="blink" style={{ animationDelay: `${-i * 0.45}s` }} cx={x} cy={y} r="14" fill={[TEAL, BLUE, VIOLET][i % 3]} />
        </g>
      ))}
      <circle cx="200" cy="125" r="28" fill={VIOLET} />
    </g>
  ),
  lock: () => (
    <g>
      <path d="M165 118 v-24 a35 35 0 0 1 70 0 v24" fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />
      <rect x="145" y="116" width="110" height="80" rx="16" fill={VIOLET} />
      <circle className="blink" cx="200" cy="150" r="11" fill="#0b1330" />
      <rect x="195" y="154" width="10" height="22" rx="5" fill="#0b1330" />
    </g>
  ),
  table: () => (
    <g>
      {[0, 1, 2, 3].map(row => [0, 1, 2, 3].map(column => (
        <rect key={`${row}-${column}`} className={row ? 'blink' : ''} style={{ animationDelay: `${-(row * 3 + column) * 0.35}s` }} x={78 + column * 63} y={56 + row * 36} width="55" height="28" rx="6" fill={row === 0 ? BLUE : '#26346b'} />
      )))}
    </g>
  ),
  code: () => (
    <g>
      <rect x="70" y="45" width="260" height="160" rx="12" fill="#0b1330" stroke="#2a3768" strokeWidth="2" />
      {[['92', 110, BLUE], ['112', 150, TEAL], ['112', 90, VIOLET], ['112', 130, BLUE], ['92', 70, TEAL]].map(([x, width, color], i) => (
        <rect key={i} className="type-line" style={{ animationDelay: `${i * 0.35}s` }} x={x} y={70 + i * 25} width={width} height="10" rx="5" fill={color} />
      ))}
    </g>
  ),
};

const ProjectVisual = ({ project }) => (
  <svg viewBox="0 0 400 250" className="h-full w-full" aria-hidden="true">
    {DRAWINGS[kindOf(project)]()}
  </svg>
);

export default ProjectVisual;
