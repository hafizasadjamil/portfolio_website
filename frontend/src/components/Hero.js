import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaDownload, FaBriefcase, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import api, { getImageUrl } from '../services/api';

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
        const res = await api.get('/profile');
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

  const [text, setText] = useState('');
  const fullText = "Muhammad Asad Jamil";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index]);

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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950 hero-gradient">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-blue-400 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base">Welcome to my portfolio</h2>
            <h1 className="text-5xl md:text-8xl font-black mb-6 text-white tracking-tighter leading-none min-h-[1.2em]">
              Hi, I'm <span className="text-gradient">{text}</span>
              <span className="animate-pulse text-blue-500">|</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-3xl text-gray-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link
              to="projects"
              spy={true}
              smooth={true}
              duration={500}
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 font-bold flex items-center gap-2 cursor-pointer"
            >
              <FaBriefcase /> View My Work
            </Link>

            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 transition-all font-bold flex items-center gap-2"
              >
                <FaDownload /> Download Resume
              </a>
            )}

            <RouterLink
              to="/booking"
              className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-full hover:border-gray-500 hover:text-white transition-all font-bold flex items-center gap-2 cursor-pointer"
            >
              <FaCalendarAlt /> Book a Call
            </RouterLink>
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