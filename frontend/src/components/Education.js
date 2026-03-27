import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const res = await api.get('/education');
        setEducation(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch education:', err);
        setError('Failed to load education data');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading education...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="education" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Academic <span className="text-gradient">Background</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu._id}
              className="glass-card rounded-[2rem] p-1 md:p-1.5 group hover:glow-blue transition-all duration-500"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="bg-gray-950/50 backdrop-blur-xl rounded-[1.8rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl font-black text-blue-500">{new Date(edu.startDate).getFullYear()}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h4 className="text-2xl font-black text-white tracking-tight">{edu.degree}</h4>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
                        {edu.field}
                      </span>
                      <span className="text-gray-500 font-black text-sm tracking-tighter">
                        {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xl text-blue-400 font-medium mb-6 flex items-center gap-2">
                    <span className="w-5 h-[1px] bg-blue-500"></span>
                    {edu.institution}
                  </p>

                  {edu.description && (
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative">
                      <p className="text-gray-400 font-light leading-relaxed italic text-lg">
                        "{edu.description}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;