import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { useList } from '../hooks/useApi';
import { period } from '../utils/text';
import Points from './Points';
import Reveal from './Reveal';
import Section from './Section';

const Experience = () => {
  const { items: jobs } = useList('/experience');
  if (jobs.length === 0) return null;

  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-5">
        {jobs.map((job, i) => (
          <Reveal as="li" key={job._id} delay={i * 90} className="glow-border p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-5">
              <span className="icon-tile" aria-hidden="true"><FaBriefcase size={22} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h3 className="text-xl sm:text-2xl">{job.role}</h3>
                  <span className="inline-flex items-center gap-2 text-sm text-muted">
                    {job.current && <span className="pulse-dot" aria-hidden="true" />}
                    {period(job.startDate, job.endDate, job.current)}
                  </span>
                </div>
                <p className="mt-1 text-accent">{[job.company, job.location].filter(Boolean).join(', ')}</p>
                {job.description && <div className="mt-4"><Points text={job.description} limit={2} /></div>}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
