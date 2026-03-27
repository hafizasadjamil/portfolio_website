import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Journey from '../components/Journey';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import CoursesCertifications from '../components/CoursesCertifications';
import Demo from '../components/Demo';
import Achievements from '../components/Achievements';
import Education from '../components/Education';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Journey />
      <Skills />
      <Projects />
      <CoursesCertifications />
      <Demo />
      <Achievements />
      <Education />
      <Contact />
    </>
  );
};

export default Home;