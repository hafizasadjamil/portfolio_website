import React from 'react';
import { FaBook, FaBug, FaChartLine, FaFileContract, FaShieldAlt } from 'react-icons/fa';
import useApi from '../hooks/useApi';
import { parsePoints } from '../utils/text';
import Reveal from './Reveal';
import Section from './Section';

const ICONS = [
  [/playbook|incident/i, FaBook],
  [/vapt|pentest|penetration/i, FaBug],
  [/polic|privacy|compliance/i, FaFileContract],
  [/report|deck/i, FaChartLine],
];

const iconFor = text => (ICONS.find(([match]) => match.test(text)) || [null, FaShieldAlt])[1];

const capital = text => text.charAt(0).toUpperCase() + text.slice(1);

// "Playbooks: mapped to NIST" -> a card titled "Playbooks" with a short line under it.
const split = point => {
  const at = point.indexOf(':');
  return at > 0 && at < 40 ? [point.slice(0, at), capital(point.slice(at + 1).trim())] : [point, ''];
};

const SecurityWork = () => {
  const { data: profile } = useApi('/profile');
  const { points } = parsePoints(profile?.securityWork);
  if (points.length === 0) return null;

  return (
    <Section id="security" title="Security and GRC" className="bg-panel/40">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point, i) => {
          const [title, detail] = split(point);
          const Icon = iconFor(point);
          return (
            <Reveal as="li" key={point} delay={i * 90} className="lift rounded-2xl border border-line bg-ink p-6">
              <span className="icon-tile" aria-hidden="true"><Icon size={22} /></span>
              <h3 className="mt-5 text-lg">{title}</h3>
              {detail && <p className="mt-2 text-muted">{detail}</p>}
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
};

export default SecurityWork;
