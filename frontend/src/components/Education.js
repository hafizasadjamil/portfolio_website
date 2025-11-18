import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/education');
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
    <section id="education" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Education</h2>
        
        <div className="max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={edu._id}
              className="bg-gray-800 rounded-lg p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <span className="text-blue-400 font-medium">
                    {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                  </span>
                </div>
                <div className="md:w-3/4">
                  <h4 className="text-xl font-bold text-white">{edu.degree} in {edu.field}</h4>
                  <p className="text-lg text-blue-400">{edu.institution}</p>
                  {edu.description && (
                    <p className="mt-2 text-gray-300">{edu.description}</p>
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