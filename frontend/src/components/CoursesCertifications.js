import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaExternalLinkAlt, FaCalendar, FaAward, FaBook } from 'react-icons/fa';

const CoursesCertifications = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/course-certifications');
        setCourses(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch courses/certifications:', err);
        setError('Failed to load courses/certifications data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <section id="courses-certifications" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading courses/certifications...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="courses-certifications" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses-certifications" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Courses & Certifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {course.badgeImage ? (
                    <img src={course.badgeImage} alt={course.title} className="w-16 h-16 object-cover rounded-lg mr-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center mr-4">
                      <FaAward className="text-white text-2xl" />
                    </div>
                  )}
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.type === 'Course' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      {course.type}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                <p className="text-blue-400 mb-2">{course.provider}</p>
                
                <div className="flex items-center text-gray-400 mb-4">
                  <FaCalendar className="mr-2" />
                  <span>{formatDate(course.date)}</span>
                </div>
                
                <p className="text-gray-300 mb-4">{course.description}</p>
                
                {course.skillsLearnt.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Learnt:</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.skillsLearnt.map((skill, idx) => (
                        <span key={idx} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.certificateLink && (
                  <a
                    href={course.certificateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    <FaExternalLinkAlt className="mr-2" /> View Certificate
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesCertifications;