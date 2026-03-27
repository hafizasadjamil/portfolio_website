import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const Footer = () => {
  const [profile, setProfile] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile in footer:', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer className="bg-gray-950 py-20 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0 text-center md:text-left"
          >
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">
              <span className="text-gradient">ASAD</span> JAMIL
            </h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
              {profile?.tagline?.split('|')[0] || 'AI & Automation Engineer'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex space-x-4 mb-6 md:mb-0 relative z-10"
          >
            <a 
              href={profile?.socialLinks?.github?.startsWith('http') ? profile.socialLinks.github : (profile?.socialLinks?.github ? `https://${profile.socialLinks.github}` : 'https://github.com')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-500"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href={profile?.socialLinks?.linkedin?.startsWith('http') ? profile.socialLinks.linkedin : (profile?.socialLinks?.linkedin ? `https://${profile.socialLinks.linkedin}` : 'https://linkedin.com')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-500"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href={profile?.socialLinks?.twitter?.startsWith('http') ? profile.socialLinks.twitter : (profile?.socialLinks?.twitter ? `https://${profile.socialLinks.twitter}` : 'https://twitter.com')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-500"
            >
              <FaTwitter size={20} />
            </a>
            <a 
              href={`mailto:${profile?.socialLinks?.email || 'contact@example.com'}`} 
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-500"
            >
              <FaEnvelope size={20} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-right"
          >
            &copy; {currentYear} Designed with Passion <br /> 
            <span className="text-white">Muhammad Asad Jamil</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;