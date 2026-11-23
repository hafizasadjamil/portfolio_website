import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NAVBAR_HEIGHT = 64;
const GIVE_UP_AFTER_MS = 5000;

// Opens each page at the top, or at its #section.
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }

    // Sections above the target grow while their data loads, so keep aiming
    // at it until it stays put, the visitor scrolls, or time runs out.
    const started = Date.now();
    let settled = 0;
    const timer = setInterval(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      const distance = target ? target.getBoundingClientRect().top - NAVBAR_HEIGHT : null;

      if (distance !== null && Math.abs(distance) > 2) {
        settled = 0;
        window.scrollBy({ top: distance, behavior: 'instant' });
      } else if (distance !== null) {
        settled += 1;
      }
      if (settled > 10 || Date.now() - started > GIVE_UP_AFTER_MS) stop();
    }, 100);

    const stop = () => {
      clearInterval(timer);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('pointerdown', stop);

    return stop;
  }, [pathname, hash, key]);

  return null;
};

export default ScrollManager;
