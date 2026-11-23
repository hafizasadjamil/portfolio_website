import React from 'react';
import Reveal from './Reveal';

const Section = ({ id, title, children, className = '' }) => (
  <section id={id} className={`py-14 md:py-20 ${className}`}>
    <div className="shell">
      <Reveal as="h2" className="section-title">{title}</Reveal>
      {children}
    </div>
  </section>
);

export default Section;
