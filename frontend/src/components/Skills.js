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

        <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill._id}
              className="bg-gray-900/50 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 group transition-all duration-300 hover:glow-blue hover:-translate-y-1 cursor-default shadow-2xl shadow-black/20"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02, duration: 0.4 }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                {skill.icon ? (
                  <img src={getImageUrl(skill.icon)} alt={skill.name} className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-blue-400 font-black text-sm">{skill.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-sm tracking-tight">{skill.name}</span>
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{skill.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;