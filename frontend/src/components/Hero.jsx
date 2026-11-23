import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaMicrophoneAlt, FaPlay, FaRobot, FaShieldAlt } from 'react-icons/fa';
import useApi, { useList } from '../hooks/useApi';
import { externalUrl, getImageUrl } from '../services/api';
import { socialLinks } from '../utils/social';
import { listOf } from '../utils/text';
import MotionToggle from './MotionToggle';
import NetworkCanvas from './NetworkCanvas';
import RotatingWords from './RotatingWords';
import Waveform from './Waveform';

const DEFAULT_TAGLINE = 'AI Security Engineer | Voice AI, RAG pipelines, secure APIs and SOC automation';

const BADGES = [
  { icon: FaShieldAlt, place: '-left-5 top-10 md:-left-7', delay: '0s' },
  { icon: FaMicrophoneAlt, place: '-right-5 top-1/3 md:-right-7', delay: '-2s' },
  { icon: FaRobot, place: '-left-4 bottom-12 md:-left-6', delay: '-4s' },
];

const Hero = () => {
  const { data: profile } = useApi('/profile');
  const { items: demos } = useList('/demos');
  const [imageFailed, setImageFailed] = useState(false);

  const [role, focus = ''] = (profile?.tagline || DEFAULT_TAGLINE).split('|').map(part => part.trim());
  const photo = profile?.profileImage && !imageFailed ? getImageUrl(profile.profileImage) : null;

  return (
    <section id="home" className="relative overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32">
      <div className="hero-glow" aria-hidden="true" />
      <NetworkCanvas className="absolute inset-0 h-full w-full" />

      <div className="shell relative">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_16rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="hero-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-1.5 text-paper">
              <span className="pulse-dot" aria-hidden="true" /> {role}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">Muhammad Asad Jamil</h1>
            <p className="mt-5 text-2xl font-semibold leading-tight text-muted sm:text-3xl">
              I build
              <span className="mt-1 block text-accent"><RotatingWords words={listOf(focus)} /></span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/#projects" className="btn-primary btn-shine">See my projects</Link>
              <Link to="/booking" className="btn-secondary bg-ink/70">Book a call</Link>
              {profile?.cvUrl && (
                <a href={externalUrl(profile.cvUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary bg-ink/70">
                  <FaDownload aria-hidden="true" /> Download CV
                </a>
              )}
              <div className="flex">
                {socialLinks(profile).filter(link => !link.href.startsWith('mailto:')).map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center text-muted transition-transform hover:-translate-y-0.5 hover:text-accent">
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-photo relative mx-auto w-52 sm:w-60 md:w-full">
            <div className="photo-ring" aria-hidden="true" />
            {/* Keeps its place while the profile loads, so the page does not jump. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-panel">
              {photo && (
                <img
                  src={photo}
                  alt="Muhammad Asad Jamil"
                  className="h-full w-full object-cover object-[50%_35%]"
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>
            {BADGES.map(({ icon: Icon, place, delay }) => (
              <span key={place} aria-hidden="true" className={`float-badge ${place}`} style={{ animationDelay: delay }}>
                <Icon size={22} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-14">
          {demos.length > 0 ? (
            <Link to="/#demo" className="group flex items-center gap-5 rounded-2xl border border-line bg-ink/70 p-4 transition-colors hover:border-accent sm:px-6">
              <span className="play-button">
                <FaPlay className="ml-1" aria-hidden="true" />
              </span>
              <Waveform className="h-14 min-w-0 flex-1" />
              <span className="sr-only sm:not-sr-only sm:shrink-0 sm:font-semibold sm:text-accent">Watch the {demos[0].title} demo</span>
            </Link>
          ) : <Waveform className="h-16 w-full" />}
          <div className="mt-2 flex justify-end"><MotionToggle /></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
