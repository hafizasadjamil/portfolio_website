// Whether things on the page may move. Off when the system asks for reduced motion
// or the visitor pressed "Pause motion".
const KEY = 'motion';
const EVENT = 'motion-change';

const saved = () => {
  try {
    return localStorage.getItem(KEY);
  } catch (err) {
    return null;
  }
};

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const motionAllowed = () => !document.documentElement.classList.contains('motion-off');

export const setMotion = (allowed) => {
  document.documentElement.classList.toggle('motion-off', !allowed);
  window.dispatchEvent(new Event(EVENT));
};

export const saveMotion = (allowed) => {
  try {
    localStorage.setItem(KEY, allowed ? 'on' : 'off');
  } catch (err) {
    // Private windows may refuse storage; the choice then lasts until the page is closed.
  }
  setMotion(allowed);
};

export const onMotionChange = (handler) => {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};

const choice = saved();
setMotion(choice ? choice === 'on' : !prefersReduced());
