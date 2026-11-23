import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import Reveal from './Reveal';
import Section from './Section';

const DEFAULT_BIO = 'I am an AI Security Engineer in Lahore, Pakistan. I work on voice AI, RAG pipelines, secure APIs and SOC automation.';

const About = () => {
  const { data: profile } = useApi('/profile');
  const [open, setOpen] = useState(false);
  const [first, ...rest] = (profile?.bio || DEFAULT_BIO).split(/\n+/).filter(Boolean);

  return (
    <Section id="about" title="About">
      <Reveal className="max-w-3xl">
        <p className="text-xl leading-relaxed text-paper md:text-2xl">{first}</p>
        {open && rest.map(paragraph => <p key={paragraph} className="mt-4 text-lg leading-relaxed text-muted">{paragraph}</p>)}
        {rest.length > 0 && (
          <button type="button" className="text-link mt-3" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Show less' : 'Read more'}
          </button>
        )}
      </Reveal>
    </Section>
  );
};

export default About;
