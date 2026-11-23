import React, { useEffect, useState } from 'react';
import useMotion from '../hooks/useMotion';

// Shows one phrase after the other. Screen readers get all of them at once.
const RotatingWords = ({ words }) => {
  const moving = useMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!moving || words.length < 2) return undefined;
    const timer = setInterval(() => setIndex(current => current + 1), 2600);
    return () => clearInterval(timer);
  }, [moving, words.length]);

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="grid">
        {words.map((word, i) => (
          <span key={word} className={`rotating-word ${i === index % words.length ? 'is-current' : ''}`}>{word}</span>
        ))}
      </span>
    </>
  );
};

export default RotatingWords;
