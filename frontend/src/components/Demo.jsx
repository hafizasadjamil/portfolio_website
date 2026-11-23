import React from 'react';
import { FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { useList } from '../hooks/useApi';
import { getImageUrl } from '../services/api';
import { parsePoints, tidyTitle } from '../utils/text';
import Reveal from './Reveal';
import Section from './Section';

// Uploaded files are stored as /uploads/..., which lives on the backend.
const Player = ({ demo }) => {
  const src = getImageUrl(demo.src);
  if (demo.type === 'video') {
    return (
      <video controls preload="metadata" aria-label={demo.title} className="aspect-video w-full rounded-2xl bg-black">
        <source src={src} />
      </video>
    );
  }
  if (demo.type === 'audio') {
    return (
      <audio controls preload="metadata" aria-label={demo.title} className="w-full">
        <source src={src} />
      </audio>
    );
  }
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="btn-primary btn-shine">
      <FaExternalLinkAlt size={14} aria-hidden="true" /> Try {demo.title}
    </a>
  );
};

const Demo = () => {
  const { items: demos } = useList('/demos');
  if (demos.length === 0) return null;

  return (
    <Section id="demo" title={demos.length > 1 ? 'Demos' : 'Demo'} className="bg-panel/40">
      <div className="space-y-14">
        {demos.map(demo => {
          const { intro, points } = parsePoints(demo.description);
          return (
            <article key={demo._id} className="grid items-center gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
              <Reveal from="left" className="glow-frame"><Player demo={demo} /></Reveal>
              <Reveal from="right">
                <h3 className="text-2xl">{tidyTitle(demo.title)}</h3>
                {intro && <p className="mt-4 text-lg text-paper">{intro}</p>}
                {points.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {points.map(point => (
                      <li key={point} className="flex gap-3 text-muted">
                        <FaCheck className="mt-1 shrink-0 text-[#56d6c4]" size={14} aria-hidden="true" /> {point}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </article>
          );
        })}
      </div>
    </Section>
  );
};

export default Demo;
