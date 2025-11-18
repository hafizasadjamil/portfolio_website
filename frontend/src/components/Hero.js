import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaDownload, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const Hero = () => {
  const [profile, setProfile] = useState({
    name: 'Muhammad Asad Jamil',
    tagline: 'AI & Software Engineer | Building Intelligent and Scalable Systems',
    bio: 'I am a Computer Science graduate passionate about Artificial Intelligence and intelligent systems. I specialize in Python, machine learning frameworks, and full-stack development. I love solving real-world problems with code, from building AI-powered applications to deploying production-ready systems.',
    profileImage: '',
    cvUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/profile');
        console.log('Profile data received:', res.data);
        setProfile(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Using default data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#3b82f6',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse',
        },
        onclick: {
          enable: true,
          mode: 'push',
        },
        resize: true,
      },
    },
    retina_detect: true,
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Loading profile...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-red-500 text-xl">{error}</div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />
      
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {profile.name}
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-blue-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {profile.tagline}
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              to="projects"
              spy={true}
              smooth={true}
              duration={500}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaBriefcase /> View Projects
            </Link>
            
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent border-2 border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900/20 transition flex items-center gap-2"
              >
                <FaDownload /> Download CV
              </a>
            )}
            
            <Link
              to="contact"
              spy={true}
              smooth={true}
              duration={500}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <FaEnvelope /> Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Link
          to="about"
          spy={true}
          smooth={true}
          duration={500}
          className="text-blue-400 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;