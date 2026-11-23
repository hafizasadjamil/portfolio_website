import React, { useState } from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { useList } from '../hooks/useApi';
import { getImageUrl } from '../services/api';
import { parsePoints, summaryOf, tidyTitle } from '../utils/text';
import Dialog from './Dialog';
import ProjectVisual from './ProjectVisual';
import Reveal from './Reveal';
import Section from './Section';

const AT_FIRST = 6;
const TAGS_ON_CARD = 3;

const imagesOf = project => (project.images?.length > 0 ? project.images : [project.image].filter(Boolean));

const Card = ({ project, onOpen }) => {
  const [image] = imagesOf(project);
  const extra = project.techStack.length - TAGS_ON_CARD;

  return (
    <button type="button" onClick={onOpen} className="card group" aria-haspopup="dialog">
      <span className="card-picture">
        {image
          ? <img src={getImageUrl(image)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <ProjectVisual project={project} />}
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="card-title">{tidyTitle(project.title)}</span>
        <span className="mt-2 line-clamp-2 text-muted">{summaryOf(project.description)}</span>
        <span className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.techStack.slice(0, TAGS_ON_CARD).map(tech => <span key={tech} className="tag">{tech}</span>)}
          {extra > 0 && <span className="tag">+{extra}</span>}
        </span>
      </span>
    </button>
  );
};

const Details = ({ project, onClose }) => {
  const { intro, points } = parsePoints(project.description);

  return (
    <Dialog title={tidyTitle(project.title)} onClose={onClose}>
      {imagesOf(project).map(image => (
        <img key={image} src={getImageUrl(image)} alt="" className="mt-5 w-full rounded-xl" />
      ))}
      {intro && <p className="mt-5 leading-relaxed text-muted">{intro}</p>}
      {points.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent">
          {points.map(point => <li key={point}>{point}</li>)}
        </ul>
      )}
      <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
        {project.techStack.map(tech => <li key={tech} className="tag">{tech}</li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-x-6">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            <FaExternalLinkAlt size={14} aria-hidden="true" /> Open site
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            <FaGithub aria-hidden="true" /> View code
          </a>
        )}
      </div>
    </Dialog>
  );
};

const Projects = () => {
  const { items, loading, failed } = useList('/projects');
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(null);

  // Projects with a picture first, then featured ones; newest first within each group.
  const rank = project => (imagesOf(project).length > 0 ? 2 : 0) + (project.featured ? 1 : 0);
  const projects = [...items].sort((a, b) => rank(b) - rank(a));
  const visible = showAll ? projects : projects.slice(0, AT_FIRST);

  return (
    <Section id="projects" title="Projects">
      {loading && <p className="text-muted">Loading projects…</p>}
      {failed && <p className="text-muted">The projects could not be loaded. Check your connection and reload the page.</p>}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <Reveal as="li" key={project._id} delay={(i % 3) * 90} className="flex">
            <Card project={project} onOpen={() => setOpen(project)} />
          </Reveal>
        ))}
      </ul>
      {projects.length > AT_FIRST && (
        <div className="mt-10 text-center">
          <button type="button" className="btn-secondary" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer projects' : `Show ${projects.length - AT_FIRST} more projects`}
          </button>
        </div>
      )}
      {open && <Details key={open._id} project={open} onClose={() => setOpen(null)} />}
    </Section>
  );
};

export default Projects;
