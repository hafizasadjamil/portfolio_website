import React, { useEffect, useRef, useState } from 'react';

// Slides its content in the first time it is scrolled into view.
const Reveal = ({ as: Tag = 'div', delay = 0, from = 'up', className = '', children, ...props }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${from} ${shown ? 'is-shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
