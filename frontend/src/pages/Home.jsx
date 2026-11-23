import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import Hero from '../components/Hero';
import SkillStrip from '../components/SkillStrip';
import Projects from '../components/Projects';
import Demo from '../components/Demo';
import About from '../components/About';
import Experience from '../components/Experience';
import SecurityWork from '../components/SecurityWork';
import Journey from '../components/Journey';
import Skills from '../components/Skills';
import Credentials from '../components/Credentials';
import Contact from '../components/Contact';

const Home = () => {
  usePageTitle();

  return (
    <>
      <Hero />
      <SkillStrip />
      <Projects />
      <Demo />
      <About />
      <Experience />
      <SecurityWork />
      <Journey />
      <Skills />
      <Credentials />
      <Contact />
    </>
  );
};

export default Home;
