import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../services/api';
import { FaExternalLinkAlt, FaCalendar, FaAward, FaBook } from 'react-icons/fa';

const CoursesCertifications = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/course-certifications');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <section id="courses-certifications" className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">CREDENTIALS</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            Courses & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Continuous learning and professional development in AI, data science, and modern software architecture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-700 flex flex-col h-full border border-white/5 hover:border-blue-500/30 bg-white/[0.02] hover:bg-white/[0.05]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                y: -15,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <div className="p-10 flex flex-col h-full relative">
                {/* Decorative Icon Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-700"></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-[1px] shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-700">
                    <div className="w-full h-full rounded-[1.5rem] bg-gray-950 flex items-center justify-center overflow-hidden">
                      {course.badgeImage ? (
                        <img src={getImageUrl(course.badgeImage)} alt={course.title} className="w-full h-full object-cover p-2" />
                      ) : (
                        <FaAward className="text-blue-400 text-4xl group-hover:rotate-12 transition-transform duration-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${course.type === 'Course'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      }`}>
                      {course.type}
                    </span>
                    <div className="flex items-center text-gray-500 text-[10px] font-black uppercase tracking-wider">
                      <FaCalendar className="mr-1.5 text-blue-500/50" />
                      <span>{formatDate(course.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex-grow">
                  <h3 className="text-3xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors tracking-tight leading-none">
                    {course.title}
                  </h3>
                  <p className="text-blue-500 font-black mb-6 text-sm uppercase tracking-widest">{course.provider}</p>

                  <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed text-base font-light">
                    {course.description}
                  </p>

                  {course.skillsLearnt.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                      {course.skillsLearnt.map((skill, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-[9px] px-3 py-1.5 rounded-lg uppercase tracking-wider font-black group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-white/5 mt-auto relative z-10 flex items-center justify-between">
                  {course.certificateLink ? (
                    <a
                      href={course.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-white bg-blue-600 hover:bg-blue-700 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95"
                    >
                      <FaExternalLinkAlt size={12} /> Verify Credential
                    </a>
                  ) : (
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                      ID: {course.credentialId || 'N/A'}
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

export default CoursesCertifications;