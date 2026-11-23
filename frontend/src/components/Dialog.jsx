import React, { useEffect, useId, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

// A pop-up over the page. Escape, the close button and a click outside all close it.
const Dialog = ({ title, onClose, children }) => {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="details"
      onClose={onClose}
      onClick={event => event.target === ref.current && ref.current.close()}
    >
      <div className="relative p-6 sm:p-8">
        <button type="button" onClick={() => ref.current.close()} aria-label="Close" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper hover:text-accent">
          <FaTimes />
        </button>
        <h3 id={titleId} className="pr-12 text-2xl">{title}</h3>
        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
