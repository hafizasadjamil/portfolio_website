import React from 'react';
import { useList } from '../hooks/useApi';
import { getImageUrl } from '../services/api';

// A moving band of the skills that have a logo. The Skills section lists all of them.
const SkillStrip = () => {
  const { items } = useList('/skills');
  const skills = items.filter(skill => skill.icon);
  if (skills.length < 6) return null;

  return (
    <div className="strip border-y border-line bg-panel/60 py-5" aria-hidden="true">
      <div className="strip-track">
        {[...skills, ...skills].map((skill, i) => (
          <span key={`${skill._id}-${i}`} className="flex shrink-0 items-center gap-3 px-7 text-lg font-semibold text-muted">
            <img
              src={getImageUrl(skill.icon)}
              alt=""
              className="h-7 w-7 object-contain"
              onError={event => { event.currentTarget.hidden = true; }}
            />
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillStrip;
