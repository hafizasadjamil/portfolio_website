import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/skills');
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

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-purple-500';
      case 'Expert': return 'bg-red-500';
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
    <section id="skills" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">My Skills</h2>
        
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-6 text-blue-400">{category}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills
                  .filter(skill => skill.category === category)
                  .map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      className="bg-gray-900 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center mb-4">
                        {skill.icon ? (
                          <img src={skill.icon} alt={skill.name} className="w-10 h-10 mr-3" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                            <span className="text-blue-400 font-bold">{skill.name.charAt(0)}</span>
                          </div>
                        )}
                        <h4 className="text-lg font-medium text-white">{skill.name}</h4>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full ${getSkillLevelColor(skill.level)} mr-2`}></span>
                        <span className="text-sm text-gray-400">{skill.level}</span>
                      </div>
                      
                      {skill.description && (
                        <p className="mt-3 text-sm text-gray-400">{skill.description}</p>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;