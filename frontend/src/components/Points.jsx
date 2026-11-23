import React, { useState } from 'react';
import { parsePoints } from '../utils/text';

// Shows a description as an intro plus bullet points, with the rest behind a button.
const Points = ({ text, limit = 3 }) => {
  const [open, setOpen] = useState(false);
  const { intro, points } = parsePoints(text);
  const hidden = points.length - limit;
  const visible = open ? points : points.slice(0, limit);

  return (
    <div className="max-w-prose text-muted">
      {intro && <p className="leading-relaxed">{intro}</p>}
      {visible.length > 0 && (
        <ul className={`list-disc space-y-2 pl-5 leading-relaxed marker:text-accent ${intro ? 'mt-3' : ''}`}>
          {visible.map(point => <li key={point}>{point}</li>)}
        </ul>
      )}
      {hidden > 0 && (
        <button type="button" className="text-link mt-1" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Show less' : `Show ${hidden} more`}
        </button>
      )}
    </div>
  );
};

export default Points;
