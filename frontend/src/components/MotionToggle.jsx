import React from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import useMotion from '../hooks/useMotion';
import { saveMotion } from '../utils/motion';

const MotionToggle = () => {
  const allowed = useMotion();
  return (
    <button
      type="button"
      onClick={() => saveMotion(!allowed)}
      className="inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-muted hover:text-paper"
    >
      {allowed ? <FaPause size={11} aria-hidden="true" /> : <FaPlay size={11} aria-hidden="true" />}
      {allowed ? 'Pause motion' : 'Play motion'}
    </button>
  );
};

export default MotionToggle;
