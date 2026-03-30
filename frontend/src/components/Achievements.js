import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../services/api';
import { FaTrophy } from 'react-icons/fa';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/achievements');
        setAchievements(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError('Failed to load achievements data');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading achievements...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="achievements" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Honors & <span className="text-gradient">Awards</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              className="glass-card rounded-3xl p-8 group hover:glow-purple transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-colors"></div>

              <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-600 to-amber-700 p-0.5 shadow-xl shadow-yellow-600/20 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                  {achievement.icon ? (
                    <img src={getImageUrl(achievement.icon)} alt={achievement.title} className="w-10 h-10 object-contain" />
                  ) : (
                    <FaTrophy className="text-yellow-500 text-3xl" />
                  )}
                </div>
              </div>

              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-3 block">
                {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>

              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-500 transition-colors leading-tight">
                {achievement.title}
              </h3>

              <p className="text-gray-400 font-light leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;