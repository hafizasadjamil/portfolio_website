import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaRobot, FaCoffee, FaHeart, FaCode } from 'react-icons/fa';
import api, { getImageUrl } from '../services/api';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile');
        setProfile(res.data);
        setError(null);
        setImageError(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading about data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl md:text-6xl font-black text-center mb-24 text-white tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About <span className="text-gradient">Me</span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column: Image with Decorations */}
          <motion.div
            className="lg:w-1/2 relative flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.8
            }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Decorative Animated Rings */}
              <div className="absolute inset-[-60px] border border-blue-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-[-45px] border-2 border-dashed border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
              <div className="absolute inset-[-30px] border border-blue-400/30 rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>

              {/* Profile Image Container with 3D Hover */}
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-[0_0_60px_rgba(59,130,246,0.4)] relative z-10"
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: -10,
                  boxShadow: "0 0 80px rgba(168, 85, 247, 0.6)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-950 group">
                  {profile && profile.profileImage && !imageError ? (
                    <img
                      src={getImageUrl(profile.profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-6xl font-black text-white/20">MAJ</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Floating Tech Badges */}
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl z-20"
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaRobot className="text-blue-400 text-3xl" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-10 w-16 h-16 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl z-20"
                animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <FaCode className="text-purple-400 text-2xl" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              {profile?.name || 'Muhammad Asad Jamil'} — <span className="text-blue-400">AI Automation Engineer</span> passionate about building intelligent systems
            </h3>

            <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed mb-10">
              <p>
                {profile ? profile.bio : "I am a Computer Science graduate passionate about Artificial Intelligence and intelligent systems. I specialize in Python, machine learning frameworks, and full-stack development."}
              </p>
              <p>
                My expertise spans machine learning, natural language processing, and deep learning technologies. I focus on creating AI-powered solutions that bridge the gap between complex algorithms and real-world applications.
              </p>
            </div>

            {/* Dynamic Badges */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-4">
                <FaCode className="text-blue-400 text-2xl" />
                <div>
                  <p className="text-white font-bold text-sm">Fluent in</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Algorithms</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaCoffee className="text-purple-400 text-2xl" />
                <div>
                  <p className="text-white font-bold text-sm">Powered by</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Caffeine</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaHeart className="text-pink-400 text-2xl" />
                <div>
                  <p className="text-white font-bold text-sm">Passionate about</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">AI Innovation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaRobot className="text-green-400 text-2xl" />
                <div>
                  <p className="text-white font-bold text-sm">Focused on</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Automation</p>
                </div>
              </div>
            </div>

            {/* Quote Box */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-blue-500 bg-white/5 backdrop-blur-sm">
              <p className="text-gray-300 italic font-light">
                "Engineering the future with AI, one neural network at a time."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;