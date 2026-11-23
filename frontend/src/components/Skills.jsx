import React, { useState } from 'react';
import { useList } from '../hooks/useApi';
import { getImageUrl } from '../services/api';
import Reveal from './Reveal';
import Section from './Section';

// Categories are typed freely in the admin panel; these patterns bring similar ones together.
const GROUPS = [
  { name: 'AI', match: /\b(ai|ml|machine learning|data science)\b/i },
  { name: 'Security', match: /security|compliance|grc/i },
  { name: 'Automation', match: /automation/i },
  { name: 'Languages', match: /programming|language/i },
  { name: 'Backend', match: /backend|database|\bapi/i },
  { name: 'Frontend', match: /front-?end/i },
  { name: 'Infrastructure', match: /infra|devops|hosting/i },
  { name: 'Tools', match: /./ },
];

const groupSkills = skills => GROUPS
  .map(group => ({
    name: group.name,
    skills: skills
      .filter(skill => GROUPS.find(candidate => candidate.match.test(skill.category)) === group)
      .sort((a, b) => Number(b.highlight) - Number(a.highlight)),
  }))
  .filter(group => group.skills.length > 0);

const Skills = () => {
  const { items: skills } = useList('/skills');
  const [active, setActive] = useState(null);
  if (skills.length === 0) return null;

  const groups = groupSkills(skills);
  const current = groups.find(group => group.name === active) || groups[0];

  return (
    <Section id="skills" title="Skills" className="bg-panel/40">
      <Reveal>
        <div role="group" aria-label="Skill area" className="flex flex-wrap gap-2">
          {groups.map(group => (
            <button
              key={group.name}
              type="button"
              aria-pressed={group === current}
              onClick={() => setActive(group.name)}
              className={`min-h-[2.75rem] rounded-full border px-4 font-semibold transition-colors ${group === current ? 'border-action bg-action text-white' : 'border-line text-muted hover:border-accent hover:text-paper'}`}
            >
              {group.name}
            </button>
          ))}
        </div>

        <ul key={current.name} className="mt-8 grid min-h-[16rem] content-start gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {current.skills.map((skill, i) => (
            <li key={skill._id} className="pop lift flex items-center gap-3 self-start rounded-xl border border-line bg-ink p-4 font-semibold" style={{ animationDelay: `${i * 45}ms` }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel text-accent" aria-hidden="true">
                {skill.icon
                  ? <img src={getImageUrl(skill.icon)} alt="" loading="lazy" className="h-6 w-6 object-contain" onError={event => { event.currentTarget.hidden = true; }} />
                  : skill.name.charAt(0)}
              </span>
              {skill.name}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
};

export default Skills;
