import React, { useState } from 'react';
import { FaExternalLinkAlt, FaRegImage } from 'react-icons/fa';
import { useList } from '../hooks/useApi';
import { getImageUrl } from '../services/api';
import { monthYear, period } from '../utils/text';
import Badge from './Badge';
import Dialog from './Dialog';
import Reveal from './Reveal';
import Section from './Section';

const isPicture = link => /\.(webp|png|jpe?g|gif|avif)$/i.test(link || '');

const CertificateLink = ({ card, onView }) => {
  const label = <>View certificate<span className="sr-only"> for {card.title}</span></>;
  if (!card.link) return null;

  return isPicture(card.link) ? (
    <button type="button" onClick={onView} aria-haspopup="dialog" className="text-link !min-h-[2.25rem] text-sm">
      <FaRegImage size={14} aria-hidden="true" /> {label}
    </button>
  ) : (
    <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-link !min-h-[2.25rem] text-sm">
      <FaExternalLinkAlt size={12} aria-hidden="true" /> {label}
    </a>
  );
};

// Certificates, degrees and awards, each with a badge.
const Credentials = () => {
  const { items: education } = useList('/education');
  const { items: courses } = useList('/course-certifications');
  const { items: awards } = useList('/achievements');
  const [viewing, setViewing] = useState(null);

  const cards = [
    ...courses.map(item => ({
      id: item._id, kind: 'certificate', title: item.title, from: item.provider, date: monthYear(item.date),
      credential: item.credentialId, link: item.certificateLink, verify: item.verifyUrl, image: item.badgeImage,
    })),
    ...education.map(item => ({
      id: item._id, kind: 'degree', title: item.degree, from: item.institution, date: period(item.startDate, item.endDate),
    })),
    ...awards.map(item => ({
      id: item._id, kind: 'award', title: item.title, from: item.description, date: monthYear(item.date), image: item.icon,
    })),
  ];
  if (cards.length === 0) return null;

  return (
    <Section id="courses-certifications" title="Education, certificates and awards">
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal as="li" key={card.id} delay={(i % 3) * 90} className="lift group flex flex-col items-center rounded-2xl border border-line bg-panel/50 p-4 text-center sm:p-6">
            <Badge title={card.title} provider={card.from} image={card.image} kind={card.kind} />
            <h3 className="mt-4 text-base leading-snug sm:text-lg">{card.title}</h3>
            {card.from && <p className="mt-1 text-sm text-muted sm:text-base">{card.from}</p>}
            {card.date && <p className="text-sm text-muted">{card.date}</p>}
            {card.credential && <p className="text-sm text-muted">ID <span className="inline-block">{card.credential}</span></p>}
            <div className="mt-auto pt-2"><CertificateLink card={card} onView={() => setViewing(card)} /></div>
          </Reveal>
        ))}
      </ul>

      {viewing && (
        <Dialog key={viewing.id} title={viewing.title} onClose={() => setViewing(null)}>
          <img
            src={getImageUrl(viewing.link)}
            alt={`${viewing.title} certificate from ${viewing.from}${viewing.credential ? `, ID ${viewing.credential}` : ''}`}
            className="mt-5 w-full rounded-xl"
          />
          {viewing.verify && (
            <a href={viewing.verify} target="_blank" rel="noopener noreferrer" className="text-link mt-2">
              <FaExternalLinkAlt size={12} aria-hidden="true" /> Verify on {new URL(viewing.verify).hostname.replace(/^www\./, '')}
            </a>
          )}
        </Dialog>
      )}
    </Section>
  );
};

export default Credentials;
