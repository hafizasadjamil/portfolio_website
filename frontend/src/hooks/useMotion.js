import { useEffect, useState } from 'react';
import { motionAllowed, onMotionChange } from '../utils/motion';

const useMotion = () => {
  const [allowed, setAllowed] = useState(motionAllowed);
  useEffect(() => onMotionChange(() => setAllowed(motionAllowed())), []);
  return allowed;
};

export default useMotion;
