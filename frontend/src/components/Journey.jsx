import React from 'react';
import { useList } from '../hooks/useApi';
import Reveal from './Reveal';
import Section from './Section';

const Journey = () => {
  const { items: events } = useList('/journey');
  if (events.length === 0) return null;

  return (
    <Section id="journey" title="Journey">
      <div className="journey" tabIndex={0} role="region" aria-label="Journey, scrolls sideways">
        <ol className="journey-track">
          {events.map((event, i) => (
            <Reveal as="li" key={event._id} delay={i * 110} className="journey-step">
              <span aria-hidden="true" className={`journey-dot bg-gradient-to-br ${event.color}`} />
              <p className="text-sm font-semibold text-accent">{event.date}</p>
              <h3 className="mt-1 text-lg leading-snug">{event.title}</h3>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default Journey;
