import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await api.get('/skills');
        setSkills(res.data);

        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(skill => skill.category))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
        setError('Failed to load skills data');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getSkillLevelWidth = (level) => {
    switch (level) {
      case 'Beginner': return '25%';
      case 'Intermediate': return '50%';
      case 'Advanced': return '75%';
      case 'Expert': return '100%';
      default: return '0%';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-500';
      case 'Intermediate': return 'bg-indigo-500';
      case 'Advanced': return 'bg-purple-500';
      case 'Expert': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading skills...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">MY SKILLSET</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            The Magic <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">Behind</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill._id}
              className={`backdrop-blur-xl border px-8 py-6 rounded-3xl flex items-center gap-6 group transition-all duration-300 hover:-translate-y-1 cursor-default shadow-2xl shadow-black/20 ${skill.highlight
                  ? 'bg-blue-600/10 border-blue-500/50 glow-blue scale-105 z-10'
                  : 'bg-gray-900/50 border-white/5 hover:border-blue-500/30'
                }`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02, duration: 0.4 }}
            >
              {/* Icon Container - Made significantly larger */}
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 ${skill.highlight ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-blue-500/10'
                }`}>
                {skill.icon ? (
                  <img
                    src={getImageUrl(skill.icon)}
                    alt={skill.name}
                    className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  />
                ) : (
                  <span className={`${skill.highlight ? 'text-blue-300' : 'text-blue-400'} font-black text-2xl`}>
                    {skill.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start">
                <span className={`font-black text-lg tracking-tight ${skill.highlight ? 'text-blue-100' : 'text-white'}`}>
                  {skill.name}
                </span>
                <span className={`${skill.highlight ? 'text-blue-400/70' : 'text-gray-500'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                  {skill.category}
                </span>
              </div>

              {/* Decorative pulse for highlighted skills */}
              {skill.highlight && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;