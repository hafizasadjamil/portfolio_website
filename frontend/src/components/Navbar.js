import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'About', to: 'about' },
    { name: 'Journey', to: 'journey' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Demo', to: 'demo' },
    { name: 'Awards', to: 'achievements' },
    { name: 'Contact', to: 'contact' },
    { name: 'Blog', to: '/blog', external: true },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-950/80 backdrop-blur-xl py-2 border-b border-white/5' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black text-white tracking-tighter"
          >
            <Link to="home" spy={true} smooth={true} duration={500} className="cursor-pointer group flex items-center gap-2 text-decoration-none">
              <span className="text-gradient">ASAD</span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </Link>
          </motion.div>

          {/* Smart Desktop Navigation Bar */}
          <motion.div
            className="hidden lg:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                {link.external ? (
                  <a href={link.to} className="text-[10px] text-gray-400 hover:text-white px-4 py-2 font-black uppercase tracking-[0.2em] transition-all block">
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    activeClass="!text-blue-400"
                    className="text-[10px] text-gray-400 hover:text-white px-4 py-2 font-black uppercase tracking-[0.2em] transition-all cursor-pointer block"
                  >
                    {link.name}
                  </Link>
                )}
                {/* Animated Indicator Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-1/2"></div>
              </div>
            ))}
          </motion.div>

          <div className="flex items-center gap-4">
            <RouterLink
              to="/booking"
              className="hidden sm:block px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-blue-600/20 text-decoration-none"
            >
              Book a Call
            </RouterLink>

            {/* Mobile Navigation Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-gray-950/95 backdrop-blur-2xl border-b border-white/5 py-8 px-6"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.external ? (
                    <a
                      href={link.to}
                      className="text-gray-400 hover:text-white text-xl font-black uppercase tracking-widest block"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      className="text-gray-400 hover:text-white text-xl font-black uppercase tracking-widest block cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <RouterLink
                to="/booking"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-center font-black uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                Book a Call
              </RouterLink>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;