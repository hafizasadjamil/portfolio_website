import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrophy } from 'react-icons/fa';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/achievements');
        setAchievements(res.data);
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
    <section id="achievements" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                {achievement.icon ? (
                  <img src={achievement.icon} alt={achievement.title} className="w-8 h-8" />
                ) : (
                  <FaTrophy className="text-white text-2xl" />
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">{achievement.title}</h3>
              <p className="text-gray-400 mb-4">{achievement.description}</p>
              <p className="text-blue-400 text-sm">
                {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;